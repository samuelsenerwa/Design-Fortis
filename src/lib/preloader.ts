// Shared state between the Preloader overlay and anything that should wait
// for it (e.g. the Hero intro). Decided once at module load so every consumer
// sees the same answer regardless of effect ordering.
export const PRELOADER_SESSION_KEY = "df-preloader-shown";
export const PRELOADER_DONE_EVENT = "preloader:done";

let active =
  typeof window !== "undefined" &&
  !window.sessionStorage.getItem(PRELOADER_SESSION_KEY) &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True while the preloader is (or is about to be) on screen. */
export function isPreloaderActive() {
  return active;
}

export function finishPreloader() {
  if (!active) return;
  active = false;
  window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
}
