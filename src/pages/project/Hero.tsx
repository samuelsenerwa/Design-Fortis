import ResponsiveImage from "../../components/ui/ResponsiveImage";
import type { Project } from "../../data/projects";

/** Full-screen opening: location, name and tagline over the lead picture. */
export default function Hero({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <section data-bg="color" className="section theme_on-color">
      <div className="container">
        <div className="project-hero-w">
          <div className="project-hero-s">
            <div className="project-hero-s_t">
              <div className="u-128" />
              <div className="grid">
                <div className="project-hero-s_title">
                  <div className="data-list a-center">
                    <p data-prevent-flicker="" data-scroll-reveal="p" className="l1 text-dark">
                      {project.location}
                    </p>
                  </div>
                  <div className="u-16" />
                  <h1 data-prevent-flicker="" data-scroll-reveal="h" className="h1 a-center text-dark">
                    {project.title}
                  </h1>
                </div>
              </div>
            </div>
            <div className="project-hero-s_b">
              <div className="grid">
                <div className="project-hero-s_desc">
                  <p data-prevent-flicker="" data-scroll-reveal="p" className="h3 a-center text-dark">
                    {project.study.tagline}
                  </p>
                  <div className="u-8" />
                </div>
              </div>
            </div>
          </div>
          <div className="w_bg">
            <div className="project_img">
              <div data-parallax="w" className="img-w">
                <ResponsiveImage
                  name={project.image}
                  alt={project.title}
                  role="hero"
                  loading="eager"
                  sizes="(max-width: 991px) 180vh, 100vw"
                  data-parallax-img-out=""
                  floating-tip-trigger="gallery"
                  className="img"
                  onClick={onOpen}
                />
              </div>
              <div className="img-over-grad x5 top _30" />
              <div className="img-over-grad x3 bot" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
