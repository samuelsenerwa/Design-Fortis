import gsap from "gsap";
import type Lenis from "lenis";
import { animateVisibleElements, durL, reducedMotion } from "./motion";
import { lockScroll, unlockScroll } from "./runtime";

/**
 * Home <-> About page transition (the reference's Barba "default" transition).
 *
 * Leaving: the current page is frozen in place, its visible copy hides, and it scales
 * down to 75% while fading into the dark ground.
 * Entering: the new page is revealed by a hole that starts as the whole viewport and
 * closes towards the centre, ending as a thin horizontal bar. The old page shows
 * through the hole.
 *
 * With React Router the old page unmounts as soon as the route changes, so the click
 * handler snapshots it (a DOM clone) first and the next page plays the entry.
 *
 * Built for the compositor: the reference clips the *new* page with a polygon, which
 * makes the browser mask the whole page every frame. Here the new page is left alone
 * and the old page lives in a "stage" above it that is clipped by a plain rectangle
 * (cheap) and faded with a solid veil instead of an opacity change on the whole page.
 */

/** Routes that run the Lenval-style runtime and so can hand over to each other. */
const LV_ROUTES = new Set(["/", "/about"]);
/** The ground the old page fades into. */
const GROUND = "#211a19";
/** Above the fixed header (1200), modals and the cookie banner. */
const STAGE_Z = "100000";

interface Leaving {
  stage: HTMLElement;
  clone: HTMLElement;
  veil: HTMLElement;
  /** Width the classic scrollbar takes; locking scroll removes it, so we pad it back. */
  bar: number;
}

let pending: Leaving | null = null;
let running = false;
let skipWipeUntil = 0;
const settledListeners = new Set<() => void>();

/** True from the click until the entry has finished (or been abandoned). */
export function isTransitioning() {
  return pending !== null || running;
}

/** Runs `fn` once the page transition is over, so heavy start-up work can wait for it. */
export function onTransitionSettled(fn: () => void) {
  settledListeners.add(fn);
  return () => {
    settledListeners.delete(fn);
  };
}

function settled() {
  if (isTransitioning()) return;
  const fns = [...settledListeners];
  settledListeners.clear();
  fns.forEach((fn) => fn());
}

/**
 * The generic black route wipe must stay out of the way of this transition. Time-based
 * rather than a one-shot flag so React's dev double-invoked effects agree with each other.
 */
export function shouldSkipWipe() {
  return Date.now() < skipWipeUntil;
}

function discard() {
  pending?.stage.remove();
  pending = null;
  settled();
}

function prepareLeave(root: HTMLElement) {
  if (pending || running || reducedMotion()) return;
  const scrollY = window.scrollY;
  const bar = window.innerWidth - document.documentElement.clientWidth;

  const clone = root.cloneNode(true) as HTMLElement;
  // Live canvases (pointer-trail shader) can't be cloned; videos become still frames.
  clone.querySelectorAll("canvas").forEach((c) => c.remove());
  const sources = root.querySelectorAll("video");
  clone.querySelectorAll("video").forEach((video, i) => {
    const source = sources[i];
    if (source && source.readyState >= 2 && source.videoWidth) {
      const frame = document.createElement("canvas");
      frame.width = source.videoWidth;
      frame.height = source.videoHeight;
      frame.getContext("2d")?.drawImage(source, 0, 0);
      frame.className = video.className;
      frame.style.cssText = source.style.cssText;
      video.replaceWith(frame);
    } else {
      video.remove();
    }
  });
  clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  Object.assign(clone.style, {
    position: "absolute",
    top: `${-scrollY}px`,
    left: "0",
    right: "0",
    // Own formatting context at a fixed size, so style/layout work on the new page
    // (Lenis and ScrollTrigger read layout constantly) never has to revisit this one.
    height: `${root.scrollHeight}px`,
    contain: "strict",
    willChange: "transform",
  });

  const veil = document.createElement("div");
  Object.assign(veil.style, { position: "absolute", inset: "0", background: GROUND, opacity: "0" });

  const stage = document.createElement("div");
  stage.setAttribute("aria-hidden", "true");
  stage.setAttribute("inert", "");
  Object.assign(stage.style, {
    position: "fixed",
    top: "0",
    left: "0",
    bottom: "0",
    right: `${bar}px`,
    zIndex: STAGE_Z,
    background: GROUND,
    pointerEvents: "none",
    overflow: "hidden",
    contain: "strict",
  });
  stage.append(clone, veil);
  document.body.appendChild(stage);
  gsap.set(clone, { transformOrigin: `center ${scrollY + window.innerHeight / 2}px`, translateZ: 10 });

  pending = { stage, clone, veil, bar };
  skipWipeUntil = Date.now() + 1500;
  // If the navigation never happens, don't leave a ghost page behind.
  window.setTimeout(() => {
    if (pending?.stage === stage) discard();
  }, 2000);
}

/** Snapshots the page when an in-app link to another runtime page is clicked. */
export function armPageTransitions(root: HTMLElement) {
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
    if (!link || link.target === "_blank" || link.origin !== window.location.origin) return;
    if (!LV_ROUTES.has(link.pathname) || link.pathname === window.location.pathname) return;
    prepareLeave(root);
  };
  root.addEventListener("click", onClick, true);
  return () => root.removeEventListener("click", onClick, true);
}

export interface Entry {
  /** Starts the animation. Call once the page's scripts are initialised. */
  play: () => void;
  /** Aborts and tidies up (the page unmounted before it could play). */
  cancel: () => void;
}

/**
 * If a page was snapshotted on the way here, keeps the new page hidden behind that
 * snapshot (so the screen looks unchanged) and returns the entry to play later.
 * Playing is split from beginning on purpose: mounting and initialising the new page
 * blocks the main thread, and tweens started before that would skip their first
 * (most visible) frames.
 */
export function beginEnter(root: HTMLElement, lenis: Lenis): Entry | null {
  if (!pending) return null;
  const leaving = pending;
  const { stage, clone, veil, bar } = leaving;
  pending = null;
  running = true;

  lockScroll(lenis);
  const header = root.querySelector<HTMLElement>(".header");
  const width = window.innerWidth - bar;
  const height = window.innerHeight;
  root.style.paddingRight = `${bar}px`;
  if (header) header.style.paddingRight = `${bar}px`;
  // Infinite decorative loops would force a repaint of the whole page every frame.
  root.classList.add("is-transitioning");

  // The hole is the stage's visible rectangle: the whole viewport at the start, closing to
  // a bar 10% of the width wide and zero height.
  const open = "inset(0px 0px 0px 0px)";
  const closed = `inset(${0.5 * height}px ${0.45 * width}px ${0.5 * height}px ${0.45 * width}px)`;
  stage.style.clipPath = open;

  let tweens: gsap.core.Tween[] = [];
  let frame = 0;
  let played = false;
  const finish = () => {
    cancelAnimationFrame(frame);
    tweens.forEach((t) => t.kill());
    stage.remove();
    gsap.ticker.lagSmoothing(0);
    gsap.set(root, { clearProps: "paddingRight" });
    root.classList.remove("is-transitioning");
    if (header) header.style.paddingRight = "";
    running = false;
    settled();
  };

  return {
    play() {
      played = true;
      // Two frames: let the (now initialised) page paint once so the first tween frame is cheap.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          // A slow frame must stretch the animation, not skip ahead in it.
          gsap.ticker.lagSmoothing(500, 33);
          animateVisibleElements(clone, "hide");
          const fx = { duration: durL, ease: "InOut" };
          tweens = [
            gsap.to(clone, { scale: 0.75, ...fx }),
            gsap.to(veil, { opacity: 1, ...fx }),
            gsap.to(stage, {
              clipPath: closed,
              ...fx,
              onComplete: () => {
                finish();
                unlockScroll(lenis);
              },
            }),
          ];
        });
      });
    },
    cancel() {
      unlockScroll(lenis);
      if (played) {
        finish();
        return;
      }
      // Unmounted before playing (React's dev double-mount): hand the snapshot back so
      // the next mount can pick it up, and leave this page exactly as it was.
      cancelAnimationFrame(frame);
      root.classList.remove("is-transitioning");
      gsap.set(root, { clearProps: "paddingRight" });
      if (header) header.style.paddingRight = "";
      running = false;
      pending = leaving;
    },
  };
}
