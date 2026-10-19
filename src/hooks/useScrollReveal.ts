import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseScrollRevealOptions {
  /** Pixel offset to translate up from before revealing. Default 60. */
  y?: number;
  /** Animation duration in seconds. Default 0.9. */
  duration?: number;
  /** Stagger delay multiplier applied to `delayIndex`, in seconds. Default 0.1. */
  staggerStep?: number;
  /** Index used with `staggerStep` to offset this element's start time (e.g. for cards in a grid). */
  delayIndex?: number;
  /** ScrollTrigger `start` value. Default "top 88%". */
  start?: string;
  /** Skip the reveal animation entirely (element renders at rest). Useful for prefers-reduced-motion. */
  disabled?: boolean;
}

/**
 * Generic "fade + slide up on scroll into view" reveal, replacing the
 * ad-hoc GSAP/ScrollTrigger blocks that used to be duplicated per component.
 */
export function useScrollReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  {
    y = 60,
    duration = 0.9,
    staggerStep = 0.1,
    delayIndex = 0,
    start = "top 88%",
    disabled = false,
  }: UseScrollRevealOptions = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (disabled || prefersReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(el, { opacity: 0, y });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration,
          delay: delayIndex * staggerStep,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);
}
