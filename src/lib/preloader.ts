// Shared state between the home Preloader and anything that has to wait for it.
// Decided once at module load so every consumer agrees regardless of effect order.
export const PRELOADER_SESSION_KEY = "df-preloader-shown";
/** Fired while the reveal is under way: the page can wire up its scripts now. */
export const PRELOADER_INIT_EVENT = "preloader:init";
/** Fired when the overlay has fully left. */
export const PRELOADER_DONE_EVENT = "preloader:done";

let active =
  typeof window !== "undefined" &&
  !window.sessionStorage.getItem(PRELOADER_SESSION_KEY) &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True while the preloader is (or is about to be) on screen. */
export function isPreloaderActive() {
  return active;
}

export function markPreloaderInit() {
  window.dispatchEvent(new Event(PRELOADER_INIT_EVENT));
}

export function finishPreloader() {
  if (!active) return;
  active = false;
  window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
}
