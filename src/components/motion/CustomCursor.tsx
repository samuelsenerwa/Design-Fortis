import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Small lerped dot/ring cursor replacement. Desktop (fine-pointer) only —
 * never mounts on touch devices or under prefers-reduced-motion.
 *
 * Two hover conventions on any element:
 *  - `data-cursor="hover"` — enlarges the plain ring.
 *  - `data-cursor-label="View Gallery"` — swaps the dot/ring for a larger
 *    circle with a centered text label (used for gallery/zoom affordances).
 */
export default function CustomCursor() {
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    const canHover = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return canHover && !prefersReducedMotion;
  });
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("cursor-hide", enabled);
    return () => document.documentElement.classList.remove("cursor-hide");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    const labelEl = labelRef.current;
    if (!ring || !dot || !labelEl) return;

    const targets = [ring, dot, labelEl];
    const moveX = targets.map((el) => gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" }));
    const moveY = targets.map((el) => gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" }));

    const handleMove = (e: MouseEvent) => {
      moveX.forEach((fn) => fn(e.clientX));
      moveY.forEach((fn) => fn(e.clientY));
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const labelTarget = target?.closest<HTMLElement>("[data-cursor-label]");
      const hoverTarget = target?.closest('[data-cursor="hover"]');

      setLabel(labelTarget?.dataset.cursorLabel ?? null);

      gsap.to(ring, {
        opacity: labelTarget ? 0 : 1,
        scale: hoverTarget ? 2.2 : 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(dot, { opacity: labelTarget ? 0 : 1, duration: 0.3 });
      gsap.to(labelEl, {
        opacity: labelTarget ? 1 : 0,
        scale: labelTarget ? 1 : 0.8,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-999 h-1.5 w-1.5 rounded-full bg-foreground pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-999 h-8 w-8 rounded-full border border-foreground pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        aria-hidden="true"
      />
      <div
        ref={labelRef}
        className="fixed top-0 left-0 z-999 flex items-center justify-center h-32 w-32 rounded-full border border-white/70 bg-black/10 backdrop-blur-sm pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0"
        aria-hidden="true"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-white text-center px-2">
          {label}
        </span>
      </div>
    </>
  );
}
