import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const SESSION_KEY = "df-preloader-shown";

/**
 * Full-screen loading overlay with a percentage counter, shown once per
 * browser session (not on every SPA route change). Exits via the same
 * clip-path wipe used by the mobile menu for a consistent motion language.
 */
export default function Preloader() {
  const [mounted, setMounted] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.sessionStorage.getItem(SESSION_KEY)) return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return true;
  });
  const overlayRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!mounted) return;
    window.sessionStorage.setItem(SESSION_KEY, "1");

    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(overlayRef.current, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.7,
          ease: "power4.inOut",
          onComplete: () => setMounted(false),
        });
      },
    });

    tl.to(counter, {
      value: 100,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = String(Math.round(counter.value)).padStart(2, "0");
        }
      },
    });

    return () => {
      tl.kill();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-200 flex flex-col items-center justify-center bg-black text-white"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden="true"
    >
      <p className="text-xs font-light tracking-[0.4em] uppercase text-white/40 mb-4">
        Design Fortis
      </p>
      <div className="text-5xl md:text-6xl font-extralight tabular-nums tracking-tight">
        <span ref={countRef}>00</span>
        <span className="text-white/40">%</span>
      </div>
    </div>
  );
}
