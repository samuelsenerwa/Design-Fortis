import { useRef } from "react";
import { Link } from "react-router-dom";
import ResponsiveImage from "../components/ui/ResponsiveImage";
import "../home/home.css";
import { ABOUT_PAGE } from "../home/content";
import CtaSection from "../home/CtaSection";
import { Btn, Label } from "../home/parts";
import ShadowLayer from "../home/ShadowLayer";
import { SiteFooter, SiteHeader, SiteOverlays } from "../home/SiteChrome";
import { usePageRuntime } from "../home/usePageRuntime";

const { hero, values, whatWeDo, partnership, cta } = ABOUT_PAGE;

/** Hairlines drawn behind a section: a centre rule and/or half-width diagonals. */
function Lines({ tone, vertical = true, diagonals = [] }: { tone: string; vertical?: boolean; diagonals?: ("full" | "left" | "right")[] }) {
  const area = { full: "w_bg_line_100", left: "w_bg_line_l-50", right: "w_bg_line_r-50" } as const;
  return (
    <div className="w_bg_line">
      {vertical && (
        <div className="w_bg_line_100">
          <div className={`deco tb ${tone}`} />
        </div>
      )}
      {diagonals.map((d) => (
        <div key={d} className={area[d]}>
          <div className={`deco lbrt ${tone}`} />
        </div>
      ))}
    </div>
  );
}

const PlusIcon = () => (
  <div className="ico-48 text-dark">
    <div className="ico">
      <div data-ico-plus="h" className="ico">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 11.5V12.5H5V11.5H19Z" fill="currentColor" />
        </svg>
      </div>
      <div data-ico-plus="v" className="ico is-2">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12.5 19L11.5 19L11.5 5L12.5 5L12.5 19Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  </div>
);

export default function About() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  usePageRuntime(rootRef, pageRef);

  return (
    <div ref={rootRef} className="lv transition-wrapper">
      <main ref={pageRef} className="transition-container">
        <SiteHeader theme="theme_on-light" current="/about" />

        <div className="s-w">
          {/* ── Intro ───────────────────────────────────────────── */}
          <section data-parallax-s-out="" data-bg="light" className="section theme_on-gray isolate">
            <div className="container">
              <div className="about-hero-w">
                <div className="about-hero-s">
                  <div className="u-8" />
                  <div className="grid fill">
                    <div className="about-hero-s_l">
                      <div className="about-hero-s_l_t">
                        <div className="u-128" />
                        <div data-prevent-flicker="" data-scroll-reveal="p" className="l1 text-dark">
                          {hero.label}
                        </div>
                      </div>
                      <div className="about-hero-s_l_b b-desk">
                        <a data-prevent-flicker="" hover-nav-item="" data-scroll-reveal="p" href="#our-values" className="nav-item">
                          <Label text="scroll to explore" />
                        </a>
                      </div>
                    </div>
                    <div className="about-hero-s_c">
                      <h1 data-prevent-flicker="" data-scroll-reveal="h" className="h1 a-center text-dark">
                        {hero.title.map((line, i) => (
                          <span key={line}>
                            {line}
                            {i < hero.title.length - 1 && <br />}
                          </span>
                        ))}
                      </h1>
                    </div>
                    <div className="about-hero-s_r">
                      <div className="about-hero-s_r_t">
                        <div className="u-128 b-desk" />
                        <p data-prevent-flicker="" data-scroll-reveal="p" className="p1 text-dark">
                          {hero.text}
                        </p>
                      </div>
                      <div className="about-hero-s_r_b b-mob">
                        <div className="u-32" />
                        <a data-prevent-flicker="" hover-nav-item="" data-scroll-reveal="p" href="#our-values" className="nav-item">
                          <Label text="scroll to explore" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="u-8" />
                </div>
                <div className="w_bg">
                  <Lines tone="o10" diagonals={["left", "right"]} />
                </div>
                <ShadowLayer className="w_shadow _50 about-w_shadow" />
              </div>
            </div>
          </section>

          {/* ── Values quote ────────────────────────────────────── */}
          <section data-bg="dark" className="section clip theme_on-dark">
            <div className="container">
              <div className="about-w">
                <div className="about-s">
                  <div className="u-8" />
                  <div className="u-128 b-mob" />
                  <div className="grid">
                    <div className="about-s_title">
                      <div className="about-s_title_quote">
                        <div className="about-s_title_quote_marks">
                          <div data-scroll-reveal="ctn" className="a1 text-dark">
                            “
                          </div>
                        </div>
                      </div>
                      <div data-scroll-reveal="p" className="red-line_title">
                        <h2 data-scroll-reveal="p" className="l1 text-dark">
                          {values.label}
                        </h2>
                      </div>
                      <h3 data-scroll-reveal="p" className="h2 text-dark">
                        {values.quote}
                      </h3>
                      <div className="u-64" />
                      <div className="amen-s_quote_author">
                        <div data-scroll-reveal="p" className="l1 text-dark">
                          <strong>{values.author}</strong>
                        </div>
                        <div data-scroll-reveal="p" className="h3 s text-dark">
                          {values.role}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="u-128" />
                  <div className="page-divider">
                    <div className="line-h" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── What we do (sticky slider) ──────────────────────── */}
          <section id="our-values" data-bg="dark" className="section theme_on-dark">
            <div className="container">
              <div data-sticky-slider="" className="our-values-w">
                <ShadowLayer className="our-values-w_shadow" />
                <div className="our-values-s">
                  <div className="grid fill">
                    <div className="our-values-s_l">
                      <div className="our-values-s_l_t">
                        <div className="u-128" />
                        <div className="grid _6-columns">
                          <div className="our-values-s_title">
                            <h2 data-scroll-reveal="p" className="l1 text-dark">
                              {whatWeDo.label}
                            </h2>
                          </div>
                        </div>
                      </div>
                      <div className="our-values-content-cms b-desk">
                        <div className="our-values-content-cms_list">
                          {whatWeDo.items.map((item) => (
                            <div key={item.title} data-sticky-slide="" data-reveal-first="" className="our-values-content-cms_list_item">
                              <div className="our-values-content-card">
                                <div className="our-values-content-card_t">
                                  <div className="u-128" />
                                </div>
                                <div className="our-values-content-card_c">
                                  <div className="grid _6-columns">
                                    <div className="our-values-content-card_img">
                                      <div data-scroll-reveal="slide" data-el="slide" className="img-w">
                                        <ResponsiveImage
                                          name={item.image}
                                          alt={item.alt}
                                          role="grid"
                                          sizes="(max-width: 991px) 100vw, 22vw"
                                          loading="eager"
                                          className="img"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="our-values-content-card_b">
                                  <div className="grid _6-columns">
                                    <div className="our-values-content-card_desc">
                                      <p data-scroll-reveal="p" data-el="p" className="p1 text-dark">
                                        {item.text}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="u-8" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="w_bg b-desk">
                        <Lines tone="o05" diagonals={[]} vertical={false} />
                      </div>
                    </div>
                    <div className="our-values-s_r">
                      <div className="our-values-s_r_t">
                        <div className="u-128 b-desk" />
                        <div className="u-8 b-mob" />
                        <div className="grid _6-columns">
                          <div className="our-values-s_desc">
                            <p data-scroll-reveal="p" className="l1 med text-gray">
                              {whatWeDo.strapline}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="our-values-s_r_c b-desk">
                        <div className="our-values-cms">
                          <div data-sticky-names="" className="our-values-cms_list">
                            {whatWeDo.items.map((item) => (
                              <div key={item.title} data-sticky-name="" className="our-values-cms_list_item">
                                <div className="our-values-card">
                                  <h3 data-scroll-reveal="p" className="l1 text-dark">
                                    {item.label}
                                  </h3>
                                  <h4 data-scroll-reveal="h" className="h1 text-dark">
                                    {item.title}
                                  </h4>
                                  <div className="our-values-card_line">
                                    <div className="line-h" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="our-values-s_r_b b-desk" />
                      <div className="mob_our-values-s_cms b-mob">
                        <div className="mob_our-values-cms">
                          <div className="mob_our-values-cms_list">
                            {whatWeDo.items.map((item) => (
                              <div key={item.title} data-accordion-card="" className="mob_our-values-cms_list_item">
                                <div className="our-values-card">
                                  <h3 data-scroll-reveal="p" className="l1 text-dark">
                                    {item.label}
                                  </h3>
                                  <div className="our-values-card_label">
                                    <h3 data-scroll-reveal="h" className="h2 text-dark">
                                      {item.title}
                                    </h3>
                                    <PlusIcon />
                                  </div>
                                  <div className="our-values-card_line">
                                    <div className="line-h" />
                                  </div>
                                </div>
                                <div data-accordion-card="content" className="our-values-content-card">
                                  <div className="grid">
                                    <div className="our-values-content-card_img">
                                      <div data-accordion-card="img" className="img-w">
                                        <ResponsiveImage name={item.image} alt={item.alt} role="grid" sizes="100vw" className="img" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="grid">
                                    <div className="our-values-content-card_desc">
                                      <p data-accordion-card="p" className="p1 text-dark">
                                        {item.text}
                                      </p>
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
                </div>
                <div className="our-values-s_progress b-desk" />
                <div className="our-values-phantom-cms b-desk">
                  <div className="our-values-phantom-cms_list">
                    {whatWeDo.items.map((item) => (
                      <div key={item.title} data-sticky-trigger="" className="our-values-phantom-cms_list_item" />
                    ))}
                  </div>
                </div>
                <div className="w_bg">
                  <div className="w_bg_line b-desk">
                    <div className="w_bg_line_100">
                      <div className="deco tb o05" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Partnership ─────────────────────────────────────── */}
          <section data-bg="color" className="section clip theme_on-color">
            <div className="container">
              <div className="partnership-w">
                <div className="partnership-s">
                  <div className="partnership-s_t" />
                  <div className="partnership-s_c">
                    <div className="grid">
                      <div className="partnership-s_title">
                        <h2 data-scroll-reveal="p" className="h2 text-dark">
                          {partnership.title}
                        </h2>
                      </div>
                      <div className="partnership-s_desc">
                        <p data-scroll-reveal="p" className="h2 text-dark">
                          {partnership.text[0]} <br />
                          {partnership.text[1]} <br />
                          {partnership.text[2]}
                        </p>
                        <div className="u-32" />
                        <div data-scroll-reveal="ctn" className="partnership-s_desc_btn">
                          <Btn text={partnership.cta} modal />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="partnership-s_b" />
                </div>
                <div className="w_bg">
                  <Lines tone="o20w" diagonals={["right"]} />
                  <div className="smart-bg-card">
                    <div className="img-or-video">
                      <div className="img-or-video_img">
                        <div data-parallax="w" className="img-w">
                          <ResponsiveImage
                            name={partnership.image}
                            alt={partnership.alt}
                            role="hero"
                            sizes="(max-width: 991px) 260vh, 100vw"
                            loading="eager"
                            data-parallax="img"
                            className="img img-p-s"
                          />
                        </div>
                      </div>
                      <div className="smart-bg-card_c">
                        <div className="grid">
                          <div className="smart-bg-card_info">
                            <Link aria-label={partnership.caption.name} to={partnership.caption.to} className="projects-data-card">
                              <div className="projects-data-card_index">
                                <div data-scroll-reveal="p" data-prevent-flicker="" className="l1 text-dark">
                                  <span>P</span>
                                  <span>{partnership.caption.index.replace(/^0/, "")}</span>
                                </div>
                              </div>
                              <div className="projects-data-card_name">
                                <div data-prevent-flicker="" data-scroll-reveal="p" className="l1 text-dark">
                                  {partnership.caption.name}
                                </div>
                                <div data-prevent-flicker="" data-scroll-reveal="p" className="h3 s text-dark">
                                  {partnership.caption.place}
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
            </div>
          </section>

          {/* ── Closing quote ───────────────────────────────────── */}
          <CtaSection quote={cta.quote} text={cta.text} image={cta.image} alt={cta.alt} />

          <SiteFooter current="/about" />
        </div>
      </main>

      <SiteOverlays />
    </div>
  );
}
