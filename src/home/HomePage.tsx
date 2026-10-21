import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import ResponsiveImage from "../components/ui/ResponsiveImage";
import heroVideoSrc from "../assets/hero_video.mp4";
import {
  PRELOADER_INIT_EVENT,
  isPreloaderActive,
} from "../lib/preloader";
import "./home.css";
import {
  ABOUT,
  ARCH,
  CTA,
  FEATURED,
  HERO,
  MISSION,
  PURPOSE,
  SERVICES,
} from "./content";
import { SiteFooter, SiteHeader, SiteOverlays } from "./SiteChrome";
import { Btn, DotIcon, Hairlines, Label } from "./parts";
import Preloader from "./Preloader";
import { destroyLenis, ensureLenis } from "./lenis";
import { durL, fontsReady } from "./motion";
import { armPageTransitions, beginEnter, isTransitioning, onTransitionSettled, type Entry } from "./pageTransition";
import { initHomeScripts } from "./runtime";

// three.js is only needed for the pointer-trail effect, so keep it out of the first load.
const FluidCursor = lazy(() => import("./FluidCursor"));

/** Reads "P" + index the way the data card is laid out (letter, then number). */
function IndexTag({ value }: { value: string }) {
  return (
    <div data-prevent-flicker="" data-scroll-reveal="p" className="l1 text-dark">
      <span>P</span>
      <span>{value.replace(/^0/, "")}</span>
    </div>
  );
}

export default function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  const [useVideo] = useState(() => {
    if (typeof window === "undefined") return false;
    const narrow = window.matchMedia("(max-width: 768px)").matches;
    const reducedData = window.matchMedia("(prefers-reduced-data: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    return !narrow && !reducedData && !saveData;
  });
  const onPreloaderDone = useCallback(() => {}, []);
  // The WebGL pointer trail takes a couple of hundred ms to set up; never inside a page transition.
  const [cursorReady, setCursorReady] = useState(() => !isTransitioning());
  useEffect(() => {
    if (cursorReady) return;
    // Even once the transition is over, wait for an idle moment (and a beat) so the one-off
    // WebGL set-up doesn't land on the page the user has just arrived at.
    let timer = 0;
    const off = onTransitionSettled(() => {
      timer = window.setTimeout(() => {
        const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
        idle(() => setCursorReady(true), { timeout: 1500 });
      }, 800);
    });
    return () => {
      off();
      window.clearTimeout(timer);
    };
  }, [cursorReady]);

  // The whole layout is sized in vw units off the root font-size; set it before paint.
  useLayoutEffect(() => {
    document.documentElement.classList.add("lv-root");
    return () => document.documentElement.classList.remove("lv-root");
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const page = pageRef.current;
    if (!root || !page) return;

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const lenis = ensureLenis();
    let teardown: (() => void) | null = null;
    let cancelled = false;
    let started = false;
    let entry: Entry | null = null;
    const start = () => {
      if (started) return;
      started = true;
      // Split-text measures glyphs, so the fonts must be in first.
      fontsReady().then(() => {
        if (cancelled) return;
        teardown = initHomeScripts(root, lenis, entry ? onTransitionSettled : undefined);
        entry?.play();
      });
    };

    let offInit = () => {};
    if (isPreloaderActive()) {
      // The preloader calls this partway through its reveal.
      window.addEventListener(PRELOADER_INIT_EVENT, start, { once: true });
      offInit = () => window.removeEventListener(PRELOADER_INIT_EVENT, start);
    } else {
      window.scrollTo(0, 0);
      entry = beginEnter(root, lenis);
      start();
      if (!entry) gsap.fromTo(page, { opacity: 0 }, { opacity: 1, duration: durL, ease: "Out" });
    }

    const offTransitions = armPageTransitions(root);

    return () => {
      cancelled = true;
      entry?.cancel();
      offTransitions();
      offInit();
      teardown?.();
      destroyLenis();
      document.documentElement.style.overflow = "";
      document.documentElement.style.removeProperty("--scrollbar-width");
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  return (
    <div ref={rootRef} className="lv transition-wrapper">
      <Preloader pageRef={pageRef} onDone={onPreloaderDone} />
      {cursorReady && (
        <Suspense fallback={null}>
          <FluidCursor />
        </Suspense>
      )}

      <main ref={pageRef} className="transition-container">
        <SiteHeader />

        <div className="s-w">
          {/* ── Hero ─────────────────────────────────────────────── */}
          <section id="hero" data-bg="color" data-parallax-s-out="" className="section theme_on-color">
            <div className="container">
              <div className="hero-w">
                <div className="hero-s">
                  <div className="hero-s_t" />
                  <div className="hero-s_b">
                    <div className="grid">
                      <div className="hero-s_title">
                        <div className="hero-s_title_">
                          <h1 data-prevent-flicker="" data-scroll-reveal="h" className="h1 text-dark">
                            {HERO.title}
                          </h1>
                        </div>
                        <div className="u-64 b-desk" />
                        <div className="u-48 b-mob" />
                        <div className="hero-s_btn b-desk">
                          <a
                            data-prevent-flicker=""
                            hover-nav-item=""
                            data-scroll-reveal="p"
                            href="#about"
                            className="nav-item"
                          >
                            <Label text="scroll to explore" />
                          </a>
                        </div>
                        <div className="u-8" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w_bg">
                  <div className="img-over-grad x3 top _30" />
                  <div className="smart-bg-card">
                    <div data-video-playpause="" className="img-or-video">
                      {useVideo && (
                        <div className="img-or-video_video">
                          <div data-parallax="w" className="video-w">
                            <video
                              data-parallax="img"
                              className="video img-p-s"
                              src={heroVideoSrc}
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="metadata"
                            />
                          </div>
                        </div>
                      )}
                      <div className="img-or-video_img">
                        <div data-parallax="w" className="img-w">
                          <ResponsiveImage
                            name={HERO.poster}
                            alt="Design Fortis — architectural design and build"
                            role="hero"
                            // A landscape photo cropped into a tall mobile viewport needs far more
                            // pixels than 100vw suggests.
                            sizes="(max-width: 991px) 260vh, 100vw"
                            loading="eager"
                            data-parallax="img"
                            className="img img-p-s"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="smart-bg-card_c">
                      <div className="grid">
                        <div className="smart-bg-card_info">
                          <Link to={HERO.caption.to} className="projects-data-card">
                            <div className="projects-data-card_index">
                              <IndexTag value={HERO.caption.index} />
                            </div>
                            <div className="projects-data-card_name">
                              <div data-prevent-flicker="" data-scroll-reveal="p" className="l1 text-dark">
                                {HERO.caption.name}
                              </div>
                              <div data-prevent-flicker="" data-scroll-reveal="p" className="h3 s text-dark">
                                {HERO.caption.place}
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="img-over-grad x5 bot _30" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── About ────────────────────────────────────────────── */}
          <section id="about" data-bg="dark" className="section theme_on-dark">
            <div className="container">
              <div className="about-w">
                <div className="about-s">
                  <div className="u-128" />
                  <div className="grid">
                    <div className="about-s_img">
                      <div className="img-w">
                        <ResponsiveImage
                          name={ABOUT.image}
                          alt={ABOUT.imageAlt}
                          role="grid"
                          sizes="(max-width: 991px) 80vw, 24vw"
                          className="img"
                        />
                      </div>
                    </div>
                    <div className="about-s_lead">
                      <div className="red-line_title">
                        <div data-scroll-reveal="p" className="l1 text-dark">
                          {ABOUT.label}
                        </div>
                      </div>
                      <h2 data-scroll-reveal="p" className="h2 text-dark text-pretty">
                        {ABOUT.lead}
                      </h2>
                      <div className="u-64" />
                    </div>
                    <div className="about-s_content">
                      <div className="grid _6-columns">
                        <div className="about-s_caption b-desk">
                          <p data-scroll-reveal="p" className="l1 med text-gray">
                            {ABOUT.caption}
                          </p>
                        </div>
                        <div className="about-s_desc">
                          <div className="u-16 b-mob" />
                          <p data-scroll-reveal="p" className="p1 text-dark">
                            {ABOUT.paragraphs[0]}
                            <br />
                            <br />
                            {ABOUT.paragraphs[1]}
                          </p>
                          <div className="u-24" />
                          <div data-scroll-reveal="ctn" className="about-s_btn">
                            <Btn text="Learn more" to="/about" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="u-128" />
                </div>
                <div className="w_bg b-desk">
                  <Hairlines tone="light-on-dark" diagonal="left" />
                </div>
              </div>
            </div>
          </section>

          {/* ── Mission ──────────────────────────────────────────── */}
          <section data-bg="dark" className="section theme_on-dark">
            <div className="container">
              <div className="mission-w">
                <div className="mission-s">
                  <div className="u-8" />
                  <h3 className="grid h1 text-dark">
                    <span className="mission-s_title-l b-desk">
                      <span data-scroll-reveal="h" className="mission-s_title_line">
                        {MISSION.left}
                      </span>
                    </span>
                    <span data-scroll-reveal="h" className="mission-s_title-r">
                      <span className="mob_mission-s_title_word">{MISSION.left}</span>
                      <span className="mission-s_title_line">{MISSION.right[0]}</span>
                      <span className="mission-s_title_offset" />
                      <span className="mission-s_title_line">{MISSION.right[1]}</span>
                      <span className="mission-s_title_line">{MISSION.right[2]}</span>
                    </span>
                  </h3>
                  <div className="u-48" />
                  <div className="grid">
                    <div className="mission-s_img">
                      <div className="img-w">
                        <ResponsiveImage
                          name={MISSION.image}
                          alt={MISSION.imageAlt}
                          role="gallery"
                          sizes="(max-width: 991px) 100vw, 46vw"
                          className="img"
                        />
                      </div>
                    </div>
                    <div className="mission-s_content">
                      <div className="u-16" />
                      <div className="grid _4-columns">
                        <div className="mission-s_title">
                          <h2 data-scroll-reveal="p" className="p1 bold text-dark">
                            {MISSION.label}
                          </h2>
                          <div className="u-8" />
                        </div>
                        <div className="mission-s_desc">
                          <p data-scroll-reveal="p" className="p1 text-dark">
                            {MISSION.text}
                          </p>
                          <div className="u-128 b-mob" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="u-8" />
                </div>
                <div className="w_bg">
                  <div className="w_bg_line b-desk">
                    <div className="w_bg_line_100">
                      <div className="deco tb o05" />
                    </div>
                    <div className="w_bg_line_r-50">
                      <div className="deco lbrt o05" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Projects: full-bleed stacked cards ───────────────── */}
          <section data-bg="color" className="section theme_on-color">
            <div className="container">
              <div className="projects-w">
                <div className="projects-s">
                  <div className="projects-cms">
                    {FEATURED.map((project) => (
                      <div key={project.slug} data-mob="off" data-parallax="w" className="project-card">
                        <Link
                          floating-tip-trigger="view-project"
                          to={`/work/${project.slug}`}
                          className="project-card_link"
                          aria-label={`View ${project.title}`}
                        />
                        <div className="project-card_img">
                          <div className="project_img">
                            <div className="img-w">
                              <ResponsiveImage
                                name={project.image}
                                alt={project.title}
                                role="hero"
                                sizes="(max-width: 991px) 130vw, 100vw"
                                data-parallax-img-in=""
                                data-parallax-img-out=""
                                className="img img-p-s"
                              />
                              <div className="img-over-grad x5 bot" />
                            </div>
                          </div>
                        </div>
                        <div className="project-card_info">
                          <div className="project-card_info_c">
                            <div className="data-list">
                              <p data-scroll-reveal="p" className="l1 text-dark">
                                {project.location}
                              </p>
                            </div>
                            <div className="u-8" />
                            <h3 data-scroll-reveal="h" className="h2 text-dark">
                              {project.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Architecture ─────────────────────────────────────── */}
          <section data-snap="" data-bg="light" className="section">
            <div className="container">
              <div className="arch-w">
                <div className="arch-s">
                  <div className="arch-s_t">
                    <div className="grid">
                      <div className="arch-s_title">
                        <div className="u-192 b-mob" />
                        <h2 data-scroll-reveal="h" className="h1 text-dark">
                          {ARCH.title[0]}
                          <br />
                          {ARCH.title[1]}
                        </h2>
                        <div className="u-8" />
                      </div>
                    </div>
                  </div>
                  <div data-parallax="w" className="arch-s_sketch">
                    <ResponsiveImage
                      name={ARCH.sketch}
                      alt="Exploded architectural model showing structural components"
                      role="gallery"
                      data-parallax="img"
                      className="arch-s_sketch_img"
                    />
                  </div>
                  <div className="arch-s_b">
                    <div className="grid">
                      <div className="arch-s_desc">
                        <div className="u-64 b-mob" />
                        <div className="grid _6-columns">
                          {ARCH.columns.map((text) => (
                            <div key={text} className="arch-s_desc_c">
                              <p data-scroll-reveal="p" className="p1 text-dark">
                                {text}
                              </p>
                              <div className="u-16 b-mob" />
                            </div>
                          ))}
                        </div>
                        <div className="u-24" />
                        <div data-scroll-reveal="ctn" className="arch-s_btn">
                          <Btn text="Learn more" to="/about" />
                        </div>
                      </div>
                      <div className="u-48 b-desk" />
                      <div className="u-96 b-mob" />
                    </div>
                  </div>
                </div>
                <div className="w_bg e-none b-desk">
                  <div className="w_bg_line">
                    <div className="w_bg_line_100">
                      <div className="deco lr o05d" />
                    </div>
                    <div className="w_bg_line_t-50">
                      <div className="deco lbrt o05d" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Purpose ──────────────────────────────────────────── */}
          <section data-snap="" data-bg="color" className="section theme_on-color">
            <div className="container">
              <div className="purpose-w">
                <div className="purpose-s">
                  <div className="purpose-s_t b-desk" />
                  <div className="purpose-s_c">
                    <div className="u-192 b-mob" />
                    <div className="b-desk">
                      <h3 data-scroll-reveal="w" className="grid h1 text-dark">
                        <span data-scroll-reveal="h" className="purpose-s_title_line-1">
                          {PURPOSE.words[0]}
                        </span>
                        <span data-scroll-reveal="h" className="purpose-s_title_line-3">
                          {PURPOSE.words[1]}
                        </span>
                        <span data-scroll-reveal="h" className="purpose-s_title_line-4 a-right">
                          {PURPOSE.words[2]}
                        </span>
                      </h3>
                    </div>
                    <div className="b-mob">
                      <div className="grid">
                        <div className="purpose-s_title">
                          <h3 data-scroll-reveal="h" className="h1 text-dark">
                            {PURPOSE.words.map((w) => (
                              <span key={w} style={{ display: "block" }}>
                                {w}
                              </span>
                            ))}
                          </h3>
                        </div>
                      </div>
                      <div className="u-64" />
                    </div>
                  </div>
                  <div className="purpose-s_b">
                    <div className="grid">
                      <div className="purpose-s_desc">
                        <p data-scroll-reveal="p" className="p1 text-dark">
                          {PURPOSE.text}
                        </p>
                        <div className="u-24" />
                        <div data-scroll-reveal="ctn" className="purpose-s_desc_btn">
                          <Btn text="Learn more" to="/archive" />
                        </div>
                      </div>
                    </div>
                    <div className="u-8 b-desk" />
                    <div className="u-192 b-mob" />
                  </div>
                </div>
                <div className="w_bg">
                  <div className="smart-bg-card">
                    <div data-video-playpause="" className="img-or-video">
                      <div className="img-or-video_img">
                        <div data-parallax="w" className="img-w">
                          <ResponsiveImage
                            name={PURPOSE.image}
                            alt={PURPOSE.caption.name}
                            role="hero"
                            sizes="(max-width: 991px) 220vh, 100vw"
                            data-parallax="img"
                            className="img img-p-s"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="smart-bg-card_c">
                      <div className="grid">
                        <div className="smart-bg-card_info">
                          <Link to={PURPOSE.caption.to} className="projects-data-card">
                            <div className="projects-data-card_index">
                              <IndexTag value={PURPOSE.caption.index} />
                            </div>
                            <div className="projects-data-card_name">
                              <div data-prevent-flicker="" data-scroll-reveal="p" className="l1 text-dark">
                                {PURPOSE.caption.name}
                              </div>
                              <div data-prevent-flicker="" data-scroll-reveal="p" className="h3 s text-dark">
                                {PURPOSE.caption.place}
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="img-over-grad _30" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Services (tabs) ──────────────────────────────────── */}
          <section data-bg="light" className="section">
            <div className="container">
              <div className="services-w">
                <div className="services-s">
                  <div className="u-128" />
                  <div data-tabs="" className="services-s_cms">
                    <div className="services-s_t">
                      <div className="services-s_title b-mob">
                        <h2 data-scroll-reveal="p" className="l1">
                          {SERVICES.label}
                        </h2>
                        <div className="u-8" />
                      </div>
                      <div className="grid">
                        <div data-scroll-reveal="w" className="services-s_tabs">
                          <div className="tabs-cms">
                            <div data-index="" className="tabs-cms_list">
                              {SERVICES.items.map((item) => (
                                <div key={item.slug} data-scroll-reveal="ctn" className="tabs-cms_list_item">
                                  <div data-tab-trigger={item.slug} className="tab">
                                    <div className="tab_index">
                                      <div data-index="text" className="l1">
                                        <span>1</span>
                                        <span>.0</span>
                                      </div>
                                    </div>
                                    <div className="tab_label">
                                      <div className="l1">{item.title}</div>
                                    </div>
                                    <div className="tab_line">
                                      <div className="tab_line_fill" />
                                    </div>
                                    <div className="tab_dot">
                                      <div className="ico-16">
                                        <div className="ico">
                                          <DotIcon />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="u-64 b-mob" />
                    <div className="services-cms">
                      <div className="services-cms_list">
                        {SERVICES.items.map((item) => (
                          <div
                            key={item.slug}
                            data-reveal-first=""
                            data-tab-content={item.slug}
                            className="services-cms_list_item"
                          >
                            <div className="services-card">
                              <div data-scroll-reveal="slide" data-tab="slide" className="services-card_img-1">
                                <div className="img-w">
                                  <ResponsiveImage
                                    name={item.image}
                                    alt={item.title}
                                    role="gallery"
                                    sizes="(max-width: 991px) 100vw, 42vw"
                                    className="img"
                                  />
                                </div>
                              </div>
                              <div className="services-card_title">
                                <h3 data-scroll-reveal="h" data-tab="h" className="h1 text-dark">
                                  {item.title}
                                </h3>
                                <div className="u-16" />
                              </div>
                              <div className="services-card_desc">
                                <p data-scroll-reveal="p" data-tab="p" className="p1 text-dark">
                                  {item.text}
                                </p>
                                <div className="u-24" />
                                <div data-scroll-reveal="ctn" data-tab="ctn" className="services-card_info_btn">
                                  <Btn text="Let’s Talk" modal />
                                </div>
                              </div>
                              <div className="u-24 b-mob" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="u-128" />
                </div>
              </div>
            </div>
          </section>

          {/* ── Closing quote ────────────────────────────────────── */}
          <section data-bg="color" className="section theme_on-color">
            <div className="container">
              <div className="cta-w">
                <div className="cta-s">
                  <div className="u-128" />
                  <div className="grid">
                    <div className="cta-s_title">
                      <h2 data-scroll-reveal="h" className="h1 text-dark">
                        {CTA.quote.map((line, i) => (
                          <span key={line}>
                            {line}
                            {i < CTA.quote.length - 1 && <br />}
                          </span>
                        ))}
                      </h2>
                    </div>
                  </div>
                  <div className="u-96" />
                  <div className="grid">
                    <div className="cta-s_desc">
                      <p data-scroll-reveal="p" className="p1 text-dark">
                        {CTA.text}
                      </p>
                      <div className="u-24" />
                      <div data-scroll-reveal="ctn" className="cta-s_desc_btn">
                        <Btn text="Let’s Talk" modal />
                      </div>
                    </div>
                  </div>
                  <div className="u-128" />
                </div>
                <div className="w_bg">
                  <div className="cta-w_bg_line">
                    <div className="w_bg_line_100 b-desk">
                      <div className="deco tb o20w" />
                    </div>
                    <div className="w_bg_line_r-50 b-desk">
                      <div className="deco lbrt o20w" />
                    </div>
                  </div>
                  <div data-parallax="w" className="img-w top">
                    <ResponsiveImage
                      name={CTA.image}
                      alt="Design Fortis building against a clear sky"
                      role="hero"
                      sizes="(max-width: 991px) 200vh, 100vw"
                      data-parallax="img"
                      className="img img-p-s"
                    />
                    <div className="img-over-grad cta-scrim" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Footer ───────────────────────────────────────────── */}
          <SiteFooter />
        </div>
      </main>

      <SiteOverlays />
    </div>
  );
}
