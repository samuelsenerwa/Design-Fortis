import { memo, useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ResponsiveImage from "../components/ui/ResponsiveImage";
import {
  PRELOADER_SESSION_KEY,
  finishPreloader,
  isPreloaderActive,
  markPreloaderInit,
} from "../lib/preloader";
import { ensureLenis } from "./lenis";
import {
  animateCtn,
  animateTextH,
  animateTextP,
  durL,
  durS,
  fontsReady,
  stagger,
} from "./motion";
import { lockScroll, unlockScroll } from "./runtime";
import { LOADER } from "./content";
import Wordmark from "./Wordmark";

gsap.registerPlugin(Flip, ScrollTrigger);

const FULL_COVER =
  "polygon(0% 0%, 0% 100%, 45% 100%, 45% 50%, 55% 50%, 55% 50%, 45% 50%, 45% 100%, 100% 100%, 100% 0%)";
const WIPE_OPEN =
  "polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 100%, 100% 100%, 100% 0%)";

function buildPreloader(
  root: HTMLDivElement,
  page: HTMLElement,
  lenis: ReturnType<typeof ensureLenis>,
  onDone: () => void,
) {
  const q = <T extends Element = HTMLElement>(sel: string) =>
    root.querySelector<T>(sel)!;
  const qa = (sel: string) => root.querySelectorAll<HTMLElement>(sel);
  const loader = q(".new-preloader_loader");
  const percent = q("[data-preloader-percent]");
  const logo = q("[data-preloader-logo]");
  const imgBox = q(".new-preloader_img");
  const img = imgBox.querySelector("img")!;
  const headings = qa('[data-el="h"]');
  const paragraphs = qa('[data-el="p"]');
  const containers = qa('[data-el="ctn"]');
  const words = Array.from(qa('[class*="new-preloader_title_w"]'));

  gsap.set([headings, paragraphs, containers], { visibility: "visible" });
  gsap.set([...words, logo], { translateZ: 10 });

  /** Moves the words (and logo) into the next layout phase with Flip. */
  const flipTo = (phase: "p2" | "p3", opts: Flip.FromToVars = {}) => {
    const state = Flip.getState([...words, logo]);
    words.forEach((w, i) =>
      q(`.new-preloader_title-${phase}_c${i + 1}`).appendChild(w),
    );
    q(`.new-preloader_logo_${phase}`).appendChild(logo);
    Flip.from(state, {
      duration: durL,
      ease: "InOut",
      scale: true,
      overwrite: true,
      ...opts,
    });
  };

  // Picture + words choreography (runs once the counter has started).
  const phases = gsap
    .timeline()
    .add(() => flipTo("p2", { stagger }))
    .to({}, { duration: durL + 4 * stagger })
    .add(() => {
      const state = Flip.getState([...words, logo]);
      words.forEach((w, i) =>
        q(`.new-preloader_title-p3_c${i + 1}`).appendChild(w),
      );
      q(".new-preloader_logo_p3").appendChild(logo);
      Flip.from(state, {
        duration: durL,
        ease: "InOut",
        scale: true,
        overwrite: true,
      });
    })
    .fromTo(
      imgBox,
      { clipPath: "inset(50% 0% 50% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: durL - 0.2, ease: "InOut" },
      "<+=0.2",
    )
    .fromTo(
      img,
      { scale: 1.2, translateZ: 10 },
      { scale: 1, translateZ: 10, duration: durL - 0.2, ease: "InOut" },
      "<",
    )
    .to({}, { duration: durS })
    .add(() => {
      const state = Flip.getState(words);
      words.forEach((w, i) =>
        q(`.new-preloader_title-p2_c${i + 1}`).appendChild(w),
      );
      Flip.from(state, { duration: durL, ease: "InOut" });
    })
    .to(
      imgBox,
      { clipPath: "inset(50% 0% 50% 0%)", duration: durL - 0.4, ease: "InOut" },
      "<",
    )
    .to(
      img,
      { scale: 1.2, translateZ: 10, duration: durL - 0.4, ease: "InOut" },
      "<",
    );

  const counter = { val: 0 };
  const master = gsap
    .timeline()
    .add(() => {
      animateTextH(headings, "reveal", 0);
      animateTextP(paragraphs, "reveal", 0);
      animateCtn(containers, "reveal", 0);
    })
    .to({}, { duration: durL })
    .to(counter, {
      val: 100,
      duration: 3,
      ease: "loaderEase",
      onUpdate: () => {
        percent.textContent = `${String(Math.round(counter.val)).padStart(2, "0")}%`;
        loader.style.setProperty("--progress", String(counter.val / 100));
      },
    })
    .add(phases, "<")
    // The notch in the overlay grows to a full opening while the page scales up.
    .fromTo(
      root,
      { clipPath: FULL_COVER },
      { clipPath: WIPE_OPEN, duration: 1.5 * durL, ease: "InOut" },
    )
    .fromTo(
      page,
      { scale: 0.5, translateZ: 10, transformOrigin: "center 50vh" },
      {
        scale: 1,
        translateZ: 10,
        duration: 1.5 * durL,
        ease: "InOut",
        onComplete: () => {
          gsap.set(page, { clearProps: "scale,transformOrigin,transform" });
        },
      },
      "<",
    )
    .add(() => markPreloaderInit(), "-=0.2")
    .add(() => {
      unlockScroll(lenis);
      gsap.set(root, { display: "none" });
      ScrollTrigger.refresh();
      finishPreloader();
      onDone();
    });

  return () => {
    master.kill();
    phases.kill();
  };
}

interface PreloaderProps {
  /** The page container; it scales up from 0.5 while the overlay opens. */
  pageRef: RefObject<HTMLElement | null>;
  onDone: () => void;
}

/**
 * First-visit intro.
 *
 *  1. Four words sit together on the right and fan out across a 12-column grid
 *     (GSAP Flip carries them between layout "phases").
 *  2. "Loading / NN%" rides up the left edge as the count advances.
 *  3. A picture opens between the words, holds at 100%, and closes to a line.
 *  4. That line becomes a notch in the overlay that grows to reveal the page,
 *     which scales up from 0.5 behind it.
 *
 * The node tree is static: Flip moves nodes between containers by hand, so
 * React must never re-render it (hence `memo` and no state).
 */
function PreloaderView({ pageRef, onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const page = pageRef.current;
    if (!root || !page) return;

    const lenis = ensureLenis();
    window.sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true, force: true });
    lockScroll(lenis);

    let cancelled = false;
    let teardown = () => {};
    // Text is split by measuring glyphs, so wait for the web fonts first.
    fontsReady().then(() => {
      if (!cancelled) teardown = buildPreloader(root, page, lenis, onDone);
    });
    return () => {
      cancelled = true;
      teardown();
    };
  }, [pageRef, onDone]);

  return (
    <div
      ref={rootRef}
      data-preloader
      className="new-preloader"
      aria-hidden="true"
    >
      <div className="new-preloader_c theme_on-dark">
        <div className="new-preloader_t">
          <div className="u-8 b-mob" />
          <div className="u-8" />
          <div className="grid">
            <div className="new-preloader_logo_p2" />
            <div className="new-preloader_logo_p3" />
          </div>
        </div>

        <div className="new-preloader_c_c h1 text-dark">
          <div className="u-8" />
          <div className="new-preloader_c_c_cell is-top">
            <div className="grid">
              <span className="new-preloader_title-p3_c4" />
            </div>
          </div>
          <div className="new-preloader_c_c_cell">
            <div className="grid">
              <span className="new-preloader_title-p3_c1" />
            </div>
          </div>
          <div className="new-preloader_c_c_cell">
            <div className="grid">
              <span
                data-el="h"
                data-prevent-flicker
                className="new-preloader_title-p1"
              >
                {LOADER.words.map((w, i) => (
                  <span key={w} className={`new-preloader_title_w${i + 1}`}>
                    {w}
                  </span>
                ))}
              </span>
              <div className="new-preloader_logo_p1">
                <div
                  data-preloader-logo
                  data-el="ctn"
                  data-prevent-flicker
                  className="new-preloader_logo_c"
                >
                  <Wordmark />
                </div>
              </div>
              <span className="new-preloader_title-p2_c1" />
              <span className="new-preloader_title-p2_c2" />
              <span className="new-preloader_title-p2_c3" />
              <span className="new-preloader_title-p2_c4" />
              <span className="new-preloader_title-p3_c2" />
              <div className="new-preloader_img-w">
                <div className="new-preloader_img">
                  <div className="img-w">
                    <ResponsiveImage
                      name={LOADER.image}
                      alt=""
                      role="grid"
                      sizes="30vw"
                      loading="eager"
                      className="img"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="new-preloader_c_c_cell" />
          <div className="new-preloader_c_c_cell is-bot">
            <div className="grid">
              <span className="new-preloader_title-p3_c3" />
            </div>
          </div>
          <div className="u-8" />
        </div>

        <div className="new-preloader_b">
          <div className="grid">
            <div className="new-preloader_desc">
              <div data-prevent-flicker data-el="p" className="l1 text-dark">
                {LOADER.title}
              </div>
              <div data-prevent-flicker data-el="p" className="h3 s text-dark">
                {LOADER.subtitle}
              </div>
            </div>
          </div>
          <div className="u-8" />
        </div>

        <div className="new-preloader_loader">
          <div className="grid">
            <div className="new-preloader_loader_label">
              <div data-prevent-flicker data-el="p" className="h3 text-dark">
                Loading
              </div>
            </div>
            <div className="new-preloader_loader_percent">
              <div
                data-prevent-flicker
                data-preloader-percent
                data-el="p"
                className="h3 text-dark"
              >
                00%
              </div>
            </div>
          </div>
          <div className="new-preloader_loader_line">
            <div className="line-h" />
          </div>
        </div>
      </div>

      <div className="preloader_bg">
        <div className="grid-c fill theme_on-dark">
          <div className="preloader_bg_line-1">
            <div className="line-v" />
          </div>
          <div className="preloader_bg_line-2">
            <div className="line-v" />
          </div>
          <div className="preloader_bg_line-3">
            <div className="line-v" />
          </div>
        </div>
      </div>
    </div>
  );
}

const PreloaderMemo = memo(PreloaderView);

/** Renders nothing on repeat visits, or when the user prefers reduced motion. */
export default function Preloader(props: PreloaderProps) {
  if (!isPreloaderActive()) return null;
  return <PreloaderMemo {...props} />;
}
