import { useRef } from "react";
import "../home/home.css";
import "../home/contact.css";
import { CONTACT, CONTACT_PAGE } from "../home/content";
import { Btn, H } from "../home/parts";
import ShadowLayer from "../home/ShadowLayer";
import { SiteFooter, SiteHeader, SiteOverlays } from "../home/SiteChrome";
import { usePageRuntime } from "../home/usePageRuntime";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const { label, title, emailLabel, text } = CONTACT_PAGE;

/** One screen: a greeting on the left, the address and a button to the contact panel on the right. */
export default function Contact() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  usePageRuntime(rootRef, pageRef);
  useDocumentTitle("Contact");

  return (
    <div ref={rootRef} className="lv transition-wrapper">
      <main ref={pageRef} className="transition-container">
        <SiteHeader theme="theme_on-light" current="/contact" />

        <div className="s-w">
          <section data-parallax-s-out="" data-bg="light" className="section">
            <div className="container">
              <div className="contact-w">
                <div data-scroll-reveal="w" className="contact-s v-2">
                  <div className="grid fill">
                    <div className="contact-s_l">
                      <div className="contact-s_t">
                        <div className="u-8" />
                        <div className="contact-s_title v-2">
                          <div className="u-128" />
                          <h1 data-prevent-flicker="" data-scroll-reveal="p" className="l1 text-dark">
                            {label}
                          </h1>
                          <div className="u-16 b-mob" />
                        </div>
                      </div>
                      <div className="contact-s_c">
                        <div className="contact-s_lead">
                          <h2 data-prevent-flicker="" data-scroll-reveal="h" className="h2 text-dark">
                            {title[0]}
                            <br />
                            {title[1]}
                          </h2>
                        </div>
                      </div>
                      <div className="contact-s_b b-desk">
                        <div className="u-32" />
                      </div>
                    </div>
                    <div className="contact-s_r">
                      <div className="contact-s_t b-desk" />
                      <div className="contact-s_c">
                        <div className="contact-s_email">
                          <div className="u-8 b-mob" />
                          <div className="contact-cms_list_item v-2">
                            <div data-prevent-flicker="" data-scroll-reveal="h" className="h2 text-a-gray">
                              {emailLabel}
                            </div>
                            <a
                              hover-link=""
                              href={`mailto:${CONTACT.email}`}
                              aria-label={CONTACT.email}
                              className="link"
                            >
                              <div className="link_label">
                                <div data-prevent-flicker="" data-scroll-reveal="h" className="h2">
                                  {CONTACT.email}
                                </div>
                              </div>
                              <div className="link_line">
                                <div {...H("line")} className="link_line_fill" />
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="contact-s_b">
                        <div className="grid _4-columns">
                          <div className="contact-s_desc">
                            <p data-prevent-flicker="" data-scroll-reveal="p" className="p1">
                              {text}
                            </p>
                            <div className="u-24" />
                            <div data-prevent-flicker="" data-scroll-reveal="ctn" className="contact-s_btn">
                              <Btn text="Let’s Talk" modal icon="dot" />
                            </div>
                            <div className="u-48" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ShadowLayer className="w_shadow _30" />
                <div className="w_bg">
                  <div className="w_bg_line b-desk">
                    <div className="w_bg_line_100">
                      <div className="deco tb o10" />
                    </div>
                    <div className="w_bg_line_r-50">
                      <div className="deco lbrt o10" />
                    </div>
                  </div>
                  <div className="w_bg_line b-mob">
                    <div className="w_bg_line_100">
                      <div className="deco lr o10" />
                    </div>
                    <div className="w_bg_line_b-50">
                      <div className="deco lbrt o10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <SiteFooter current="/contact" />
        </div>
      </main>

      <SiteOverlays />
    </div>
  );
}
