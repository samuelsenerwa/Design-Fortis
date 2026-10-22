import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/** Non-standard attribute helper: `hover="text"` etc. are read by the runtime. */
export const H = (value: string) => ({ hover: value });

/** Two stacked copies of a label; the runtime rolls characters between them on hover. */
export function Label({ text, className = "l1" }: { text: string; className?: string }) {
  return (
    <div className="nav-item_label">
      <div className="nav-item_label_text">
        <div {...H("text")} className={className}>
          {text}
        </div>
      </div>
      <div className="nav-item_label_text is-2">
        <div {...H("text")} className={className}>
          {text}
        </div>
      </div>
    </div>
  );
}

export function NavLink({ to, text, current }: { to: string; text: string; current?: boolean }) {
  return (
    <Link hover-nav-item="" to={to} className={`nav-item${current ? " w--current" : ""}`}>
      <Label text={text} />
    </Link>
  );
}

export const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export const DotIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="2.5" fill="currentColor" />
  </svg>
);

/** Underlined text button whose line fills on hover. Links somewhere, or opens the contact panel. */
export function Btn({ text, to, modal, icon = "arrow" }: { text: string; to?: string; modal?: boolean; icon?: "arrow" | "dot" }) {
  const modalAttr = modal ? { "data-modal-cta-btn": "cta" } : {};
  return (
    <div {...modalAttr} hover-nav-item-trigger="" hover-btn="" className="btn">
      <div className="btn_label">
        <span hover-nav-item="" className="nav-item">
          <Label text={text} />
        </span>
      </div>
      <div {...H("ico")} className="btn_ico">
        <div className="ico-16">
          <div className="ico">
            {icon === "dot" ? <DotIcon /> : <ArrowIcon />}
          </div>
        </div>
      </div>
      <div {...H("line")} className="btn_line" />
      {to ? (
        <Link to={to} className="btn_link" aria-label={text} />
      ) : (
        <a href="#" className="btn_link" aria-label={text} onClick={(e) => e.preventDefault()} />
      )}
    </div>
  );
}

/** Hairline pair used behind sections (vertical + diagonal), matching each section's tone. */
export function Hairlines({ tone, vertical = true, diagonal }: { tone: "light-on-dark" | "dark-on-light" | "white"; vertical?: boolean; diagonal?: "left" | "right" | "full" }) {
  const cls = tone === "light-on-dark" ? "o05" : tone === "white" ? "o20w" : "o05d";
  return (
    <div className="w_bg_line">
      {vertical && (
        <div className="w_bg_line_100">
          <div className={`deco tb ${cls}`} />
        </div>
      )}
      {diagonal && (
        <div className={diagonal === "left" ? "w_bg_line_l-50" : diagonal === "right" ? "w_bg_line_r-50" : "w_bg_line_100"}>
          <div className={`deco lbrt ${cls}`} />
        </div>
      )}
    </div>
  );
}

export function Section({ children }: { children: ReactNode }) {
  return <div className="container">{children}</div>;
}
