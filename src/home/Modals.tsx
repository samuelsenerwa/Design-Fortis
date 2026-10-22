import { Fragment, useState, type ChangeEvent } from "react";
import { useForm } from "@formspree/react";
import { Link } from "react-router-dom";
import { H, Label } from "./parts";
import { FOOTER } from "./content";

const FORMSPREE_ID = "mykbeoyn";

const DIAL_CODES = [
  ["Kenya", "+254"],
  ["Uganda", "+256"],
  ["Tanzania", "+255"],
  ["Rwanda", "+250"],
  ["Ethiopia", "+251"],
  ["South Africa", "+27"],
  ["Nigeria", "+234"],
  ["Ghana", "+233"],
  ["Egypt", "+20"],
  ["UAE", "+971"],
  ["Saudi Arabia", "+966"],
  ["Qatar", "+974"],
  ["United Kingdom", "+44"],
  ["Ireland", "+353"],
  ["Germany", "+49"],
  ["France", "+33"],
  ["Italy", "+39"],
  ["Spain", "+34"],
  ["Netherlands", "+31"],
  ["Sweden", "+46"],
  ["Norway", "+47"],
  ["Switzerland", "+41"],
  ["United States", "+1"],
  ["Canada", "+1"],
  ["India", "+91"],
  ["China", "+86"],
  ["Australia", "+61"],
] as const;

const CloseIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="m3.5 3.5 9 9m0-9-9 9" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export function CloseButton() {
  return (
    <div data-modal-close="" className="modal_close">
      <div data-magnetic-strength="" className="btn-close">
        <div data-magnetic-inner-target="" className="btn-close_ico">
          <div className="ico-16 text-dark">
            <div className="ico">
              <CloseIcon />
            </div>
          </div>
        </div>
      </div>
      <a href="#" className="btn-close_link" aria-label="Close" onClick={(e) => e.preventDefault()} />
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  area,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  area?: boolean;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(false);
  const up = focused || filled;
  const common = {
    id: name,
    name,
    required,
    className: `input_field l1${area ? " area" : ""}`,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFilled(e.target.value.trim() !== ""),
  };
  return (
    <div className="input">
      <div className={`input_label${up ? " focused" : ""}`}>
        <label htmlFor={name} className="l1 med text-gray">
          {label}
          {required ? "*" : ""}
        </label>
      </div>
      {area ? <textarea {...common} data-lenis-prevent="" /> : <input {...common} type={type} />}
    </div>
  );
}

/** "Let's talk" slide-in panel: enquiry form (Formspree) with an in-place confirmation. */
export function ContactModal() {
  const [state, submit] = useForm(FORMSPREE_ID);
  const [dial, setDial] = useState("+254");
  const [agreed, setAgreed] = useState(false);

  return (
    <div data-modal-cta="cta" className="modal">
      <div data-modal-over="" data-modal-close="" className="modal_over" />
      <div className="modal_c">
        <div data-lenis-prevent="" data-modal-container="" className="modal_cta">
          <div className="u-96 b-mob" />
          <div className="grid-c fill theme_on-light">
            {state.succeeded ? (
              <div className="form_success theme_on-dark" style={{ display: "block" }}>
                <div className="form_success_c">
                  <div className="form_success_t">
                    <div className="u-128" />
                    <div className="grid _8-columns">
                      <div className="form_success_title">
                        <div className="l1 a-center text-dark">Thank you</div>
                      </div>
                    </div>
                  </div>
                  <div className="form_success_c">
                    <div className="grid _8-columns">
                      <div className="form_success_lead">
                        <div className="h2 a-center text-dark">(We’ve received your message)</div>
                      </div>
                    </div>
                  </div>
                  <div className="form_success_b">
                    <div className="grid _8-columns">
                      <div className="form_success_desc">
                        <div className="p1 a-center text-dark">
                          A member of the Design Fortis team will review your message and respond personally. We
                          typically reply within one business day.
                        </div>
                      </div>
                    </div>
                    <div className="u-96" />
                  </div>
                </div>
                <CloseButton />
              </div>
            ) : (
              <div className="form w-form">
                <form className="form_block" onSubmit={submit}>
                  <div className="form_block_c">
                    <div className="form_block_t">
                      <div className="u-96" />
                      <div className="grid _8-columns">
                        <div className="form_block_title">
                          <h1 className="l1">
                            <strong>Get in Touch</strong>
                          </h1>
                          <div className="u-16" />
                          <h1 className="h1">Speak Directly</h1>
                        </div>
                      </div>
                      <div className="u-64" />
                    </div>
                    <div className="form_block_b">
                      <div className="grid _8-columns">
                        <div className="form_block_desc">
                          <p className="p1">
                            For partnership discussions, media enquiries, or any matter related to our work — we
                            welcome direct conversation.
                            <br />
                            <br />
                            All enquiries are handled personally and in confidence.
                          </p>
                          <div className="u-16 b-mob" />
                        </div>
                        <div className="form_block_list">
                          <Field label="Full Name" name="name" required />
                          <Field label="Email" name="email" type="email" required />
                          <div className="input">
                            <div className="input-list">
                              <div className="input-list_item">
                                <select
                                  name="country-code"
                                  value={dial}
                                  onChange={(e) => setDial(e.target.value)}
                                  className="input_field code-select l1"
                                  aria-label="Country code"
                                >
                                  {DIAL_CODES.map(([name, code]) => (
                                    <option key={`${name}${code}`} value={code}>
                                      {code === dial ? code : `${name} (${code})`}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="input-list_item fill">
                                <Field label="Phone Number" name="phone" type="tel" />
                              </div>
                            </div>
                          </div>
                          <Field label="Message" name="message" area />
                          <label className="chackbox">
                            <input
                              type="checkbox"
                              name="consent"
                              checked={agreed}
                              onChange={(e) => setAgreed(e.target.checked)}
                              required
                            />
                            <span className="chackbox_toggle" />
                            <span className="l1 med text-gray">By submitting, you agree to be contacted about your enquiry.</span>
                          </label>
                          <div className="u-96" />
                          <div className="form_block_btn">
                            <button type="submit" disabled={state.submitting} style={{ all: "unset", display: "block" }}>
                              <div hover-nav-item-trigger="" hover-btn="" className="btn">
                                <div className="btn_label">
                                  <span hover-nav-item="" className="nav-item">
                                    <Label text={state.submitting ? "Sending..." : "Submit Enquiry"} />
                                  </span>
                                </div>
                                <div {...H("ico")} className="btn_ico">
                                  <div className="ico-16">
                                    <div className="ico">
                                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                        <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                                <div {...H("line")} className="btn_line" />
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="u-8" />
                      <div className="u-8 b-mob" />
                    </div>
                  </div>
                  <div className="w_bg">
                    <div className="w_bg_line b-desk">
                      <div className="w_bg_line_l-50">
                        <div className="deco lbrt o10" />
                      </div>
                      <div className="w_bg_line_100">
                        <div className="deco tb o10" />
                      </div>
                    </div>
                  </div>
                </form>
                <CloseButton />
                {state.errors && Object.keys(state.errors).length > 0 && (
                  <div className="form_error" style={{ display: "block" }}>
                    <div className="p1">
                      Oops!
                      <br />
                      Something went wrong while submitting the form.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mobile menu sheet. */
export function MenuModal() {
  return (
    <div data-modal-menu="mob" className="modal menu">
      <div className="modal_c">
        <div data-modal="container" className="modal_menu theme_on-dark">
          <div className="modal_menu_t" />
          <div className="modal_menu_c">
            <div data-modal="list" className="modal_menu_list">
              {FOOTER.explore.map((item, i) => (
                <Fragment key={item.to}>
                  {i > 0 && <div className="modal_menu_divider" />}
                  <Link hover-link="" data-modal-close="mob" to={item.to} className="link">
                    <div className="link_label">
                      <div className="h2">{item.label}</div>
                    </div>
                    <div className="link_line">
                      <div {...H("line")} className="link_line_fill" />
                    </div>
                  </Link>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="modal_menu_b">
            <div data-modal-p="" className="l1 text-dark">
              ©<span className="year" />.
            </div>
            <div data-modal-p="" className="l1 text-dark">
              Design Fortis.
            </div>
            <div data-modal-p="" className="l1 text-dark">
              All rights reserved
            </div>
            <div className="u-8" />
          </div>
        </div>
      </div>
      <div data-modal-over="" data-modal-close="mob" className="modal_bg" />
    </div>
  );
}

