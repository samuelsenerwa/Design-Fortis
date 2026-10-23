let cached: boolean | null = null;

/**
 * Cheap, cached check for WebGL availability. Used to gate optional WebGL
 * effects (LiquidDistortion, Hero3D) so they fail gracefully — rendering
 * nothing — instead of throwing on unsupported browsers/devices.
 */
export function isWebGLAvailable(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    cached = !!gl && typeof WebGLRenderingContext !== "undefined";
  } catch {
    cached = false;
  }
  return cached;
}
