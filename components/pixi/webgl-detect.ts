/** Cached WebGL availability check. */

let _cachedResult: boolean | null = null;

export function isWebGLAvailable(): boolean {
  if (_cachedResult !== null) return _cachedResult;

  if (typeof document === "undefined") {
    _cachedResult = false;
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    _cachedResult = gl !== null;
  } catch {
    _cachedResult = false;
  }

  return _cachedResult;
}
