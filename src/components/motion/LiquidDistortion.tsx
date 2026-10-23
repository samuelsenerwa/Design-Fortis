import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { isWebGLAvailable } from "../../hooks/useWebGLSupport";
import passthroughVert from "../../shaders/passthrough.vert.glsl?raw";
import trailFrag from "../../shaders/trail.frag.glsl?raw";
import displayFrag from "../../shaders/display.frag.glsl?raw";

interface LiquidDistortionProps {
  dark: boolean;
  className?: string;
}

// Trail buffer is rendered well below display resolution — the effect is a
// heavily blurred, low-frequency field, so this keeps GPU cost small.
const TRAIL_SCALE = 0.25;
const MAX_TRAIL_DIM = 320;

/**
 * Cursor-trail liquid/displacement effect: a decaying trail of the cursor's
 * recent movement is accumulated into a low-res render target (ping-pong
 * buffers), then used as a displacement/refraction map in a display shader
 * that warps a soft base gradient — producing the drifting, warm "liquid
 * light" look. Desktop-only, WebGL-gated, paused off-screen, fully disposed
 * on unmount.
 */
export default function LiquidDistortion({ dark, className = "" }: LiquidDistortionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    const canHover = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return canHover && !prefersReducedMotion && isWebGLAvailable();
  });

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    } catch {
      // Renderer construction can only fail once actually attempted here —
      // react to that external (WebGL context) failure by disabling the effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEnabled(false);
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quadGeometry = new THREE.PlaneGeometry(2, 2);

    const trailWidth = Math.min(MAX_TRAIL_DIM, Math.round(width * TRAIL_SCALE));
    const trailHeight = Math.min(MAX_TRAIL_DIM, Math.round(height * TRAIL_SCALE));

    const rtOptions = { type: THREE.UnsignedByteType, depthBuffer: false, stencilBuffer: false };
    let targetA = new THREE.WebGLRenderTarget(trailWidth, trailHeight, rtOptions);
    let targetB = new THREE.WebGLRenderTarget(trailWidth, trailHeight, rtOptions);

    const trailMaterial = new THREE.ShaderMaterial({
      vertexShader: passthroughVert,
      fragmentShader: trailFrag,
      uniforms: {
        uPrevTrail: { value: targetA.texture },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uStrength: { value: 0 },
        uDecay: { value: 0.94 },
        uRadius: { value: 0.08 },
      },
    });

    const colors = dark
      ? { a: new THREE.Color(0.06, 0.055, 0.05), b: new THREE.Color(0.92, 0.8, 0.62) }
      : { a: new THREE.Color(1, 1, 1), b: new THREE.Color(0.62, 0.52, 0.4) };

    const displayMaterial = new THREE.ShaderMaterial({
      vertexShader: passthroughVert,
      fragmentShader: displayFrag,
      transparent: true,
      uniforms: {
        uTrail: { value: targetB.texture },
        uTrailTexel: { value: new THREE.Vector2(1 / trailWidth, 1 / trailHeight) },
        uColorA: { value: colors.a },
        uColorB: { value: colors.b },
        uIntensity: { value: 0.18 },
      },
    });

    const trailScene = new THREE.Scene();
    trailScene.add(new THREE.Mesh(quadGeometry, trailMaterial));

    const displayScene = new THREE.Scene();
    displayScene.add(new THREE.Mesh(quadGeometry, displayMaterial));

    const mouse = { x: 0.5, y: 0.5, prevX: 0.5, prevY: 0.5 };
    let targetStrength = 0;
    let currentStrength = 0;
    let animationId = 0;
    let isVisible = true;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = 1 - (e.clientY - rect.top) / rect.height;

      const dx = mouse.x - mouse.prevX;
      const dy = mouse.y - mouse.prevY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      targetStrength = Math.min(speed * 18, 1);
    };

    const render = () => {
      animationId = requestAnimationFrame(render);
      if (!isVisible) return;

      currentStrength += (targetStrength - currentStrength) * 0.2;
      targetStrength *= 0.85;

      trailMaterial.uniforms.uPrevTrail.value = targetA.texture;
      trailMaterial.uniforms.uMouse.value.set(mouse.x, mouse.y);
      trailMaterial.uniforms.uStrength.value = currentStrength;

      renderer.setRenderTarget(targetB);
      renderer.render(trailScene, camera);

      displayMaterial.uniforms.uTrail.value = targetB.texture;
      renderer.setRenderTarget(null);
      renderer.render(displayScene, camera);

      // swap
      [targetA, targetB] = [targetB, targetA];
    };
    animationId = requestAnimationFrame(render);

    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      renderer.setSize(width, height);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(container);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);

      quadGeometry.dispose();
      trailMaterial.dispose();
      displayMaterial.dispose();
      targetA.dispose();
      targetB.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [enabled, dark]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
