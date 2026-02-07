import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────

// Particle counts — two layers
const BG_COUNT_DESKTOP = 300;
const BG_COUNT_MOBILE = 150;
const FG_COUNT_DESKTOP = 80;
const FG_COUNT_MOBILE = 40;

// ─────────────────────────────────────────────
// Soft circle texture (granular dot)
// ─────────────────────────────────────────────

function createDotTexture(size = 64): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;

  // Soft radial gradient — solid center fading to transparent edge
  const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.3, "rgba(255,255,255,0.85)");
  grad.addColorStop(0.6, "rgba(255,255,255,0.35)");
  grad.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ─────────────────────────────────────────────
// Particle layer builder
// ─────────────────────────────────────────────

interface ParticleLayer {
  points: THREE.Points;
  basePositions: Float32Array;
  depths: Float32Array; // normalized 0..1 (0=far, 1=near)
  material: THREE.PointsMaterial;
}

function createParticleLayer(
  count: number,
  config: {
    spreadX: number;
    spreadY: number;
    zMin: number;
    zMax: number;
    sizeMin: number;
    sizeMax: number;
    opacity: number;
    color: string;
  },
  dotTexture: THREE.Texture
): ParticleLayer {
  const positions = new Float32Array(count * 3);
  const basePositions = new Float32Array(count * 3);
  const depths = new Float32Array(count);

  const zRange = config.zMax - config.zMin;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = (Math.random() - 0.5) * config.spreadX;
    const y = (Math.random() - 0.5) * config.spreadY;
    const z = Math.random() * zRange + config.zMin;

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
    basePositions[i3] = x;
    basePositions[i3 + 1] = y;
    basePositions[i3 + 2] = z;

    // Normalize depth within this layer (0=far end, 1=near end)
    depths[i] = zRange > 0 ? (z - config.zMin) / zRange : 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // Random size per particle — use depth to scale
  const avgSize = (config.sizeMin + config.sizeMax) / 2;

  const material = new THREE.PointsMaterial({
    map: dotTexture,
    color: new THREE.Color(config.color),
    size: avgSize,
    sizeAttenuation: true,
    transparent: true,
    opacity: config.opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  return { points, basePositions, depths, material };
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

interface Hero3DProps {
  dark: boolean;
}

export default function Hero3D({ dark }: Hero3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    mainGroup: THREE.Group;
    bgLayer: ParticleLayer;
    fgLayer: ParticleLayer;
    mouse: { x: number; y: number; targetX: number; targetY: number };
    animationId: number;
    clock: THREE.Clock;
    dotTexture: THREE.Texture;
  } | null>(null);

  // ── Scene setup (runs once) ──
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const isMobile = width < 768;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    // ── Scene ──
    const scene = new THREE.Scene();

    // ── Main group for unified parallax ──
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // ── Shared dot texture ──
    const dotTexture = createDotTexture(64);

    // ── Background particle layer — many small, faint, slow ──
    const bgCount = isMobile ? BG_COUNT_MOBILE : BG_COUNT_DESKTOP;
    const bgLayer = createParticleLayer(bgCount, {
      spreadX: 22,
      spreadY: 16,
      zMin: -8,
      zMax: -1,
      sizeMin: 0.03,
      sizeMax: 0.08,
      opacity: 0.25,
      color: "#d8d4cf",
    }, dotTexture);
    mainGroup.add(bgLayer.points);

    // ── Foreground particle layer — fewer, slightly larger, more visible ──
    const fgCount = isMobile ? FG_COUNT_MOBILE : FG_COUNT_DESKTOP;
    const fgLayer = createParticleLayer(fgCount, {
      spreadX: 16,
      spreadY: 12,
      zMin: -1,
      zMax: 4,
      sizeMin: 0.06,
      sizeMax: 0.18,
      opacity: 0.45,
      color: "#e8e4df",
    }, dotTexture);
    mainGroup.add(fgLayer.points);

    // ── Mouse state ──
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // ── Entrance fade-in ──
    bgLayer.material.opacity = 0;
    fgLayer.material.opacity = 0;

    gsap.to(bgLayer.material, {
      opacity: 0.25,
      duration: 3,
      delay: 0.3,
      ease: "power2.out",
    });
    gsap.to(fgLayer.material, {
      opacity: 0.45,
      duration: 2.5,
      delay: 0.6,
      ease: "power2.out",
    });

    // ── Clock ──
    const clock = new THREE.Clock();

    // ── Render loop ──
    let animationId: number;

    const render = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Gentle group-level parallax from cursor
      mainGroup.position.x += (mouse.x * 0.25 - mainGroup.position.x) * 0.025;
      mainGroup.position.y += (mouse.y * 0.15 - mainGroup.position.y) * 0.025;

      // ── Animate background particles ──
      animateLayer(bgLayer, elapsed, mouse, {
        driftSpeed: 0.08,
        driftAmplitude: 0.06,
        cursorStrength: 0.3,
      });

      // ── Animate foreground particles ──
      animateLayer(fgLayer, elapsed, mouse, {
        driftSpeed: 0.12,
        driftAmplitude: 0.1,
        cursorStrength: 0.9,
      });

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    // ── Store state ──
    stateRef.current = {
      renderer, scene, camera, mainGroup,
      bgLayer, fgLayer, mouse, animationId, clock, dotTexture,
    };

    // ── Events ──
    const handleMouseMove = (e: MouseEvent) => {
      if (!stateRef.current) return;
      stateRef.current.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      stateRef.current.mouse.targetY = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const handleResize = () => {
      if (!stateRef.current || !containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      stateRef.current.camera.aspect = w / h;
      stateRef.current.camera.updateProjectionMatrix();
      stateRef.current.renderer.setSize(w, h);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // ── Cleanup ──
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);

      gsap.killTweensOf(bgLayer.material);
      gsap.killTweensOf(fgLayer.material);

      bgLayer.points.geometry.dispose();
      bgLayer.material.dispose();
      fgLayer.points.geometry.dispose();
      fgLayer.material.dispose();
      dotTexture.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      stateRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Theme-reactive color transition ──
  useEffect(() => {
    if (!stateRef.current) return;
    const { bgLayer, fgLayer } = stateRef.current;

    // Dark mode: warm off-white particles | Light mode: muted dark particles
    const bgColor = dark ? new THREE.Color("#d8d4cf") : new THREE.Color("#4a4a4a");
    const fgColor = dark ? new THREE.Color("#e8e4df") : new THREE.Color("#3a3a3a");

    gsap.to(bgLayer.material.color, {
      r: bgColor.r, g: bgColor.g, b: bgColor.b,
      duration: 0.8, ease: "power2.out",
    });
    gsap.to(fgLayer.material.color, {
      r: fgColor.r, g: fgColor.g, b: fgColor.b,
      duration: 0.8, ease: "power2.out",
    });
  }, [dark]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}

// ────────────────────────────────────────────
// Per-frame particle layer animation
// ─────────────────────────────────────────────

function animateLayer(
  layer: ParticleLayer,
  elapsed: number,
  mouse: { x: number; y: number },
  config: {
    driftSpeed: number;
    driftAmplitude: number;
    cursorStrength: number;
  }
) {
  const posAttr = layer.points.geometry.getAttribute("position") as THREE.BufferAttribute;
  const pos = posAttr.array as Float32Array;
  const base = layer.basePositions;
  const depths = layer.depths;
  const count = pos.length / 3;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const depth = depths[i];

    // Unique phase offset per particle — prevents sync
    const phase = i * 0.47 + i * i * 0.013;

    // Slow sine/cosine micro-drift — continuous, tiny amplitude
    const dx = Math.sin(elapsed * config.driftSpeed + phase) * config.driftAmplitude;
    const dy = Math.cos(elapsed * (config.driftSpeed * 0.85) + phase * 1.3) * (config.driftAmplitude * 0.8);

    // Cursor parallax — depth-scaled (near particles move more)
    const cx = mouse.x * depth * config.cursorStrength;
    const cy = mouse.y * depth * config.cursorStrength * 0.6;

    pos[i3] = base[i3] + dx + cx;
    pos[i3 + 1] = base[i3 + 1] + dy + cy;
    // Z unchanged
  }

  posAttr.needsUpdate = true;
}
