import ResponsiveImage from "../../components/ui/ResponsiveImage";
import type { Project } from "../../data/projects";
import { PlusButton } from "./parts";

/**
 * "What's Inside": a pinned stage. Tall title rows scroll past it; whichever title is
 * centred swaps in its note and its picture set (see `initInsideChapters`).
 */
export default function Inside({
  project,
  starts,
  onOpen,
}: {
  project: Project;
  /** Lightbox index of each chapter's first picture. */
  starts: number[];
  onOpen: (index: number) => void;
}) {
  const chapters = project.study.inside;
  if (!chapters?.length) return null;
  return (
    <>
      <div data-scroll-trigger="refresh" className="trigger-refresh" />
      <section data-bg="color" className="section clip theme_on-color">
        <div className="container">
          <div data-parallax="w" className="inside-w">
            <div className="inside-s">
              <div className="inside-s_screen">
                <div className="inside-s_screen_t">
                  <div className="u-128" />
                  <div className="grid">
                    <div className="inside-s_screen_title">
                      <h2 data-scroll-reveal="p" className="l1 text-dark">
                        What’s Inside
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="inside-s_screen_b">
                  <div className="grid">
                    <div className="inside-desc-cms">
                      <div className="inside-desc-cms_list">
                        {chapters.map((chapter, i) => (
                          <div key={chapter.title} data-reveal-first="" className="inside-desc-cms_list_item">
                            <div className="inside-desc-card">
                              <p data-scroll-reveal="p" data-card="p" className="p1 text-dark">
                                {chapter.text}
                              </p>
                              <div className="u-24" />
                              <div data-scroll-reveal="ctn" data-card="ctn" className="inside-desc-card_btn">
                                <PlusButton text="View gallery" onClick={() => onOpen(starts[i])} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="u-48 b-desk" />
                  <div className="u-128 b-mob" />
                </div>
              </div>
              <div className="inside-title-cms">
                <div className="inside-title-cms_list">
                  {chapters.map((chapter) => (
                    <div key={chapter.title} className="inside-title-cms_list_item">
                      <div className="inside-title-card">
                        <div className="grid">
                          <div className="inside-title-card_title">
                            <h3 data-scroll-reveal="h" className="h1 text-dark">
                              {chapter.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w_bg">
              <div className="w_bg_line">
                <div className="w_bg_line_l-50">
                  <div className="deco tb o20w" />
                </div>
              </div>
              <div data-parallax-img-out="" data-parallax-img-in="" className="inside-img-cms">
                <div className="inside-img-cms_list">
                  {chapters.map((chapter, i) => (
                    <div key={chapter.title} data-slider="" className="inside-img-cms_list_item">
                      <div className="gallery-cms">
                        <div className="gallery-cms_list">
                          {chapter.images.map((name, j) => (
                            <div key={`${name}-${j}`} data-slider="slide" className="gallery-cms_list_item">
                              <div className="inside-img-card">
                                <div className="img-w">
                                  <ResponsiveImage
                                    name={name}
                                    alt={chapter.title}
                                    role="hero"
                                    loading="eager"
                                    sizes="(max-width: 991px) 180vh, 100vw"
                                    data-slider="img"
                                    className="img inside-img-card_img"
                                    onClick={() => onOpen(starts[i] + j)}
                                  />
                                  <div className="img-over-grad x3 top _30" />
                                  <div className="img-over-grad x5 bot" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div data-slider="pag" className="gallery-slide_pag">
                        <div floating-tip-trigger="prev" data-slider="prev" className="gallery-slide_pag_prev" />
                        <div floating-tip-trigger="next" data-slider="next" className="gallery-slide_pag_next" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
