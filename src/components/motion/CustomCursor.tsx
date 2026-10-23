import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Single large, transparent, thin-bordered circle that trails the cursor
 * with inertial lag — matching the reference site's cursor treatment.
 * Unlike a typical "custom cursor" replacement, the native OS cursor is
 * never hidden; this circle is a secondary affordance layered on top.
 *
 * Conventions (set on any element):
 *  - `data-cursor="hover"` — shows the bare circle (no text).
 *  - `data-cursor-label="View Gallery"` — shows the circle with a centered
 *    uppercase text label. The attribute value can change while hovered
 *    (e.g. toggling "Zoom In" / "Zoom Out") and the label updates live.
 *
 * Desktop (fine-pointer) only; never mounts under prefers-reduced-motion.
 */
export default function CustomCursor() {
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    const canHover = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return canHover && !prefersReducedMotion;
  });
  const circleRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const circle = circleRef.current;
    if (!circle) return;

    const moveX = gsap.quickTo(circle, "x", { duration: 0.5, ease: "power3.out" });
    const moveY = gsap.quickTo(circle, "y", { duration: 0.5, ease: "power3.out" });

    const handleMove = (e: MouseEvent) => {
      moveX(e.clientX);
      moveY(e.clientY);

      // Poll the hovered element's current data-cursor-label on every move
      // (not just mouseover) so labels that change while the cursor stays
      // in place — e.g. a zoom toggle — are picked up immediately.
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const target = el?.closest<HTMLElement>('[data-cursor="hover"], [data-cursor-label]');
      const nextLabel = target?.dataset.cursorLabel ?? (target ? "" : null);

      setLabel((prev) => (prev === nextLabel ? prev : nextLabel));
      gsap.to(circle, {
        opacity: target ? 1 : 0,
        duration: 0.25,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={circleRef}
      className="fixed top-0 left-0 z-999 flex items-center justify-center h-42.5 w-42.5 rounded-full border border-white pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-difference opacity-0"
      aria-hidden="true"
    >
      {label && (
        <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-white text-center px-2">
          {label}
        </span>
      )}
    </div>
  );
}
