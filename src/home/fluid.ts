import gsap from "gsap";
import * as THREE from "three";

/**
 * Pointer-driven fluid simulation (stable-fluids style): pointer velocity is
 * splatted into a low-res velocity field, projected to be divergence-free,
 * then used to advect a density field that is drawn as a faint cream smoke.
 * A mask texture (the footer wordmark) lights up wherever density passes over
 * it, which is what makes the huge footer letters "wake" under the cursor.
 */

const COLOR = [249 / 255, 244 / 255, 238 / 255];
const INTENSITY = 0.03;
const MASK_INTENSITY = 3;
const VELOCITY_RES = 128;
const DENSITY_RES = 512;
const PRESSURE_ITERATIONS = 3;
const DENSITY_DISSIPATION = 0.98;
const VELOCITY_DISSIPATION = 1;
const PRESSURE_CLEAR = 0.5;
const SPLAT_RADIUS = 0.005;
const FORCE = 5;
const DT = 0.016;
/** Stop simulating once the pointer has been idle this many frames. */
const IDLE_FRAMES = 300;
const MASK_TEXTURE_WIDTH = 2048;

type Pair = {
  read: THREE.WebGLRenderTarget;
  write: THREE.WebGLRenderTarget;
  swap: () => void;
};

const VERT = /* glsl */ `
  precision highp float;
  in vec3 position;
  uniform vec2 texelSize;
  out vec2 vUv;
  out vec2 vL;
  out vec2 vR;
  out vec2 vT;
  out vec2 vB;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG_HEAD = /* glsl */ `
  precision highp float;
  precision highp sampler2D;
  uniform vec2 texelSize;
  in vec2 vUv;
  in vec2 vL;
  in vec2 vR;
  in vec2 vT;
  in vec2 vB;
  out vec4 fragColor;
`;

const SPLAT = /* glsl */ `
  uniform sampler2D uTarget;
  uniform float uAspect;
  uniform vec3 uColor;
  uniform vec2 uPoint;
  uniform float uRadius;
  void main() {
    vec2 p = vUv - uPoint;
    p.x *= uAspect;
    fragColor = vec4(texture(uTarget, vUv).xyz + exp(-dot(p, p) / uRadius) * uColor, 1.0);
  }
`;
const ADVECT = /* glsl */ `
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform float uDt;
  uniform float uDissipation;
  void main() {
    vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * texelSize;
    fragColor = vec4(uDissipation * texture(uSource, coord).xyz, 1.0);
  }
`;
const DIVERGENCE = /* glsl */ `
  uniform sampler2D uVelocity;
  void main() {
    float L = texture(uVelocity, vL).x;
    float R = texture(uVelocity, vR).x;
    float T = texture(uVelocity, vT).y;
    float B = texture(uVelocity, vB).y;
    vec2 C = texture(uVelocity, vUv).xy;
    if (vL.x < 0.0) L = -C.x;
    if (vR.x > 1.0) R = -C.x;
    if (vT.y > 1.0) T = -C.y;
    if (vB.y < 0.0) B = -C.y;
    fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
  }
`;
const CLEAR = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uValue;
  void main() {
    fragColor = uValue * texture(uTexture, vUv);
  }
`;
const PRESSURE = /* glsl */ `
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main() {
    float L = texture(uPressure, vL).x;
    float R = texture(uPressure, vR).x;
    float T = texture(uPressure, vT).x;
    float B = texture(uPressure, vB).x;
    float div = texture(uDivergence, vUv).x;
    fragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
  }
`;
const GRADIENT = /* glsl */ `
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main() {
    float L = texture(uPressure, vL).x;
    float R = texture(uPressure, vR).x;
    float T = texture(uPressure, vT).x;
    float B = texture(uPressure, vB).x;
    fragColor = vec4(texture(uVelocity, vUv).xy - vec2(R - L, T - B), 0.0, 1.0);
  }
`;
const DISPLAY = /* glsl */ `
  uniform sampler2D uDensity;
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform sampler2D uMask;
  uniform vec4 uMaskRect;
  uniform float uMaskIntensity;
  uniform float uMaskOpacity;
  void main() {
    float density = texture(uDensity, vUv).b;
    vec2 m = (vUv - uMaskRect.xy) / uMaskRect.zw;
    float inside = step(0.0, m.x) * step(m.x, 1.0) * step(0.0, m.y) * step(m.y, 1.0);
    float logo = texture(uMask, m).a * inside * uMaskOpacity * clamp(density * uMaskIntensity, 0.0, 1.0);
    float a = max(clamp(density * uIntensity, 0.0, 1.0), logo);
    fragColor = vec4(uColor * a, a);
  }
`;

/** Rasterises a text element (same font, size, tracking) into an alpha mask. */
function makeTextMask(el: HTMLElement): THREE.CanvasTexture | null {
  const rect = el.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const cs = getComputedStyle(el);
  const scale = MASK_TEXTURE_WIDTH / rect.width;
  const canvas = document.createElement("canvas");
  canvas.width = MASK_TEXTURE_WIDTH;
  canvas.height = Math.max(1, Math.round(rect.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const fontSize = parseFloat(cs.fontSize) * scale;
  const lineHeight = (parseFloat(cs.lineHeight) || fontSize) * (cs.lineHeight.endsWith("px") ? scale : 1);
  const paddingTop = parseFloat(cs.paddingTop) * scale;
  const letterSpacing = (parseFloat(cs.letterSpacing) || 0) * scale;
  ctx.font = `${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`;
  (ctx as unknown as { letterSpacing: string }).letterSpacing = `${letterSpacing}px`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#fff";

  const text = (el.textContent ?? "").trim().toUpperCase();
  const m = ctx.measureText(text);
  const ascent = m.fontBoundingBoxAscent ?? fontSize * 0.8;
  const descent = m.fontBoundingBoxDescent ?? fontSize * 0.2;
  // CSS centres the glyph box inside the line box ("half-leading").
  const baseline = paddingTop + (lineHeight - (ascent + descent)) / 2 + ascent;
  // Text wider than its box does not centre in CSS: it starts at the left edge and spills right.
  if (m.width > canvas.width) {
    ctx.textAlign = "left";
    ctx.fillText(text, 0, baseline);
  } else {
    ctx.fillText(text, canvas.width / 2 + letterSpacing / 2, baseline);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export function initFluidCursor(canvas: HTMLCanvasElement): () => void {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, premultipliedAlpha: true });
  } catch {
    return () => {};
  }
  renderer.setClearColor(0, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const camera = new THREE.Camera();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const quad = new THREE.Mesh(geometry);
  quad.frustumCulled = false;

  const target = (size: number, format: THREE.PixelFormat, filter: THREE.TextureFilter) =>
    new THREE.WebGLRenderTarget(size, size, {
      type: THREE.HalfFloatType,
      format,
      minFilter: filter as THREE.MinificationTextureFilter,
      magFilter: filter as THREE.MagnificationTextureFilter,
      depthBuffer: false,
    });
  const pair = (size: number, format: THREE.PixelFormat, filter: THREE.TextureFilter): Pair => ({
    read: target(size, format, filter),
    write: target(size, format, filter),
    swap() {
      [this.read, this.write] = [this.write, this.read];
    },
  });

  const density = pair(DENSITY_RES, THREE.RGBAFormat, THREE.LinearFilter);
  const velocity = pair(VELOCITY_RES, THREE.RGFormat, THREE.LinearFilter);
  const pressure = pair(VELOCITY_RES, THREE.RedFormat, THREE.NearestFilter);
  const divergence = target(VELOCITY_RES, THREE.RedFormat, THREE.NearestFilter);

  const texel = { value: new THREE.Vector2(1 / VELOCITY_RES, 1 / VELOCITY_RES) };
  const material = (frag: string, uniforms: Record<string, THREE.IUniform>) =>
    new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: VERT,
      fragmentShader: FRAG_HEAD + frag,
      uniforms: { texelSize: texel, ...uniforms },
      blending: THREE.NoBlending,
      depthTest: false,
      depthWrite: false,
    });

  const splat = material(SPLAT, {
    uTarget: { value: null },
    uAspect: { value: window.innerWidth / window.innerHeight },
    uColor: { value: new THREE.Vector3() },
    uPoint: { value: new THREE.Vector2() },
    uRadius: { value: SPLAT_RADIUS },
  });
  const advect = material(ADVECT, {
    uVelocity: { value: null },
    uSource: { value: null },
    uDt: { value: DT },
    uDissipation: { value: 1 },
  });
  const diverge = material(DIVERGENCE, { uVelocity: { value: null } });
  const clear = material(CLEAR, { uTexture: { value: null }, uValue: { value: PRESSURE_CLEAR } });
  const solve = material(PRESSURE, { uPressure: { value: null }, uDivergence: { value: divergence.texture } });
  const gradient = material(GRADIENT, { uPressure: { value: null }, uVelocity: { value: null } });
  const display = material(DISPLAY, {
    uDensity: { value: null },
    uColor: { value: new THREE.Vector3(...COLOR) },
    uIntensity: { value: INTENSITY },
    uMask: { value: null },
    uMaskRect: { value: new THREE.Vector4(-2, -2, 1, 1) },
    uMaskIntensity: { value: MASK_INTENSITY },
    uMaskOpacity: { value: 1 },
  });

  const run = (mat: THREE.RawShaderMaterial, rt: THREE.WebGLRenderTarget | null) => {
    quad.material = mat;
    renderer.setRenderTarget(rt);
    renderer.render(quad, camera);
  };

  // ── footer wordmark mask ──
  let maskEl: HTMLElement | null = null;
  let maskTex: THREE.CanvasTexture | null = null;
  let maskKey = "";
  const updateMask = () => {
    const el = document.querySelector<HTMLElement>("[data-fluid-mask]");
    const rect = el?.getBoundingClientRect();
    const visible = !!rect && rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0;
    if (!el || !rect || !visible) {
      (display.uniforms.uMaskRect.value as THREE.Vector4).set(-2, -2, 1, 1);
      return;
    }
    const key = `${Math.round(rect.width)}x${Math.round(rect.height)}`;
    if (el !== maskEl || key !== maskKey) {
      maskTex?.dispose();
      maskTex = makeTextMask(el);
      maskEl = el;
      maskKey = key;
    }
    if (!maskTex) return;
    let opacity = 1;
    for (let n: HTMLElement | null = el; n; n = n.parentElement) opacity *= parseFloat(getComputedStyle(n).opacity);
    display.uniforms.uMask.value = maskTex;
    display.uniforms.uMaskOpacity.value = opacity ** 4;
    (display.uniforms.uMaskRect.value as THREE.Vector4).set(
      rect.left / window.innerWidth,
      1 - rect.bottom / window.innerHeight,
      rect.width / window.innerWidth,
      rect.height / window.innerHeight
    );
  };

  // ── pointer input ──
  const splats: { x: number; y: number; dx: number; dy: number }[] = [];
  let idle = Infinity;
  let lastX: number | null = null;
  let lastY: number | null = null;
  const onMove = (e: PointerEvent) => {
    if (lastX !== null && lastY !== null && (e.clientX !== lastX || e.clientY !== lastY)) {
      splats.push({
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
        dx: (e.clientX - lastX) * FORCE,
        dy: (lastY - e.clientY) * FORCE,
      });
      idle = 0;
    }
    lastX = e.clientX;
    lastY = e.clientY;
  };
  const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    splat.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
  };
  window.addEventListener("pointermove", onMove);
  window.addEventListener("resize", onResize);

  const frame = () => {
    if (idle++ > IDLE_FRAMES) return;
    splats.splice(0).forEach(({ x, y, dx, dy }) => {
      splat.uniforms.uPoint.value.set(x, y);
      splat.uniforms.uColor.value.set(dx, dy, 1);
      splat.uniforms.uTarget.value = velocity.read.texture;
      run(splat, velocity.write);
      velocity.swap();
      splat.uniforms.uTarget.value = density.read.texture;
      run(splat, density.write);
      density.swap();
    });

    diverge.uniforms.uVelocity.value = velocity.read.texture;
    run(diverge, divergence);

    clear.uniforms.uTexture.value = pressure.read.texture;
    run(clear, pressure.write);
    pressure.swap();
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      solve.uniforms.uPressure.value = pressure.read.texture;
      run(solve, pressure.write);
      pressure.swap();
    }

    gradient.uniforms.uPressure.value = pressure.read.texture;
    gradient.uniforms.uVelocity.value = velocity.read.texture;
    run(gradient, velocity.write);
    velocity.swap();

    advect.uniforms.uVelocity.value = velocity.read.texture;
    advect.uniforms.uSource.value = velocity.read.texture;
    advect.uniforms.uDissipation.value = VELOCITY_DISSIPATION;
    run(advect, velocity.write);
    velocity.swap();

    advect.uniforms.uVelocity.value = velocity.read.texture;
    advect.uniforms.uSource.value = density.read.texture;
    advect.uniforms.uDissipation.value = DENSITY_DISSIPATION;
    run(advect, density.write);
    density.swap();

    updateMask();
    display.uniforms.uDensity.value = density.read.texture;
    run(display, null);
  };
  gsap.ticker.add(frame);

  return () => {
    gsap.ticker.remove(frame);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("resize", onResize);
    [density, velocity, pressure].forEach((p) => {
      p.read.dispose();
      p.write.dispose();
    });
    divergence.dispose();
    [splat, advect, diverge, clear, solve, gradient, display].forEach((m) => m.dispose());
    geometry.dispose();
    maskTex?.dispose();
    // Not forceContextLoss(): that would permanently kill the canvas and break a
    // StrictMode / hot-reload remount, which reuses the same <canvas>.
    renderer.dispose();
  };
}
