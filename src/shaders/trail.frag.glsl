precision highp float;
varying vec2 vUv;

uniform sampler2D uPrevTrail;
uniform vec2 uMouse;       // normalized 0..1, UV space
uniform float uStrength;   // 0..1, scaled by cursor speed
uniform float uDecay;      // e.g. 0.95 — how quickly the trail fades
uniform float uRadius;     // stamp radius in UV space

void main() {
  vec4 prev = texture2D(uPrevTrail, vUv) * uDecay;

  float dist = distance(vUv, uMouse);
  float stamp = smoothstep(uRadius, 0.0, dist) * uStrength;

  gl_FragColor = vec4(prev.rgb + vec3(stamp), 1.0);
}
