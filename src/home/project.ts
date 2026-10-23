import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";
import Swiper from "swiper";
import { FreeMode, Mousewheel, Navigation } from "swiper/modules";
import { BREAKPOINT, animateCtn, animateLine, animateTextH, animateTextP, durL, durM, reducedMotion } from "./motion";
import { lockScroll, unlockScroll } from "./runtime";

type Cleanup = () => void;

/**
 * Behaviour specific to a project case study, wired from `data-*` attributes in the
 * markup (the same convention as the home runtime). Run it after `initHomeScripts`.
 */
export function initProjectScripts(root: HTMLElement, lenis: Lenis): Cleanup {
  const cleanups: Cleanup[] = [];
  const mm = gsap.matchMedia();
  const $$ = <T extends HTMLElement = HTMLElement>(sel: string, scope: ParentNode = root) =>
    Array.from(scope.querySelectorAll<T>(sel));
  const on = (el: EventTarget, type: string, fn: EventListener) => {
    el.addEventListener(type, fn);
    cleanups.push(() => el.removeEventListener(type, fn));
  };

  initPins();
  initHoverCards();
  initSliders();
  initCarousel();
  initInsideChapters();
  initTipModals();
  initVideoModal();
  initScrollRefresh();

  return () => {
    cleanups.forEach((fn) => fn());
    mm.revert();
  };

  /** Hotspot buttons: two rings pulse outward and the plus quarter-turns on hover. */
  function initPins() {
    $$("[data-pin]").forEach((pin) => {
      const plus = pin.querySelector<HTMLElement>('[data-ico-plus="v"]');
      const pulses = pin.querySelectorAll<HTMLElement>("[data-pin-pulse]");
      const size = pin.offsetWidth;
      if (pulses.length && !reducedMotion()) {
        gsap.fromTo(
          pulses,
          { opacity: 1, width: size, height: size },
          { opacity: 0, width: size * 2, height: size * 2, duration: durL, ease: "In", stagger: 0.2, repeat: -1 }
        );
      }
      if (!plus) return;
      on(pin, "mouseenter", () => gsap.fromTo(plus, { rotate: 0 }, { rotate: -90, duration: durM, ease: "Out", overwrite: true }));
      on(pin, "mouseleave", () => gsap.to(plus, { rotate: -180, duration: durM, ease: "Out", overwrite: true }));
    });
  }

  /** Cards whose caption writes itself in on hover. */
  function initHoverCards() {
    $$("[hover-card]").forEach((card) => {
      const heads = card.querySelectorAll<HTMLElement>('[hover="h"]');
      const paras = card.querySelectorAll<HTMLElement>('[hover="p"]');
      const lines = card.querySelectorAll<HTMLElement>('[hover="line"]');
      const apply = (mode: "initial" | "reveal" | "hide") => {
        if (heads.length) animateTextH(heads, mode, 0);
        if (paras.length) animateTextP(paras, mode, 0);
        if (lines.length) animateLine(lines, mode, 0);
      };
      apply("initial");
      let timer: number | undefined;
      on(card, "mouseenter", () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => apply("reveal"), 160);
      });
      on(card, "mouseleave", () => {
        window.clearTimeout(timer);
        apply("hide");
      });
      cleanups.push(() => window.clearTimeout(timer));
    });
  }

  /** Stacked pictures that wipe from the right (next) or left (prev) with a counter-zoom. */
  function initSliders() {
    const CLOSED_RIGHT = "inset(0% 0% 0% 100%)";
    const CLOSED_LEFT = "inset(0% 100% 0% 0%)";
    const OPEN = "inset(0% 0% 0% 0%)";

    $$('[data-slider=""]').forEach((wrap) => {
      const slides = $$('[data-slider="slide"]', wrap);
      const images = $$('[data-slider="slide"] [data-slider="img"]', wrap);
      const pag = wrap.querySelector<HTMLElement>('[data-slider="pag"]');
      const prev = wrap.querySelector<HTMLElement>('[data-slider="prev"]');
      const next = wrap.querySelector<HTMLElement>('[data-slider="next"]');
      if (!slides.length || !prev || !next) return;
      if (slides.length === 1) {
        if (pag) pag.style.display = "none";
        return;
      }

      let current = 0;
      let animating = false;
      gsap.set(slides, { clipPath: CLOSED_LEFT });
      gsap.set(slides[0], { clipPath: OPEN });

      const go = (to: number, forward: boolean) => {
        if (animating) return;
        animating = true;
        const from = current;
        current = to;
        slides[from].style.zIndex = "1";
        slides[to].style.zIndex = "2";
        gsap.fromTo(images[from], { scale: 1 }, { scale: 1.5, duration: durL, ease: "Ease" });
        gsap
          .timeline()
          .fromTo(
            slides[to],
            { clipPath: forward ? CLOSED_RIGHT : CLOSED_LEFT },
            {
              clipPath: OPEN,
              duration: durL,
              ease: "Ease",
              onComplete: () => {
                slides[from].style.zIndex = "auto";
                slides[to].style.zIndex = "1";
                animating = false;
              },
            }
          )
          .fromTo(images[to], { scale: 1.5 }, { scale: 1, duration: durL, ease: "Ease" }, "<");
      };
      on(prev, "click", () => go(current === 0 ? slides.length - 1 : current - 1, false));
      on(next, "click", () => go(current === slides.length - 1 ? 0 : current + 1, true));
    });
  }

  /** Construction progress: a draggable, momentum-scrolling strip with a progress hairline. */
  function initCarousel() {
    $$("[data-carousel]").forEach((wrap) => {
      const el = wrap.querySelector<HTMLElement>(".swiper");
      if (!el) return;
      const progress = wrap.querySelector<HTMLElement>('[data-slider="progress"]');
      const current = wrap.querySelector<HTMLElement>('[data-slider="current"]');
      const total = wrap.querySelector<HTMLElement>('[data-slider="total"]');
      const swiper = new Swiper(el, {
        modules: [FreeMode, Mousewheel, Navigation],
        direction: "horizontal",
        slidesPerView: "auto",
        grabCursor: true,
        speed: 800,
        a11y: { enabled: false },
        freeMode: { enabled: true, momentum: true, momentumRatio: 1, momentumBounce: true, momentumBounceRatio: 1, sticky: false },
        mousewheel: { forceToAxis: true },
        navigation: {
          nextEl: wrap.querySelector<HTMLElement>('[data-slider="next"]'),
          prevEl: wrap.querySelector<HTMLElement>('[data-slider="prev"]'),
        },
        on: {
          progress: (_s, value) => {
            if (progress) progress.style.width = `${value * 100}%`;
          },
          slideChange: (s) => {
            if (current) current.textContent = String(s.realIndex + 1);
          },
          afterInit: (s) => {
            if (current) current.textContent = "1";
            if (total) total.textContent = String(s.slides.length);
          },
        },
      });
      cleanups.push(() => swiper.destroy(true, true));
    });
  }

  /**
   * "What's Inside": a sticky stage while tall title rows scroll past. Whichever title
   * crosses the centre of the screen swaps in its own note and picture set.
   */
  function initInsideChapters() {
    const wrap = root.querySelector<HTMLElement>(".inside-w");
    if (!wrap) return;
    const notes = $$(".inside-desc-cms_list_item", wrap);
    const pictures = $$(".inside-img-cms_list_item", wrap);
    const titles = $$(".inside-title-cms_list_item", wrap);
    if (!notes.length) return;

    let shown = -1;
    const show = (index: number) => {
      if (index === shown) return;
      shown = index;
      notes.forEach((note, i) => gsap.set(note, { display: i === index ? "block" : "none" }));
      animateTextP(notes[index].querySelectorAll<HTMLElement>('[data-card="p"]'), "reveal");
      animateCtn(notes[index].querySelectorAll<HTMLElement>('[data-card="ctn"]'), "reveal");
      pictures.forEach((picture, i) => gsap.set(picture, { zIndex: i === index ? 1 : 0 }));
      gsap.fromTo(pictures[index], { scale: 1.25, translateZ: 10 }, { scale: 1, translateZ: 10, duration: durL, ease: "Out" });
    };

    gsap.set(notes, { display: "none" });
    show(0);
    titles.forEach((title, index) => {
      ScrollTrigger.create({
        trigger: title,
        start: "top center",
        end: "bottom center",
        onEnter: () => show(index),
        onEnterBack: () => show(index),
      });
    });
  }

  /** Touch screens have no cursor card, so a tap on a pin raises its note as a bottom sheet. */
  function initTipModals() {
    mm.add(`(max-width: ${BREAKPOINT - 1}px)`, () => {
      const unbind: Cleanup[] = [];
      $$("[data-modal-tip-btn]").forEach((pin) => {
        const modal = root.querySelector<HTMLElement>(`[data-modal-tip="${pin.dataset.modalTipBtn}"]`);
        if (!modal) return;
        const sheet = modal.querySelector<HTMLElement>("[data-modal-container]")!;
        const over = modal.querySelector<HTMLElement>("[data-modal-over]")!;
        const closers = modal.querySelectorAll<HTMLElement>("[data-modal-close]");
        let open = false;
        gsap.set(modal, { display: "none" });

        const show = () => {
          gsap.set([modal, over], { display: "block" });
          gsap.fromTo(sheet, { yPercent: 125 }, { yPercent: 0, duration: durL, ease: "Out", overwrite: true });
          gsap.fromTo(over, { opacity: 0 }, { opacity: 1, duration: durL, ease: "Out", overwrite: true });
          lockScroll(lenis);
        };
        const hide = () => {
          gsap.to(sheet, {
            yPercent: 125,
            duration: durM,
            ease: "In",
            overwrite: true,
            onComplete: () => {
              gsap.set([modal, over], { display: "none" });
            },
          });
          gsap.to(over, { opacity: 0, duration: durM, ease: "In", overwrite: true });
          unlockScroll(lenis);
        };
        const onOpen = () => {
          if (open) return;
          show();
          open = true;
        };
        const onClose = () => {
          if (!open) return;
          hide();
          open = false;
        };
        pin.addEventListener("click", onOpen);
        closers.forEach((c) => c.addEventListener("click", onClose));
        unbind.push(() => {
          pin.removeEventListener("click", onOpen);
          closers.forEach((c) => c.removeEventListener("click", onClose));
          if (open) unlockScroll(lenis);
          gsap.set(modal, { clearProps: "display" });
        });
      });
      return () => unbind.forEach((fn) => fn());
    });
  }

  /** "Play reel": the preview loop opens full screen with sound. */
  function initVideoModal() {
    const modal = root.querySelector<HTMLElement>("[data-modal-video]");
    if (!modal) return;
    const video = modal.querySelector<HTMLVideoElement>("[data-modal-video-el]");
    const closers = modal.querySelectorAll<HTMLElement>("[data-modal-close]");
    if (!video) return;
    let open = false;
    gsap.set(modal, { display: "none" });

    const show = (src: string) => {
      gsap.set(modal, { display: "block" });
      video.src = src;
      video.muted = false;
      video.controls = false;
      video.volume = 0.5;
      video.currentTime = 0;
      video.play().catch(() => {});
      gsap.fromTo(video, { scale: 1.25 }, { scale: 1, duration: durL, ease: "Out", overwrite: true });
      lockScroll(lenis);
    };
    const hide = () => {
      gsap.set(modal, { display: "none" });
      video.pause();
      video.removeAttribute("src");
      video.load();
      unlockScroll(lenis);
    };
    const close = () => {
      if (!open) return;
      hide();
      open = false;
    };

    $$("[data-modal-video-btn]").forEach((btn) =>
      on(btn, "click", () => {
        if (open) return;
        show(btn.dataset.modalVideoBtn!);
        open = true;
      })
    );
    closers.forEach((c) => on(c, "click", close));
    on(document, "keydown", ((e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    }) as EventListener);
    cleanups.push(() => {
      if (open) unlockScroll(lenis);
    });
  }

  /** Sticky sections measure late (fonts, images); re-measure when their anchor scrolls into view. */
  function initScrollRefresh() {
    const anchors = $$('[data-scroll-trigger="refresh"]');
    if (!anchors.length) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) ScrollTrigger.refresh();
    });
    anchors.forEach((a) => observer.observe(a));
    cleanups.push(() => observer.disconnect());
  }
}
