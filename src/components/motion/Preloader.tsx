import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import ResponsiveImage from "../ui/ResponsiveImage";
import {
  PRELOADER_SESSION_KEY,
  finishPreloader,
  isPreloaderActive,
} from "../../lib/preloader";

// Words sit on one line at rest. `left` is the final resting column (vw),
// `from` is where each one starts, bunched up on the right like a sentence.
const WORDS = [
  { text: "A New", left: 8.9, from: 58, lift: -6.3 },
  { text: "Standard", left: 25.5, from: 68, lift: 0 },
  { text: "Of", left: 59, from: 82, lift: 14.1 },
  { text: "Design", left: 74, from: 85, lift: -14.1 },
] as const;

// Slot image is a near-square sitting between "Standard" and "Of"; the words
// above/below it are pushed out by half its height plus a gap (all in vw so
// the composition scales with the viewport).
const SLOT_W = 24; // vw
const SLOT_H = 25; // vw

const FULL = "inset(0% 0% 0% 0%)";
const SLOT_CLOSED = "inset(50% 0% 50% 0%)";
// Thin line at screen centre that the hero reveal grows out of.
const REVEAL_LINE = "inset(51.7% 44% 48.3% 44%)";

/**
 * Full-screen intro, shown once per browser session:
 *  1. words spread out across the screen while a "Loading / NN%" label
 *     climbs the left edge in step with the count
 *  2. an image slot opens between the words (they shift up/down to make room)
 *  3. it holds at 100%, then collapses back to a line
 *  4. a new line at screen centre expands to full-bleed, revealing the hero
 */
export default function Preloader() {
  const [mounted, setMounted] = useState(isPreloaderActive);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const slotRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const revealImgRef = useRef<HTMLDivElement>(null);

  // Lock scrolling while the overlay is up.
  useLayoutEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    window.sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");

    const vw = (n: number) => (n * window.innerWidth) / 100;
    const vh = (n: number) => (n * window.innerHeight) / 100;
    const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
    const overlay = overlayRef.current!;
    const slot = slotRef.current!;
    const reveal = revealRef.current!;

    // ── Initial state ──
    gsap.set(words, { yPercent: -50, opacity: 0 });
    gsap.set(slot, { yPercent: -50, clipPath: SLOT_CLOSED });
    gsap.set(reveal, { clipPath: REVEAL_LINE, autoAlpha: 0 });
    gsap.set(revealImgRef.current, { scale: 1.2 });
    gsap.set(labelRef.current, { y: 0, opacity: 0 });
    gsap.set(logoRef.current, { opacity: 0 });

    // Hold at 100% until the images that follow are actually decoded (or a
    // timeout elapses) so the reveal never shows a half-loaded frame.
    const imgs = Array.from(overlay.querySelectorAll("img"));
    const ready = Promise.race([
      Promise.all(imgs.map((img) => img.decode().catch(() => {}))),
      new Promise((r) => setTimeout(r, 4000)),
    ]);

    const counter = { value: 0 };
    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    // Fade chrome in
    tl.to([logoRef.current, labelRef.current], { opacity: 1, duration: 0.5, ease: "power1.out" }, 0);
    tl.to(words, { opacity: 1, duration: 0.4, ease: "power1.out" }, 0);

    // 1. Spread words out from the right-hand cluster
    WORDS.forEach((w, i) => {
      tl.fromTo(
        words[i],
        { x: () => vw(w.from - w.left) },
        { x: 0, duration: 1.8, ease: "power4.out" },
        0
      );
    });

    // Counter + label climbing the left edge (0 → 100% over 3.5s)
    tl.to(
      counter,
      {
        value: 100,
        duration: 3.5,
        ease: "none",
        onUpdate: () => {
          if (countRef.current) countRef.current.textContent = `${Math.round(counter.value)}%`;
        },
      },
      0
    );
    tl.fromTo(
      labelRef.current,
      { y: 0 },
      { y: () => -vh(74.5), duration: 3.5, ease: "none" },
      0
    );

    // 2. Open the image slot; push words out of its way
    // Explicit fromTo's: browsers re-serialise inset() with fewer values, which
    // breaks GSAP's number-by-number interpolation when read back from the DOM.
    tl.fromTo(slot, { clipPath: SLOT_CLOSED }, { clipPath: FULL, duration: 0.9 }, 2.5);
    WORDS.forEach((w, i) => {
      if (!w.lift) return;
      tl.to(words[i], { y: () => vw(w.lift), duration: 0.9 }, 2.5);
    });
    tl.addLabel("loaded", 3.5);
    tl.addPause("loaded", () => {
      ready.then(() => tl.resume());
    });

    // 3. Hold, then collapse the slot back to a line and realign the words
    tl.fromTo(slot, { clipPath: FULL }, { clipPath: SLOT_CLOSED, duration: 0.7, immediateRender: false }, "loaded+=0.6");
    tl.to(words, { y: 0, duration: 0.7 }, "<");
    tl.set(slot, { autoAlpha: 0 }, ">");

    // 4. Line at screen centre → full-bleed reveal of the hero image
    tl.set(reveal, { autoAlpha: 1 }, "<-0.05");
    tl.fromTo(reveal, { clipPath: REVEAL_LINE }, { clipPath: FULL, duration: 1.4, immediateRender: false }, ">");
    tl.to(revealImgRef.current, { scale: 1, duration: 1.4 }, "<");
    tl.add(() => finishPreloader(), ">-0.2");
    tl.to(overlay, { opacity: 0, duration: 0.5, ease: "power1.out" }, ">");
    tl.add(() => setMounted(false));

    return () => {
      tl.kill();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-200 overflow-hidden text-[#f4ede8]"
      style={{ backgroundColor: "#201616", fontFamily: '"Times New Roman", Times, serif' }}
      aria-hidden="true"
    >
      <p
        ref={logoRef}
        className="absolute top-5 left-1/2 -translate-x-1/2 text-[13px] font-light tracking-[0.45em] uppercase"
      >
        Design Fortis
      </p>

      {/* "Loading" + percent, riding up the left edge as the count advances */}
      <div
        ref={labelRef}
        className="absolute left-0 w-full text-[11px] md:text-[13px] leading-none tracking-tight"
        style={{ top: "91vh" }}
      >
        <span className="absolute" style={{ left: "max(12px, 0.6vw)" }}>
          Loading
        </span>
        <span ref={countRef} className="absolute tabular-nums" style={{ left: "8.9%" }}>
          0%
        </span>
      </div>

      {WORDS.map((w, i) => (
        <span
          key={w.text}
          ref={(el) => {
            wordRefs.current[i] = el;
          }}
          className="absolute top-1/2 whitespace-nowrap leading-none tracking-[-0.03em]"
          style={{ left: `${w.left}%`, fontSize: "clamp(1.5rem, 3.75vw, 5rem)" }}
        >
          {w.text}
        </span>
      ))}

      <div
        ref={slotRef}
        className="absolute top-1/2 overflow-hidden"
        style={{ left: "59%", width: `${SLOT_W}vw`, height: `${SLOT_H}vw` }}
      >
        <ResponsiveImage
          name="fortis_estate_front"
          alt=""
          role="grid"
          sizes="24vw"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div ref={revealRef} className="absolute inset-0 overflow-hidden">
        <div ref={revealImgRef} className="absolute inset-0">
          <ResponsiveImage
            name="hero_poster"
            alt=""
            role="hero"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.45) 100%)",
          }}
        />
      </div>
    </div>
  );
}
