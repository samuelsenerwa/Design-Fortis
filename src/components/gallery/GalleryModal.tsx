import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import "../../home/home.css";
import { bindMagnetic, bindNavItemHover } from "../../home/hover";
import { BREAKPOINT, durL, durM, durS, reducedMotion, registerEases } from "../../home/motion";
import { Label } from "../../home/parts";

registerEases();

export interface GallerySlide {
  src: string;
  alt?: string;
}

interface GalleryModalProps {
  open: boolean;
  /** Slide to start on when `open` becomes true. */
  index: number;
  slides: GallerySlide[];
  /** Shown bottom-left of the pagination bar (e.g. the project name). */
  title: string;
  onClose: () => void;
}

interface GalleryApi {
  show: (index: number) => void;
  hide: () => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Full-screen gallery viewer.
 *
 * Behaviour, in order of appearance:
 *  - the dark sheet fades in while the picture scales up from 0.5
 *  - prev/next (buttons, ← →, swipe) slide the picture off one side and the
 *    next in from the other, while a hairline progress bar fills
 *  - clicking the picture zooms it to the width of the window, hides the
 *    controls, and lets the pointer's height pan the picture vertically; a
 *    circular label trails the cursor and reads "Zoom in" / "Zoom out"
 *  - Esc or the round close button fades it away
 *
 * Imperative on purpose: the picture, counter and progress bar are driven by
 * GSAP on refs, so React renders the (static) markup once and never re-renders
 * through an animation.
 */
export default function GalleryModal({ open, index, slides, title, onClose }: GalleryModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLDivElement>(null);
  const pagRef = useRef<HTMLDivElement>(null);
  const gradRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const slidesRef = useRef(slides);
  const onCloseRef = useRef(onClose);
  const apiRef = useRef<GalleryApi | null>(null);

  useEffect(() => {
    slidesRef.current = slides;
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const modal = modalRef.current;
    const img = imgRef.current;
    const progress = progressRef.current;
    const currentEl = currentRef.current;
    const totalEl = totalRef.current;
    const closeBtn = closeRef.current;
    const pag = pagRef.current;
    const grad = gradRef.current;
    const tip = tipRef.current;
    if (!modal || !img || !progress || !currentEl || !totalEl || !closeBtn || !pag || !grad || !tip) return;

    const tipLabel = tip.querySelector<HTMLElement>(".l1");
    const reduced = reducedMotion();
    const t = (seconds: number) => (reduced ? 0.001 : seconds);
    const desktop = () => window.innerWidth >= BREAKPOINT;
    const total = () => slidesRef.current.length;

    let cur = 0;
    let isOpen = false;
    let busy = false;
    let zoomed = false;
    let maxPan = 0;
    let pan = 0;
    let panTarget = 0;
    const mouse = { x: 0, y: 0 };

    // ── picture + counter ──────────────────────────────────────────────────
    const preload = (i: number) => {
      const list = slidesRef.current;
      if (!list.length) return;
      const s = list[(i + list.length) % list.length];
      const probe = new Image();
      probe.src = s.src;
    };
    const setSlide = (i: number) => {
      const s = slidesRef.current[i];
      if (!s) return;
      img.src = s.src;
      img.alt = s.alt ?? "";
      preload(i + 1);
      preload(i - 1);
    };
    const updatePag = () => {
      currentEl.textContent = pad(cur + 1);
      totalEl.textContent = pad(total());
      gsap.to(progress, { width: `${((cur + 1) / Math.max(1, total())) * 100}%`, duration: t(durS), ease: "Out" });
    };

    // ── zoom ────────────────────────────────────────────────────────────────
    const tick = () => {
      pan += 0.08 * (panTarget - pan);
      gsap.set(img, { y: pan });
    };
    const zoomIn = () => {
      zoomed = true;
      const k = window.innerWidth / img.offsetWidth;
      const scaledHeight = img.offsetHeight * k;
      maxPan = Math.max(0, (scaledHeight - window.innerHeight) / 2);
      pan = 0;
      panTarget = 0;
      gsap.to(img, { scale: k, duration: t(durM), ease: "Out" });
      gsap.ticker.add(tick);
      gsap.to([pag, grad], { yPercent: 100, duration: t(durM), ease: "Out" });
      gsap.to(closeBtn, { xPercent: 100, duration: t(durM), ease: "Out" });
      if (tipLabel) tipLabel.textContent = "Zoom out";
      img.style.cursor = "zoom-out";
    };
    const zoomOut = (instant = false) => {
      zoomed = false;
      gsap.ticker.remove(tick);
      panTarget = 0;
      const d = instant ? 0.001 : t(durM);
      gsap.to(img, { scale: 1, y: 0, duration: d, ease: "Out" });
      gsap.to([pag, grad], { yPercent: 0, duration: d, ease: "Out" });
      gsap.to(closeBtn, { xPercent: 0, duration: d, ease: "Out" });
      if (tipLabel) tipLabel.textContent = "Zoom in";
      img.style.cursor = "zoom-in";
    };
    const onImageClick = () => (zoomed ? zoomOut() : zoomIn());
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!zoomed || maxPan <= 0) return;
      panTarget = maxPan * (1 - 2 * (e.clientY / window.innerHeight));
    };

    // ── navigation ──────────────────────────────────────────────────────────
    const go = (dir: 1 | -1) => {
      if (!isOpen || busy || total() < 2) return;
      busy = true;
      if (zoomed) zoomOut();
      const out = dir === 1 ? -125 : 125;
      const from = dir === 1 ? 125 : -125;
      gsap.to(img, {
        xPercent: out,
        duration: t(durS),
        ease: "In",
        onComplete: () => {
          cur = (cur + dir + total()) % total();
          setSlide(cur);
          updatePag();
          const slideIn = () =>
            gsap.fromTo(
              img,
              { xPercent: from },
              {
                xPercent: 0,
                duration: t(durM),
                ease: "Out",
                onComplete: () => {
                  busy = false;
                },
              }
            );
          // Don't slide an unloaded picture in as an empty frame.
          img.decode().then(slideIn, slideIn);
        },
      });
    };

    // ── open / close ────────────────────────────────────────────────────────
    const wheelBlock = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const lock = () => {
      document.documentElement.style.overflow = "hidden";
      modal.addEventListener("wheel", wheelBlock, { passive: false });
    };
    const unlock = () => {
      document.documentElement.style.overflow = "";
      modal.removeEventListener("wheel", wheelBlock);
    };

    // ── floating "Zoom in/out" circle ───────────────────────────────────────
    const MARGIN = 8;
    const clampTip = (x: number, y: number) => {
      const r = tip.getBoundingClientRect();
      const ox = r.left - (parseFloat(String(gsap.getProperty(tip, "--x"))) || 0);
      const oy = r.top - (parseFloat(String(gsap.getProperty(tip, "--y"))) || 0);
      return {
        "--x": `${gsap.utils.clamp(MARGIN - ox, window.innerWidth - r.width - MARGIN - ox, x)}px`,
        "--y": `${gsap.utils.clamp(MARGIN - oy, window.innerHeight - r.height - MARGIN - oy, y)}px`,
      };
    };
    const tipActive = () => tip.classList.contains("is-active");
    const showTip = (x: number, y: number) => {
      if (!desktop()) return;
      gsap.set(tip, clampTip(x, y));
      tip.classList.add("is-active");
    };
    const hideTip = () => tip.classList.remove("is-active");
    const onTipMove = (e: MouseEvent) => {
      if (!tipActive()) return;
      gsap.to(tip, { ...clampTip(e.clientX, e.clientY), duration: durL * 2, ease: "power3" });
    };
    const onImgEnter = (e: MouseEvent) => showTip(e.clientX, e.clientY);

    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") hide();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    let touchX = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchX = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = touchX - e.changedTouches[0].clientX;
      if (Math.abs(dx) >= 50) go(dx > 0 ? 1 : -1);
    };

    const show = (i: number) => {
      if (!slidesRef.current.length) return;
      cur = Math.min(Math.max(i, 0), total() - 1);
      isOpen = true;
      busy = false;
      if (zoomed) zoomOut(true);
      gsap.set(img, { xPercent: 0 });
      setSlide(cur);
      updatePag();
      gsap.set(modal, { display: "block" });
      gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: t(durM), ease: "Out" });
      gsap.fromTo(img, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: t(durM), ease: "Out" });
      lock();
      // The pointer is usually already over the picture (that's how it was opened).
      if (img.matches(":hover") && mouse.x + mouse.y > 0) showTip(mouse.x, mouse.y);
    };
    const hide = () => {
      if (!isOpen) return;
      isOpen = false;
      hideTip();
      gsap.to(modal, {
        opacity: 0,
        duration: t(durS),
        ease: "In",
        onComplete: () => {
          gsap.set(modal, { display: "none" });
          if (zoomed) zoomOut(true);
        },
      });
      unlock();
      onCloseRef.current();
    };
    apiRef.current = { show, hide };

    // ── wiring ──────────────────────────────────────────────────────────────
    const cleanups: Array<() => void> = [];
    const on = <T extends EventTarget>(el: T, type: string, fn: (e: never) => void, opts?: AddEventListenerOptions) => {
      el.addEventListener(type, fn as EventListener, opts);
      cleanups.push(() => el.removeEventListener(type, fn as EventListener, opts));
    };
    const link = (host: HTMLElement | null) => host?.querySelector<HTMLElement>("a") ?? host;
    const stop = (fn: () => void) => (e: Event) => {
      e.preventDefault();
      fn();
    };

    on(closeBtn, "click", stop(hide));
    const prevLink = link(prevRef.current);
    const nextLink = link(nextRef.current);
    if (prevLink) on(prevLink, "click", stop(() => go(-1)));
    if (nextLink) on(nextLink, "click", stop(() => go(1)));
    on(img, "click", onImageClick);
    on(img, "mouseenter", onImgEnter);
    on(img, "mouseleave", hideTip);
    on(window, "mousemove", onMouseMove);
    on(window, "mousemove", onTipMove);
    on(document, "keydown", onKey);
    on(modal, "touchstart", onTouchStart, { passive: true });
    on(modal, "touchend", onTouchEnd, { passive: true });
    cleanups.push(bindMagnetic(modal), bindNavItemHover(modal));

    gsap.set(modal, { display: "none" });

    return () => {
      cleanups.forEach((fn) => fn());
      gsap.ticker.remove(tick);
      gsap.killTweensOf([modal, img, progress, pag, grad, closeBtn, tip]);
      unlock();
      apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (open) apiRef.current?.show(index);
    else apiRef.current?.hide();
  }, [open, index]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="lv lv-vw">
      <div ref={modalRef} data-lightbox-modal="" className="modal" role="dialog" aria-modal="true" aria-label={`${title} gallery`}>
        <div className="modal_c theme_on-color">
          <div className="modal_gallery">
            <div ref={closeRef} data-slider="close" className="modal_close">
              <div data-magnetic-strength="" className="btn-close">
                <div data-magnetic-inner-target="" className="btn-close_ico">
                  <div className="ico-16 text-dark">
                    <div className="ico">
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="m3.5 3.5 9 9m0-9-9 9" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <a href="#" className="btn-close_link" aria-label="Close gallery" onClick={(e) => e.preventDefault()} />
            </div>

            <div data-lightbox-content="" className="modal_gallery_content">
              <img ref={imgRef} data-lightbox-img="" className="img modal_gallery_img" alt="" />
            </div>

            <div ref={pagRef} className="modal_pag">
              <div className="pag">
                <div className="pag_progress">
                  <div ref={progressRef} data-slider="progress" className="pag_progress_active" />
                </div>
                <div className="u-32" />
                <div className="pag_list">
                  <div className="pag_l">
                    <div className="l1 text-dark">{title}</div>
                  </div>
                  <div className="pag_r">
                    <div className="l1-list">
                      <div ref={currentRef} data-slider="current" className="l1 med text-gray">
                        00
                      </div>
                      <div className="l1 med text-gray">/</div>
                      <div ref={totalRef} data-slider="total" className="l1 med text-gray">
                        00
                      </div>
                    </div>
                    <div className="pag-list">
                      <div ref={prevRef} data-slider="prev" className="pag_prev">
                        <a hover-nav-item="" href="#" className="nav-item">
                          <Label text="Prev" />
                        </a>
                      </div>
                      <div className="l1 med text-gray">/</div>
                      <div ref={nextRef} data-slider="next" className="pag_next">
                        <a hover-nav-item="" href="#" className="nav-item">
                          <Label text="Next" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="u-48" />
            </div>

            <div ref={gradRef} className="img-over-grad x3 bot base-1000" />
          </div>
        </div>
        <div className="modal_bg" />
      </div>

      <div className="floating-tips">
        <div className="floating-tips_list">
          <div ref={tipRef} floating-tip="zoom" className="floating-tip">
            <div className="btn-circle">
              <div className="btn-circle_label">
                <div className="l1 text-dark">Zoom in</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
