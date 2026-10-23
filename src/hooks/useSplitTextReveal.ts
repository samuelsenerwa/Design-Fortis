import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface UseSplitTextRevealOptions {
  /** Split granularity. Default "words". */
  type?: "words" | "chars" | "lines" | "words, chars" | "lines, words";
  /** Stagger between each split unit, in seconds. Default 0.03. */
  stagger?: number;
  /** Delay before the animation starts, in seconds. Default 0. */
  delay?: number;
  /** Animation duration in seconds. Default 0.7. */
  duration?: number;
  /** Run once on mount rather than on scroll-into-view (used for hero headings). Default true. */
  immediate?: boolean;
}

/**
 * Splits text into words/chars and animates them in with a stagger.
 * Falls back to a plain opacity fade (no split) under prefers-reduced-motion.
 */
export function useSplitTextReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { type = "words", stagger = 0.03, delay = 0, duration = 0.7, immediate = true }: UseSplitTextRevealOptions = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    let split: SplitText | undefined;
    let tween: gsap.core.Tween | undefined;

    const animate = () => {
      split = SplitText.create(el, { type, mask: type.includes("lines") ? "lines" : undefined });
      const targets = type.includes("chars") ? split.chars : type.includes("lines") ? split.lines : split.words;
      gsap.set(targets, { opacity: 0, y: "60%" });
      tween = gsap.to(targets, {
        opacity: 1,
        y: "0%",
        duration,
        delay,
        stagger,
        ease: "power3.out",
      });
    };

    let scrollTrigger: ScrollTrigger | undefined;

    if (immediate) {
      animate();
    } else {
      scrollTrigger = ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: animate });
    }

    return () => {
      scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
