import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

interface SmoothScrollProviderProps {
  children: ReactNode;
  /** Off on routes that bring their own scroll engine (the home page uses Lenis). */
  enabled?: boolean;
}

/**
 * Wraps the app in GSAP's ScrollSmoother for an inertial smooth-scroll feel
 * that keeps ScrollTrigger-driven reveals in sync. Falls back to native
 * scroll entirely under prefers-reduced-motion or on touch devices (native
 * momentum scroll already feels good there, and it avoids fighting mobile
 * browser chrome/URL-bar show-hide behavior).
 */
export default function SmoothScrollProvider({ children, enabled = true }: SmoothScrollProviderProps) {
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const location = useLocation();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (!enabled || prefersReducedMotion || isCoarsePointer) return;

    smootherRef.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.1,
      effects: false,
      normalizeScroll: true,
    });

    return () => {
      smootherRef.current?.kill();
      smootherRef.current = null;
    };
  }, [enabled]);

  // Refresh ScrollTrigger measurements whenever the route changes (SPA
  // navigation can change document height without a full reload).
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
