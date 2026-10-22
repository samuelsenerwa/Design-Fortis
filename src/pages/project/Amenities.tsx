import ResponsiveImage from "../../components/ui/ResponsiveImage";
import type { Project } from "../../data/projects";
import { H } from "../../home/parts";
import { Lines } from "./parts";

/** The founders' quote beside the second picture (desktop) or after the strip (touch). */
function Quote({ quote }: { quote: NonNullable<Project["study"]["quote"]> }) {
  return (
    <div className="amen-s_quote">
      <div data-scroll-reveal="ctn" className="a1">
        “
      </div>
      <div className="amen-s_quote_c w-clearfix">
        <div className="red-line_title" />
        <p data-scroll-reveal="p" className="h2 text-dark text-pretty">
          {quote.text}
        </p>
        <div className="u-64" />
        <div className="amen-s_quote_author">
          <div data-scroll-reveal="p" className="l1 text-dark">
            {quote.author}
          </div>
          <div data-scroll-reveal="p" className="h3 s text-dark">
            {quote.role}
          </div>
        </div>
        <div className="u-128" />
      </div>
    </div>
  );
}

/** Pictures scattered across the 12-column grid (see the `5n + k` rules in projects.css). */
export default function Amenities({
  project,
  start,
  onOpen,
}: {
  project: Project;
  /** Lightbox index of the first picture. */
  start: number;
  onOpen: (index: number) => void;
}) {
  const { amenities, quote } = project.study;
  if (!amenities.length) return null;
  // The quote sits beside the second picture on desktop; with fewer pictures it follows the strip.
  const inline = amenities.length > 1;
  return (
    <section data-bg="light" className="section clip">
      <div className="container">
        <div className="amen-w">
          <div className="amen-s">
            <div className="u-128" />
            <div className="amen-cms scrollbar-none">
              <div className="amen-cms_list">
                {amenities.map((name, i) => (
                  <div key={`${name}-${i}`} className="amen-cms_list_item">
                    <div className="grid">
                      <div data-scroll-reveal="card" hover-card="" className="amen-card theme_on-color">
                        <div className="amen-card_info" />
                        <div className="img-w h-auto mob_amen-card_img">
                          <ResponsiveImage
                            name={name}
                            alt={project.title}
                            role="grid"
                            sizes="(max-width: 991px) 80vw, 50vw"
                            {...H("img")}
                            floating-tip-trigger="gallery"
                            className="img h-auto mob_amen-card_img"
                            onClick={() => onOpen(start + i)}
                          />
                          <div className="img-over-grad x1 top _30" />
                          <div className="img-over-grad x2 bot _30" />
                        </div>
                      </div>
                      {inline && i === 1 && quote && (
                        <div className="b-desk contents">
                          <Quote quote={quote} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {quote && (
              <div className={`grid${inline ? " b-mob" : ""}`}>
                <Quote quote={quote} />
              </div>
            )}
          </div>
          <div className="w_bg">
            <Lines tone="o10" />
          </div>
        </div>
      </div>
    </section>
  );
}
