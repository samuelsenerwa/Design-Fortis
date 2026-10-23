import { useRef } from "react";
import { Link } from "react-router-dom";
import ResponsiveImage from "../components/ui/ResponsiveImage";
import "../home/home.css";
import "../home/projects.css";
import CtaSection from "../home/CtaSection";
import { PROJECTS_PAGE } from "../home/content";
import ShadowLayer from "../home/ShadowLayer";
import { SiteFooter, SiteHeader, SiteOverlays } from "../home/SiteChrome";
import { usePageRuntime } from "../home/usePageRuntime";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import PROJECTS, { projectPath } from "../data/projects";

const { title, subtitle, lead, cta } = PROJECTS_PAGE;

/** The index of every project: an intro, then one full-screen card per project. */
export default function Projects() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  usePageRuntime(rootRef, pageRef);
  useDocumentTitle("Projects");

  return (
    <div ref={rootRef} className="lv transition-wrapper">
      <main ref={pageRef} className="transition-container">
        <SiteHeader theme="theme_on-light" current="/projects" />

        <div className="s-w">
          <section data-bg="light" className="section">
            <div className="container">
              <div className="projects-hero-w">
                <div className="projects-hero-s">
                  <div className="projects-hero-s_t">
                    <div className="u-128" />
                    <div className="grid">
                      <div className="projects-hero-s_title">
                        <h1 data-prevent-flicker="" data-scroll-reveal="h" className="h2 a-center text-dark text-balance">
                          {title}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="projects-hero-s_c">
                    <div className="grid">
                      <div className="projects-hero-s_desc">
                        <div className="u-64 b-mob" />
                        <p data-prevent-flicker="" data-scroll-reveal="p" className="l1 med a-center text-gray">
                          {subtitle}
                        </p>
                        <div className="u-96 b-mob" />
                      </div>
                    </div>
                  </div>
                  <div className="projects-hero-s_b">
                    <div className="grid">
                      <div className="projects-hero-s_lead">
                        <h2 data-prevent-flicker="" data-scroll-reveal="p" className="h3 a-center text-dark">
                          {lead}
                        </h2>
                      </div>
                    </div>
                    <div className="u-8" />
                  </div>
                </div>
                <div className="w_bg">
                  <div className="w_bg_line b-desk">
                    <div className="w_bg_line_l-50">
                      <div className="deco tb o10" />
                    </div>
                    <div className="w_bg_line_l-25">
                      <div className="deco ltrb o10" />
                    </div>
                    <div className="w_bg_line_r-50">
                      <div className="deco tb o10" />
                    </div>
                    <div className="w_bg_line_r-25">
                      <div className="deco lbrt o10" />
                    </div>
                  </div>
                </div>
                <ShadowLayer inverse className="w_shadow _30 projects-hero-w_shadow" />
              </div>
            </div>
          </section>

          <section data-bg="color" className="section theme_on-color">
            <div className="container">
              <div className="projects-w">
                <div className="projects-s">
                  <div className="projects-cms">
                    <div className="projects-cms_list">
                      {PROJECTS.map((project) => (
                        <div key={project.slug} className="projects-cms_list_item">
                          <div data-mob="off" data-parallax="w" className="project-card">
                            <Link
                              floating-tip-trigger="view-project"
                              to={projectPath(project.slug)}
                              className="project-card_link"
                              aria-label={project.title}
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
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <CtaSection
            quote={cta.quote.map((line, i) => (
              <span key={line}>
                {line}
                {i < cta.quote.length - 1 && <br />}
              </span>
            ))}
            text={cta.text}
            image={cta.image}
            alt={cta.alt}
          />

          <SiteFooter current="/projects" />
        </div>
      </main>

      <SiteOverlays />
    </div>
  );
}
