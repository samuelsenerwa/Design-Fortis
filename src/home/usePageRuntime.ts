import { useEffect, useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { destroyLenis, ensureLenis } from "./lenis";
import { durL, fontsReady } from "./motion";
import { armPageTransitions, beginEnter, onTransitionSettled } from "./pageTransition";
import { initHomeScripts } from "./runtime";
import type Lenis from "lenis";

/** Page-specific behaviour layered on the shared runtime; returns its own cleanup. */
export type PageScripts = (root: HTMLElement, lenis: Lenis) => () => void;

/**
 * Boots the Lenval-style page runtime (vw sizing, Lenis, scroll reveals, modals)
 * for a route that has no intro loader. The home page wires the same pieces itself
 * because it waits on the preloader.
 */
export function usePageRuntime(
  rootRef: RefObject<HTMLElement | null>,
  pageRef: RefObject<HTMLElement | null>,
  pageScripts?: PageScripts
) {
  // Every length is sized off the root font-size; set it before paint.
  useLayoutEffect(() => {
    document.documentElement.classList.add("lv-root");
    return () => document.documentElement.classList.remove("lv-root");
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const page = pageRef.current;
    if (!root || !page) return;

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const lenis = ensureLenis();
    let teardown: (() => void) | null = null;
    let teardownPage: (() => void) | null = null;
    let cancelled = false;

    const entry = beginEnter(root as HTMLElement, lenis);
    fontsReady().then(() => {
      if (cancelled) return;
      teardown = initHomeScripts(root as HTMLElement, lenis, entry ? onTransitionSettled : undefined);
      teardownPage = pageScripts?.(root as HTMLElement, lenis) ?? null;
      entry?.play();
    });
    const offTransitions = armPageTransitions(root as HTMLElement);
    if (!entry) gsap.fromTo(page, { opacity: 0 }, { opacity: 1, duration: durL, ease: "Out" });

    return () => {
      cancelled = true;
      entry?.cancel();
      offTransitions();
      teardownPage?.();
      teardown?.();
      destroyLenis();
      document.documentElement.style.overflow = "";
      document.documentElement.style.removeProperty("--scrollbar-width");
      window.history.scrollRestoration = previousRestoration;
    };
  }, [rootRef, pageRef, pageScripts]);
}
