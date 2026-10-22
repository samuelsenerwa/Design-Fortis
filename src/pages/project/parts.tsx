import { Link } from "react-router-dom";
import { CloseButton } from "../../home/Modals";
import { H, Label } from "../../home/parts";
import type { Hotspot } from "../../data/projects";

/** Hairlines drawn behind a section. `tone` picks the colour (see `.deco` in home.css). */
export function Lines({
  tone,
  vertical = true,
  diagonal,
}: {
  tone: "o10" | "o20w";
  vertical?: boolean;
  diagonal?: "left" | "right";
}) {
  return (
    <div className="w_bg_line">
      {vertical && (
        <div className="w_bg_line_l-50">
          <div className={`deco tb ${tone}`} />
        </div>
      )}
      {diagonal && (
        <div className={diagonal === "left" ? "w_bg_line_l-50" : "w_bg_line_r-50"}>
          <div className={`deco lbrt ${tone}`} />
        </div>
      )}
    </div>
  );
}

/** A plus whose bars the runtime turns on hover. */
export function Plus({ size = 16 }: { size?: 16 | 48 }) {
  return (
    <div className={`ico-${size}`}>
      <div className="ico">
        <div data-ico-plus="h" className="ico">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 11.5V12.5H5V11.5H19Z" fill="currentColor" />
          </svg>
        </div>
        <div data-ico-plus="v" className="ico is-2">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12.5 19L11.5 19L11.5 5L12.5 5L12.5 19Z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/** Underlined text button with a plus, e.g. "View gallery". */
export function PlusButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <div hover-btn="" hover-nav-item-trigger="" className="btn">
      <div className="btn_label">
        <span hover-nav-item="" className="nav-item">
          <Label text={text} />
        </span>
      </div>
      <div {...H("ico")} className="btn_ico">
        <Plus />
      </div>
      <div {...H("line")} className="btn_line" />
      <a
        href="#"
        aria-label={text}
        className="btn_link"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
      />
    </div>
  );
}

/** "← All projects" back link. */
export function AllProjectsLink() {
  return (
    <div hover-nav-item-trigger="" className="nav-item-ico">
      <div className="ico-16">
        <div className="ico">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13 8H3M7 4 3 8l4 4" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </div>
      <Link hover-nav-item="" to="/projects" className="nav-item">
        <Label text="All projects" />
      </Link>
    </div>
  );
}

/** Pins laid over a picture; they use the cursor card (desktop) or a bottom sheet (touch). */
export function Pins({ spots }: { spots: Hotspot[] }) {
  return (
    <div className="pins-cms">
      <div className="pins-cms_list">
        {spots.map((spot) => (
          <div
            key={spot.id}
            data-modal-tip-btn={spot.id}
            data-pin={spot.id}
            floating-tip-trigger={spot.id}
            className="pins-cms_list_item"
            style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
          >
            <div className="pin">
              <Plus />
              <div className="pin_bg">
                <div data-pin-pulse="" className="pin_bg_pulse" />
                <div data-pin-pulse="" className="pin_bg_pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Hint shown over a picture that scrolls sideways on touch screens. */
export function SwipeTip() {
  return (
    <div className="swipe-tip b-mob">
      <div className="swipe-tip_label">
        <div className="l1 text-dark">Drag to explore</div>
        <div className="ico-16 text-dark">
          <div className="ico">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
        </div>
      </div>
      <div className="swipe-tip_bar">
        <div className="line-h" />
      </div>
    </div>
  );
}

/** Cursor cards (desktop) and bottom sheets (touch) for every hotspot on the page. */
export function HotspotTips({ spots }: { spots: Hotspot[] }) {
  return (
    <>
      {spots.map((spot) => (
        <div key={spot.id} floating-tip={spot.id} className="floating-tip">
          <div className="floating-tip-card theme_on-dark">
            <div className="floating-tip-card_title">
              <h1 data-el="h" className="h2 text-dark">
                {spot.title}
              </h1>
            </div>
            <div className="u-96" />
            <div className="floating-tip-card_desc">
              <p data-el="p" className="p1 text-dark">
                {spot.text}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function HotspotSheets({ spots }: { spots: Hotspot[] }) {
  return (
    <div className="modal show">
      <div className="modal_list">
        {spots.map((spot) => (
          <div key={spot.id} data-modal-tip={spot.id} className="modal_list_item">
            <div className="modal_tip theme_on-color">
              <div className="grid">
                <div data-modal-container="" className="modal_tip_c">
                  <div className="modal_tip_c_title">
                    <div className="h2 text-dark">{spot.title}</div>
                  </div>
                  <div className="u-96" />
                  <div className="modal_tip_c_desc">
                    <p className="p1 text-dark">{spot.text}</p>
                  </div>
                  <CloseButton />
                </div>
              </div>
              <div data-modal-close="" data-modal-over="" className="modal_over" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Full-screen player the "Play reel" tile opens (see `initVideoModal`). */
export function ReelModal() {
  return (
    <div data-modal-video="" className="modal video">
      <div className="modal_c">
        <div className="modal_video theme_on-color">
          <video data-modal-video-el="" className="video contain" playsInline />
          <CloseButton />
        </div>
      </div>
    </div>
  );
}
