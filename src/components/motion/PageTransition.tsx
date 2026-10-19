import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Lightweight clip-path wipe played over route changes, using the same
 * motion vocabulary as the Navbar mobile menu / Preloader. Runs after the
 * new route has painted, so it never blocks ScrollTrigger.refresh() or a
 * page's own scroll-to-top effect.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const overlay = overlayRef.current;
    if (!overlay) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    gsap.set(overlay, { clipPath: "inset(0% 0% 100% 0%)" });
    gsap
      .timeline()
      .to(overlay, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45, ease: "power3.inOut" })
      .to(overlay, { clipPath: "inset(100% 0% 0% 0%)", duration: 0.45, ease: "power3.inOut", delay: 0.05 });
  }, [location.pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-150 bg-black pointer-events-none"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
        aria-hidden="true"
      />
      {children}
    </>
  );
}
