precision highp float;
varying vec2 vUv;

uniform sampler2D uTrail;
uniform vec2 uTrailTexel;  // 1.0 / trail render target resolution
uniform vec3 uColorA;      // base/background tone
uniform vec3 uColorB;      // warm highlight tone
uniform float uIntensity;  // displacement strength

void main() {
  float tc = texture2D(uTrail, vUv).r;
  float tl = texture2D(uTrail, vUv - vec2(uTrailTexel.x, 0.0)).r;
  float tr = texture2D(uTrail, vUv + vec2(uTrailTexel.x, 0.0)).r;
  float tt = texture2D(uTrail, vUv + vec2(0.0, uTrailTexel.y)).r;
  float tb = texture2D(uTrail, vUv - vec2(0.0, uTrailTexel.y)).r;

  // Gradient of the trail field — used to refract/warp the sampling position,
  // giving the liquid/displacement look rather than a flat glow.
  vec2 gradient = vec2(tr - tl, tt - tb);
  vec2 warpedUv = vUv + gradient * uIntensity;

  float d = distance(warpedUv, vec2(0.5));
  float base = smoothstep(0.9, 0.0, d);
  float glow = clamp(tc * 1.5, 0.0, 1.0);

  vec3 color = mix(uColorA, uColorB, clamp(base * 0.35 + glow, 0.0, 1.0));
  float alpha = clamp(base * 0.45 + glow * 0.9, 0.0, 1.0);

  gl_FragColor = vec4(color, alpha);
}
