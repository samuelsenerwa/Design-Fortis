import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { Volume2, VolumeX } from "lucide-react";
import Button from "../ui/Button";
import ResponsiveImage from "../ui/ResponsiveImage";
import { getLargestUrl } from "../../lib/imageManifest";
import { PRELOADER_DONE_EVENT, isPreloaderActive } from "../../lib/preloader";
import heroVideoSrc from "../../assets/hero_video.mp4";

gsap.registerPlugin(SplitText);

// The hero is intentionally always dark (full-bleed video/poster + white
// text), independent of the site-wide light/dark theme toggle — matching
// the reference design's treatment of its hero section.
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  // Decide whether to load/play the (heavier) video at all — skip it on
  // small viewports or when the user has asked for reduced data usage.
  const [useVideo] = useState(() => {
    if (typeof window === "undefined") return false;
    const isNarrow = window.matchMedia("(max-width: 768px)").matches;
    const prefersReducedData = window.matchMedia("(prefers-reduced-data: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;
    return !isNarrow && !prefersReducedData && !saveData;
  });
  const [muted, setMuted] = useState(true);

  // Pause the video when the hero scrolls out of view.
  useEffect(() => {
    if (!useVideo || !sectionRef.current || !videoRef.current) return;
    const video = videoRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.1 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [useVideo]);

  // Intro choreography: split heading into words, stagger them in, then
  // fade the subcopy/CTA. Skipped entirely under prefers-reduced-motion.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!headingRef.current || !subRef.current || !ctaRef.current) return;

    if (prefersReducedMotion) {
      gsap.set([subRef.current, ctaRef.current], { opacity: 1 });
      return;
    }

    const split = SplitText.create(headingRef.current, { type: "words" });
    gsap.set(split.words, { opacity: 0, y: "60%" });
    gsap.set([subRef.current, ctaRef.current], { opacity: 0, y: 16 });

    // Hold the intro until the preloader has finished revealing the hero.
    const waiting = isPreloaderActive();
    const tl = gsap.timeline({ delay: waiting ? 0 : 0.3, paused: waiting });
    const start = () => tl.delay(0.15).play();
    if (waiting) window.addEventListener(PRELOADER_DONE_EVENT, start, { once: true });
    tl.to(split.words, { opacity: 1, y: "0%", duration: 0.9, stagger: 0.06, ease: "power3.out" })
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.4")
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5");

    return () => {
      window.removeEventListener(PRELOADER_DONE_EVENT, start);
      tl.kill();
      split.revert();
    };
  }, []);

  const posterUrl = getLargestUrl("hero_poster", "jpg");

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-black">
      {useVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={heroVideoSrc}
          poster={posterUrl}
          autoPlay
          muted={muted}
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <ResponsiveImage
          name="hero_poster"
          alt="Design Fortis — architectural design and build"
          role="hero"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Dark gradient scrim so overlaid text stays legible on any footage */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {useVideo && (
        <button
          onClick={() => setMuted((m) => !m)}
          data-cursor="hover"
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-20 text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <p className="text-xs md:text-sm font-light tracking-[0.4em] uppercase text-white/50 mb-4">
          Creative Studio
        </p>
        <h1
          ref={headingRef}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white leading-[0.95]"
        >
          Design
          <br />
          <span className="font-normal">Fortis</span>
        </h1>
        <p
          ref={subRef}
          className="mt-6 max-w-md text-sm md:text-base font-light text-white/70 leading-relaxed"
        >
          Setting the standard, one design at a time. Beyond Architecture.
        </p>
        <div ref={ctaRef} className="mt-10">
          <Button variant="outline" size="lg" data-cursor="hover" className="border-white/40 text-white hover:bg-white hover:text-black">
            View Work
          </Button>
        </div>
      </div>

      <p className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-10 text-[10px] md:text-xs font-light tracking-[0.3em] uppercase text-white/50">
        Scroll to explore
      </p>
    </section>
  );
}
