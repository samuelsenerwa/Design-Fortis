import ResponsiveImage from "../../components/ui/ResponsiveImage";
import { H, Label } from "../../home/parts";
import type { Project } from "../../data/projects";
import { Lines } from "./parts";

/** Dated build updates in a draggable strip with a progress hairline. */
export default function Progress({ project }: { project: Project }) {
  const progress = project.study.progress;
  if (!progress) return null;
  return (
    <section data-bg="light" className="section clip">
      <div className="container">
        <div className="const-w">
          <div className="const-s">
            <div className="const-s_t">
              <div className="u-128" />
              <div className="grid">
                <div className="const-s_title">
                  <h2 data-scroll-reveal="h" className="h1 text-dark text-balance">
                    {progress.title}
                  </h2>
                  <div className="u-64 b-mob" />
                </div>
                <div className="const-s_desc">
                  <p data-scroll-reveal="p" className="p1 text-dark">
                    {progress.text}
                  </p>
                </div>
              </div>
              <div className="u-64" />
              <div className="page-divider">
                <div className="line-h" />
              </div>
              <div className="w_bg">
                <Lines tone="o10" />
              </div>
            </div>
            <div className="grid">
              <div data-carousel="" className="const-s_cms">
                <div className="u-48" />
                <div className="const-cms swiper">
                  <div data-scroll-reveal="carousel" className="const-cms_list swiper-wrapper">
                    {progress.entries.map((entry) => (
                      <div key={entry.date} className="const-cms_list_item swiper-slide">
                        <div hover-const-card="" hover-card="" hover-img-card="" className="const-card theme_on-color">
                          <div className="const-card_info">
                            <div className="const-card_info_t">
                              <div className="h3 text-dark a-right">{entry.date}</div>
                            </div>
                            <div className="const-card_info_b">
                              <div {...H("info")} className="card_desc">
                                <p {...H("p")} className="h3 text-dark">
                                  {entry.text}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="img-w _w-auto">
                            <div className="img-over-grad x1 top _30" />
                            <div className="img-over-grad x2 bot _30" />
                            <ResponsiveImage
                              name={entry.image}
                              alt={`${project.title}, ${entry.date}`}
                              role="grid"
                              sizes="(max-width: 991px) 80vw, 25vw"
                              {...H("img")}
                              className="img _w-auto"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="u-48" />
                <div className="pag">
                  <div className="pag_progress">
                    <div data-slider="progress" className="pag_progress_active" />
                  </div>
                  <div className="u-32" />
                  <div className="pag_list">
                    <div className="pag_l">
                      <div className="l1 text-dark">Construction progress</div>
                    </div>
                    <div className="pag_r">
                      <div className="l1-list">
                        <div data-slider="current" className="l1 med text-gray">
                          00
                        </div>
                        <div className="l1 med text-gray">/</div>
                        <div data-slider="total" className="l1 med text-gray">
                          00
                        </div>
                      </div>
                      <div className="pag-list">
                        <div data-slider="prev" className="pag_prev">
                          <span hover-nav-item="" className="nav-item">
                            <Label text="Prev" />
                          </span>
                        </div>
                        <div className="l1 med text-gray">/</div>
                        <div data-slider="next" className="pag_next">
                          <span hover-nav-item="" className="nav-item">
                            <Label text="Next" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="u-32" />
                </div>
                <div className="u-32" />
              </div>
            </div>
            <div className="u-32" />
          </div>
        </div>
      </div>
    </section>
  );
}
