import type { ReactNode } from "react";
import ResponsiveImage from "../components/ui/ResponsiveImage";
import { Btn } from "./parts";

interface CtaSectionProps {
  quote: ReactNode;
  text: string;
  /** Basename of the sky picture behind the quote. */
  image: string;
  alt: string;
}

/** Closing quote over a parallax photograph, ending on the contact panel button. */
export default function CtaSection({ quote, text, image, alt }: CtaSectionProps) {
  return (
    <section data-bg="color" className="section theme_on-color">
      <div className="container">
        <div className="cta-w">
          <div className="cta-s">
            <div className="u-128" />
            <div className="grid">
              <div className="cta-s_title">
                <h2 data-scroll-reveal="h" className="h1 text-dark">
                  {quote}
                </h2>
              </div>
            </div>
            <div className="u-96" />
            <div className="grid">
              <div className="cta-s_desc">
                <p data-scroll-reveal="p" className="p1 text-dark">
                  {text}
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
              <div className="w_bg_line_100 b-mob">
                <div className="deco lbrt o20w" />
              </div>
            </div>
            <div data-parallax="w" className="img-w top">
              <ResponsiveImage
                name={image}
                alt={alt}
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
  );
}
