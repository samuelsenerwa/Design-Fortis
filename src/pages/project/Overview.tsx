import type { Project } from "../../data/projects";
import ShadowLayer from "../../home/ShadowLayer";
import { H } from "../../home/parts";
import { Lines } from "./parts";

const PlayIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M5 3.5v9l7-4.5-7-4.5Z" fill="currentColor" />
  </svg>
);

/** The brief in a paragraph, the key facts, and (when there is one) a looping reel. */
export default function Overview({ project }: { project: Project }) {
  const { study } = project;
  return (
    <section data-bg="light" className="section clip">
      <div className="container">
        <div className="overview-w">
          <div className="overview-s">
            <div className="u-128" />
            <div className="grid">
              <div className="overview-s_lead">
                <div className="overview-s_lead_overview w-clearfix">
                  <div className="red-line_title">
                    <div data-scroll-reveal="p" className="l1 text-dark">
                      Overview
                    </div>
                  </div>
                  <h2 data-scroll-reveal="p" className="h2 text-dark">
                    {study.overview}
                  </h2>
                  <div className="u-128" />
                </div>
                {study.context && (
                  <div className="grid _7-columns">
                    <div className="overview-s_desc">
                      <p data-scroll-reveal="p" className="p1 text-dark">
                        {study.context}
                      </p>
                      <div className="u-48" />
                    </div>
                  </div>
                )}
                <div className="overview-s_lead_line">
                  <div className="deco lbrt o10" />
                </div>
              </div>
            </div>
            <div className="grid">
              <div className="overview-s_data">
                <div className="overview-s_data_list">
                  {study.facts.map((fact) => (
                    <div key={fact.label} className="overview-s_data_list_item">
                      <div className="overview-data-card">
                        <div className="overview-data-card_line">
                          <div className="line-h" />
                        </div>
                        <div className="grid _9-columns">
                          <div className="overview-data-card_title">
                            <div data-scroll-reveal="p" className="l1 text-dark">
                              {fact.label}
                            </div>
                          </div>
                          <div className="overview-data-card_value">
                            <h3 data-scroll-reveal="p" className="h3 text-dark mob_a-right">
                              {fact.value}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {study.reel && (
              <>
                <div className="u-128" />
                <div className="grid">
                  <div
                    data-modal-video-btn={study.reel}
                    data-video-playpause=""
                    hover-img-card=""
                    className="overview-s_video theme_on-color"
                  >
                    <div className="video-w">
                      <div className="img-over-grad _30" />
                      <video
                        {...H("img")}
                        className="video"
                        src={study.reel}
                        playsInline
                        muted
                        loop
                        preload="metadata"
                        disablePictureInPicture
                      />
                    </div>
                    <div className="overview-s_video_label">
                      <div className="ico-16 text-dark">
                        <div className="ico">
                          <PlayIcon />
                        </div>
                      </div>
                      <div className="l1 text-dark">Play reel</div>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="u-8" />
          </div>
          <div className="w_bg">
            <Lines tone="o10" />
          </div>
          <ShadowLayer className="overview-w_shadow" />
        </div>
      </div>
    </section>
  );
}
