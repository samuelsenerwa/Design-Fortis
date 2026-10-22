import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CONTACT, FOOTER, HEADER } from "./content";
import DeferredFluidCursor from "./DeferredFluidCursor";
import { ContactModal, MenuModal } from "./Modals";
import { H, Label, NavLink } from "./parts";
import Wordmark from "./Wordmark";

/** Fixed top bar shared by every page that runs the Lenval-style runtime. */
export function SiteHeader({
  theme = "theme_on-color",
  current,
}: {
  theme?: string;
  current?: string;
}) {
  return (
    <div className={theme}>
      <header data-theme="" data-header="" className={`header ${theme}`}>
        <div className="header_c">
          <div className="grid">
            <div
              hover-nav-item-trigger=""
              data-modal-menu-btn="mob"
              className="header_menu"
            >
              <div className="ico-24 text-dark">
                <div className="ico">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M3 8h18M3 16h18"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              </div>
              <div className="header_menu_label is-active">
                <span hover-nav-item="" className="nav-item">
                  <Label text="Menu" />
                </span>
              </div>
              <div className="header_menu_label">
                <span hover-nav-item="" className="nav-item">
                  <Label text="Close" />
                </span>
              </div>
            </div>
            <nav className="header_nav">
              {HEADER.nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  text={item.label}
                  current={item.to === current}
                />
              ))}
            </nav>
            <div className="header_logo">
              <Link
                data-header-logo=""
                to="/#hero"
                className="logo-mark"
                aria-label="Design Fortis — home"
              >
                <Wordmark />
              </Link>
            </div>
            <div className="header_cta">
              <div className="l1-list">
                <div data-current-time="" className="l1 text-dark">
                  00:00
                </div>
                <div className="l1 text-dark">{HEADER.timezoneLabel}</div>
              </div>
              <div className="b-desk">
                <div
                  data-modal-cta-btn="cta"
                  hover-nav-cta=""
                  hover-nav-item-trigger=""
                  className="nav-cta"
                >
                  <div {...H("dot-1")} data-dot="1" className="nav-cta_ico">
                    <div className="nav-cta_ico_dot" />
                  </div>
                  <span hover-nav-item="" className="nav-item">
                    <Label text="Let’s Talk" />
                  </span>
                  <div {...H("dot-2")} data-dot="2" className="nav-cta_ico">
                    <div className="nav-cta_ico_dot" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export function SiteFooter({ current = "/" }: { current?: string }) {
  return (
    <footer data-bg="dark" className="section clip theme_on-dark">
      <div className="container">
        <div className="footer-w">
          <div data-scroll-reveal="w" className="footer-s">
            <div className="u-64 b-mob" />
            <div className="u-8 b-desk" />
            <div className="footer-s_logo">
              <div data-fluid-mask="" className="footer-wordmark b-desk">
                {FOOTER.wordmark}
              </div>
              <div className="footer-wordmark b-mob">{FOOTER.wordmark}</div>
            </div>
          </div>
          <div className="u-8 b-desk" />
          <div className="footer-s_main">
            <div className="grid">
              <div
                data-scroll-reveal="ctn"
                className="footer-s_nav-title b-desk"
              >
                <div className="l1 text-dark">Explore</div>
              </div>
              <div data-scroll-reveal="ctn" className="footer-s_nav">
                {FOOTER.explore.map((item) => (
                  <Link
                    key={item.to}
                    hover-link=""
                    to={item.to}
                    className={`link${item.to === current ? " w--current" : ""}`}
                  >
                    <div className="link_label">
                      <div className="h2">{item.label}</div>
                    </div>
                    <div className="link_line">
                      <div {...H("line")} className="link_line_fill" />
                    </div>
                  </Link>
                ))}
              </div>
              <div className="footer-s_officess">
                <div className="grid _6-columns">
                  <div
                    data-scroll-reveal="ctn"
                    className="footer-s_officess_item"
                  >
                    <div className="l1 text-dark">Design Fortis</div>
                    <div className="u-16" />
                    <div className="contact-list">
                      <div className="contact-list_item">
                        <div className="contact-list_item_title">
                          <div className="h3 text-dark">M.</div>
                        </div>
                        <div className="contact-list_item_name">
                          <a
                            hover-link=""
                            href={`mailto:${CONTACT.email}`}
                            className="link"
                          >
                            <div className="link_label">
                              <div className="h3">{CONTACT.email}</div>
                            </div>
                            <div className="link_line">
                              <div {...H("line")} className="link_line_fill" />
                            </div>
                          </a>
                        </div>
                      </div>
                      <div className="contact-list_item">
                        <div className="contact-list_item_title">
                          <div className="h3 text-dark">P.</div>
                        </div>
                        <div className="contact-list_item_name">
                          <a
                            hover-link=""
                            href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                            className="link"
                          >
                            <div className="link_label">
                              <div className="h3">{CONTACT.phone}</div>
                            </div>
                            <div className="link_line">
                              <div {...H("line")} className="link_line_fill" />
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="u-48" />
                  </div>
                  <div
                    data-scroll-reveal="ctn"
                    className="footer-s_officess_item"
                  >
                    <div className="l1 text-dark">Studio</div>
                    <div className="u-16" />
                    <div className="contact-list">
                      <div className="contact-list_item">
                        <div className="contact-list_item_title">
                          <div className="h3 text-dark">S.</div>
                        </div>
                        <div className="contact-list_item_name">
                          <div className="h3 text-dark">{CONTACT.studio}</div>
                        </div>
                      </div>
                    </div>
                    <div className="u-48" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="u-192" />
          <div data-scroll-reveal="ctn" className="footer-s_bot">
            <div className="grid">
              <div className="footer-s_year">
                <div className="l1 text-dark">
                  ©<span className="year" />.
                </div>
              </div>
              <div className="footer-s_copyright">
                <div className="l1 text-dark">
                  Design Fortis. All rights reserved
                </div>
              </div>
              <div className="footer-s_legal">
                <div className="u-16" />
                <div className="legal-list">
                  <a
                    hover-nav-item=""
                    href={CONTACT.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-item"
                  >
                    <Label text="Instagram" />
                  </a>
                  <div className="l1 text-dark">,</div>
                  <a
                    hover-nav-item=""
                    href={CONTACT.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-item"
                  >
                    <Label text="LinkedIn" />
                  </a>
                </div>
              </div>
            </div>
            <div className="u-8" />
          </div>
        </div>
      </div>
    </footer>
  );
}

/** A circular cursor label, e.g. "View gallery". */
export function CircleTip({ name, label }: { name: string; label: string }) {
  return (
    <div floating-tip={name} className="floating-tip">
      <div className="btn-circle">
        <div className="l1">{label}</div>
      </div>
    </div>
  );
}

/**
 * Cursor tip, contact panel, mobile menu and cookie banner.
 * `tips` adds page-specific cursor tips; `children` adds page-specific modals.
 */
export function SiteOverlays({ tips, children }: { tips?: ReactNode; children?: ReactNode }) {
  return (
    <>
      <div className="floating-tips">
        <div className="floating-tips_list">
          <CircleTip name="view-project" label="View project" />
          {tips}
        </div>
      </div>

      {children}

      <DeferredFluidCursor />
      <ContactModal />
      <MenuModal />

      <div data-cookies="" className="cookies theme_on-dark">
        <div className="cookies_c">
          <div className="grid">
            <div className="cookies_card">
              <div className="cookies_card_title">
                <div
                  className="h3 text-dark"
                  style={{
                    textTransform: "uppercase",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "var(--l1)",
                  }}
                >
                  Cookies
                </div>
                <div className="u-8" />
                <div className="h3 text-dark">
                  Design Fortis uses cookies to deliver a considered browsing
                  experience. No data is shared with third parties.
                </div>
              </div>
              <div className="u-32" />
              <div className="cookies_card_btns">
                <a
                  data-cookies="accept"
                  hover-nav-item=""
                  href="#"
                  className="nav-item"
                >
                  <Label text="Accept" />
                </a>
                <a
                  data-cookies="decline"
                  hover-nav-item=""
                  href="#"
                  className="nav-item"
                >
                  <Label text="Decline" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
