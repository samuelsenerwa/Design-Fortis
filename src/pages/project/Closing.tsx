import { Link } from "react-router-dom";
import ResponsiveImage from "../../components/ui/ResponsiveImage";
import { getNextProject, projectPath, type Project } from "../../data/projects";
import ShadowLayer from "../../home/ShadowLayer";
import { H } from "../../home/parts";
import { AllProjectsLink } from "./parts";

/** "Interested to learn more? Let's talk": one line of display type that drifts as you scroll. */
export function LearnMore() {
  return (
    <section data-snap="" data-bg="light" className="section">
      <div className="container">
        <div data-parallax="w" className="project-cta-w">
          <div className="project-cta-s">
            <div className="project-cta-s_line">
              <div className="page-divider">
                <div className="line-h" />
              </div>
            </div>
            <h3 data-parallax="img" className="project-cta-s_title grid h1">
              <span className="project-cta-s_title_word-1">Interested</span>
              <span className="project-cta-s_title_word-2">to</span>
              <span className="project-cta-s_title_word-3">Learn more?</span>
              <div className="project-cta-s_title_cta">
                <a
                  data-modal-cta-btn="cta"
                  hover-link=""
                  href="#"
                  className="link"
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="link_label">Let’s Talk</div>
                  <div className="link_line">
                    <div {...H("line")} className="link_line_fill" />
                  </div>
                </a>
              </div>
            </h3>
          </div>
          <div className="w_bg">
            <div className="w_bg_line">
              <div className="w_bg_line_l-50">
                <div className="deco lbrt o10" />
              </div>
              <div className="w_bg_line_r-50">
                <div className="deco lbrt o10" />
              </div>
              <div className="w_bg_line_100">
                <div className="deco tb o10" />
              </div>
            </div>
          </div>
          <ShadowLayer className="w_shadow _30 project-cta-w_shadow" />
        </div>
      </div>
    </section>
  );
}

/** The next project in the index, shown as a full-screen card. */
export function NextProject({ project }: { project: Project }) {
  const next = getNextProject(project.slug);
  const back = (
    <div data-scroll-reveal="p" className="next-projects-card_btn">
      <AllProjectsLink />
    </div>
  );
  return (
    <section data-bg="light" className="section">
      <div className="container">
        <div className="next-w">
          <div className="next-s">
            <div className="page-divider">
              <div className="line-h" />
            </div>
            <div className="next-projects-card">
              <Link
                floating-tip-trigger="view-project"
                to={projectPath(next.slug)}
                aria-label={next.title}
                className="next-projects-card_link"
              />
              <div className="next-projects-card_t">
                <div className="next-projects-card_t_t">
                  <div className="b-mob">
                    <div className="u-128" />
                    {back}
                  </div>
                </div>
                <div className="next-projects-card_t_b">
                  <div className="grid">
                    <div className="next-projects-card_title">
                      <div className="b-desk">{back}</div>
                      <div className="b-desk">
                        <div className="u-16" />
                      </div>
                      <div data-scroll-reveal="h" className="h1 text-dark b-desk">
                        Next
                      </div>
                      <div className="b-mob">
                        <div className="u-8" />
                        <div data-scroll-reveal="h" className="h2 text-dark">
                          Next
                        </div>
                      </div>
                    </div>
                    <div className="next-projects-card_name">
                      <div className="data-list a-center">
                        <div data-scroll-reveal="p" className="l1 text-dark">
                          {next.location}
                        </div>
                      </div>
                      <div className="b-desk">
                        <div className="u-16" />
                        <div data-scroll-reveal="h" className="h1 text-dark">
                          {next.title}
                        </div>
                      </div>
                      <div className="b-mob">
                        <div className="u-8" />
                        <div data-scroll-reveal="h" className="h2 text-dark">
                          {next.title}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="u-24 b-desk" />
                  <div className="u-8 b-mob" />
                </div>
              </div>
              <div className="next-projects-card_b">
                <div data-parallax="w" className="img-w">
                  <ResponsiveImage
                    name={next.image}
                    alt={next.title}
                    role="hero"
                    sizes="(max-width: 991px) 130vw, 100vw"
                    data-parallax="img"
                    className="img-p-s"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

