import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type Lenis from "lenis";
import {
  BREAKPOINT,
  REVEAL_FNS,
  animateCtn,
  animateImg,
  animateLine,
  animateTextH,
  animateTextP,
  durL,
  durM,
  durS,
  reducedMotion,
  stagger,
} from "./motion";
import { bindMagnetic, bindNavItemHover } from "./hover";

gsap.registerPlugin(ScrollTrigger, SplitText);

type Cleanup = () => void;

/** Locks page scroll (modals, preloader). */
export function lockScroll(lenis: Lenis) {
  const w = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty("--scrollbar-width", `${w}px`);
  document.documentElement.style.overflow = "hidden";
  lenis.stop();
}
export function unlockScroll(lenis: Lenis) {
  document.documentElement.style.removeProperty("--scrollbar-width");
  document.documentElement.style.overflow = "";
  lenis.start();
}

/**
 * Wires every behaviour on the home page from `data-*` / `hover-*` attributes
 * in the markup. Returns a cleanup that removes every listener and trigger.
 */
export function initHomeScripts(
  root: HTMLElement,
  lenis: Lenis,
  /** Hands the pointer-only set-up (hover effects) to the caller to run later, e.g. after a page transition. */
  defer?: (run: () => void) => void
): Cleanup {
  const cleanups: Cleanup[] = [];
  let disposed = false;
  const later = (run: () => void) => {
    if (!defer) return run();
    defer(() => {
      const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
      idle(() => {
        if (!disposed) run();
      });
    });
  };
  const mm = gsap.matchMedia();
  const on = <K extends keyof HTMLElementEventMap>(
    el: HTMLElement | Document | Window,
    type: K | string,
    fn: (e: never) => void,
    opts?: AddEventListenerOptions
  ) => {
    el.addEventListener(type, fn as EventListener, opts);
    cleanups.push(() => el.removeEventListener(type, fn as EventListener, opts));
  };
  const $$ = <T extends HTMLElement = HTMLElement>(sel: string, scope: ParentNode = root) =>
    Array.from(scope.querySelectorAll<T>(sel));

  initCurrentTime();
  initIndexCounter();
  initYear();
  initThemeChange();
  initHideHeader();
  initSnapSections();
  initVideoPlayPause();
  initRevealFirst();
  initScrollReveal();
  initParallax();
  later(() => {
    initMagnetic();
    initNavItemHover();
    initLinkHover();
    initFloatingTips();
  });
  initTabs();
  initStickySlider();
  initAccordion();
  initOurValuesFlow();
  initModals();
  initCookies();
  initAnchors();

  // Everything above measured the layout; let ScrollTrigger settle.
  requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => {
    disposed = true;
    cleanups.forEach((fn) => fn());
    mm.revert();
    ScrollTrigger.getAll().forEach((t) => {
      if (t.trigger && root.contains(t.trigger as Node)) t.kill();
    });
  };

  // ── small utilities ────────────────────────────────────────────────────────
  function initCurrentTime() {
    const el = root.querySelector<HTMLElement>("[data-current-time]");
    if (!el) return;
    const tick = () => {
      el.textContent = new Date().toLocaleTimeString("en-GB", {
        timeZone: "Africa/Nairobi",
        hour: "2-digit",
        minute: "2-digit",
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    cleanups.push(() => window.clearInterval(id));
  }

  function initIndexCounter() {
    $$("[data-index]").forEach((list) => {
      list.querySelectorAll('[data-index="text"]').forEach((el, i) => {
        el.textContent = `${i + 1}.0`;
      });
    });
  }

  function initYear() {
    $$(".year").forEach((el) => (el.textContent = String(new Date().getFullYear())));
  }

  /** Header flips light/dark/color as each section passes underneath it. */
  function initThemeChange() {
    const targets = $$("[data-theme]");
    if (!targets.length) return;
    const flip = (section: HTMLElement, add: string, remove: string[]) => {
      if (getComputedStyle(section).display === "none") return;
      targets.forEach((t) => {
        const center = t.offsetTop + t.offsetHeight / 2;
        ScrollTrigger.create({
          trigger: section,
          start: () => `top top+=${center}`,
          end: () => `bottom top+=${center}`,
          onEnter: () => {
            t.classList.add(add);
            t.classList.remove(...remove);
          },
          onEnterBack: () => {
            t.classList.add(add);
            t.classList.remove(...remove);
          },
        });
      });
    };
    $$('[data-bg="color"]').forEach((s) => flip(s, "theme_on-color", ["theme_on-light", "theme_on-dark"]));
    $$('[data-bg="light"]').forEach((s) => flip(s, "theme_on-light", ["theme_on-dark", "theme_on-color"]));
    $$('[data-bg="dark"]').forEach((s) => flip(s, "theme_on-dark", ["theme_on-light", "theme_on-color"]));
  }

  /** Header slides away while scrolling down, returns on any upward scroll. */
  function initHideHeader() {
    const header = root.querySelector<HTMLElement>("[data-header]");
    if (!header) return;
    let last = 0;
    let upFrom: number | null = null;
    const handler = ({ scroll, limit }: { scroll: number; limit: number }) => {
      const dir = scroll > last ? "down" : "up";
      if (dir === "up") {
        if (upFrom === null) upFrom = last;
      } else upFrom = null;
      last = scroll;
      if (scroll >= limit - 10 || (upFrom !== null && upFrom - scroll >= 40)) {
        gsap.to(header, { yPercent: 0, duration: durM, ease: "Out", overwrite: true });
      } else if (dir === "down" && scroll > 100) {
        gsap.to(header, { yPercent: -200, duration: durM, ease: "Out", overwrite: true });
      }
    };
    lenis.on("scroll", handler as never);
    cleanups.push(() => lenis.off("scroll", handler as never));
  }

  /** Desktop: sections flagged `data-snap` settle into place once scrolling stops. */
  function initSnapSections() {
    mm.add(`(min-width: ${BREAKPOINT}px)`, () => {
      const sections = $$("[data-snap]");
      if (!sections.length) return;
      let timer: number | undefined;
      const handler = () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          const vh = window.innerHeight;
          let best: HTMLElement | null = null;
          let bestRatio = 0;
          sections.forEach((s) => {
            const r = s.getBoundingClientRect();
            const ratio = (Math.min(r.bottom, vh) - Math.max(r.top, 0)) / Math.min(s.offsetHeight, vh);
            if (ratio > 0.5 && ratio > bestRatio) {
              bestRatio = ratio;
              best = s;
            }
          });
          if (best) lenis.scrollTo(best, { duration: durL, easing: gsap.parseEase("Ease") as never });
        }, 40);
      };
      lenis.on("scroll", handler);
      return () => {
        window.clearTimeout(timer);
        lenis.off("scroll", handler);
      };
    });
  }

  function initVideoPlayPause() {
    $$("[data-video-playpause]").forEach((wrap) => {
      const video = wrap.querySelector<HTMLVideoElement>("video");
      if (!video) return;
      ScrollTrigger.create({
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => video.play().catch(() => {}),
        onEnterBack: () => video.play().catch(() => {}),
        onLeave: () => video.pause(),
        onLeaveBack: () => video.pause(),
      });
    });
  }

  /** In a tab group only the first panel animates its own reveal. */
  function initRevealFirst() {
    const groups = new Map<Element, HTMLElement[]>();
    $$("[data-reveal-first]").forEach((el) => {
      const p = el.parentElement!;
      groups.set(p, [...(groups.get(p) ?? []), el]);
    });
    groups.forEach((items) =>
      items.slice(1).forEach((item) =>
        item.querySelectorAll("[data-scroll-reveal]").forEach((n) => n.removeAttribute("data-scroll-reveal"))
      )
    );
  }

  /** `data-scroll-reveal="h|p|ctn|line|slide"` plays once when it nears the viewport. */
  function initScrollReveal() {
    (Object.keys(REVEAL_FNS) as (keyof typeof REVEAL_FNS)[]).forEach((key) => {
      const els = $$(`[data-scroll-reveal="${key}"]`);
      if (!els.length) return;
      const groups = new Map<HTMLElement, HTMLElement[]>();
      els.forEach((el) => {
        const trigger = el.closest<HTMLElement>('[data-scroll-reveal="w"]') ?? el;
        groups.set(trigger, [...(groups.get(trigger) ?? []), el]);
      });
      groups.forEach((items, trigger) => {
        gsap.set(items, { visibility: "visible" });
        ScrollTrigger.create({
          trigger,
          start: "top bottom",
          once: true,
          onEnter: () => REVEAL_FNS[key](items, "reveal", 0.2),
        });
        REVEAL_FNS[key](items, "initial");
      });
    });

    // Cards slide up a little as they arrive.
    $$('[data-scroll-reveal="card"]').forEach((el) => {
      gsap.fromTo(
        el,
        { yPercent: 35 },
        { yPercent: 0, duration: durL, ease: "Out", scrollTrigger: { trigger: el, start: "top bottom" } }
      );
    });

    // Title underline that grows in from nothing.
    const offset = root.querySelector<HTMLElement>(".mission-s_title_offset");
    if (offset && !reducedMotion()) {
      gsap.from(offset, {
        width: 0,
        ease: "InOut",
        duration: durL,
        delay: 0.3,
        scrollTrigger: { trigger: offset, start: "top bottom" },
      });
    }
  }

  function initParallax() {
    const small = window.innerWidth < BREAKPOINT;
    const allowed = (wrap: HTMLElement | null) => {
      if (!wrap || reducedMotion()) return false;
      if (small && wrap.dataset.mob === "off") return false;
      if (!small && wrap.dataset.desk === "off") return false;
      return true;
    };
    $$('[data-parallax="img"]').forEach((el) => {
      const wrap = el.closest<HTMLElement>('[data-parallax="w"]');
      if (!allowed(wrap)) return;
      gsap.fromTo(
        el,
        { yPercent: -15, translateZ: 10 },
        {
          yPercent: 15,
          translateZ: 10,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: wrap!, start: "top bottom", scrub: true },
        }
      );
    });
    $$("[data-parallax-img-in]").forEach((el) => {
      const wrap = el.closest<HTMLElement>('[data-parallax="w"]');
      if (!allowed(wrap)) return;
      gsap.fromTo(
        el,
        { yPercent: -15, translateZ: 10 },
        {
          yPercent: 0,
          translateZ: 10,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: wrap!, start: "top bottom", end: "top top", scrub: true },
        }
      );
    });
    $$("[data-parallax-img-out]").forEach((el) => {
      const wrap = el.closest<HTMLElement>('[data-parallax="w"]');
      if (!allowed(wrap)) return;
      gsap.fromTo(
        el,
        { yPercent: 0, translateZ: 10 },
        {
          yPercent: 15,
          translateZ: 10,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: wrap!, start: "bottom bottom", end: "bottom top", scrub: true },
        }
      );
    });
    const strength = window.innerWidth >= BREAKPOINT ? 50 : 30;
    if (!reducedMotion()) {
      $$("[data-parallax-s-out]").forEach((el) => {
        gsap.to(el, {
          opacity: 0.3,
          yPercent: strength,
          translateZ: 10,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
      });
      // The footer content is revealed from behind as it scrolls in.
      mm.add(`(min-width: ${BREAKPOINT}px)`, () => {
        const footer = root.querySelector<HTMLElement>(".footer-w");
        const main = footer?.querySelector<HTMLElement>(".footer-s_main");
        if (!footer || !main) return;
        gsap.fromTo(
          main,
          { yPercent: -50, translateZ: 10 },
          {
            yPercent: 0,
            translateZ: 10,
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: footer, start: "top bottom", end: "bottom bottom", scrub: true },
          }
        );
      });
    }
  }

  /** Close button follows the pointer with an elastic return. */
  function initMagnetic() {
    mm.add(`(min-width: ${BREAKPOINT}px)`, () => bindMagnetic(root));
  }

  /** Nav labels: characters roll up and out while a twin rolls in beneath. */
  function initNavItemHover() {
    mm.add(`(min-width: ${BREAKPOINT}px)`, () => bindNavItemHover(root));
  }

  /** Footer links draw an underline on hover. */
  function initLinkHover() {
    mm.add(`(min-width: ${BREAKPOINT}px)`, () => {
      const bound: Array<[HTMLElement, EventListener, EventListener]> = [];
      $$("[hover-link]").forEach((link) => {
        const line = link.querySelector<HTMLElement>("[hover='line']");
        if (!line) return;
        gsap.set(line, { xPercent: -101, yPercent: -100 });
        const enter = () => gsap.fromTo(line, { xPercent: -101 }, { xPercent: 0, duration: durL, ease: "Out", overwrite: true });
        const leave = () => gsap.to(line, { xPercent: 101, duration: durL, ease: "Out", overwrite: true });
        const trigger = link.closest<HTMLElement>("[hover-link-item-trigger]") ?? link;
        trigger.addEventListener("mouseenter", enter);
        trigger.addEventListener("mouseleave", leave);
        bound.push([trigger, enter, leave]);
      });
      return () =>
        bound.forEach(([t, enter, leave]) => {
          t.removeEventListener("mouseenter", enter);
          t.removeEventListener("mouseleave", leave);
        });
    });
  }

  /** Services: numbered tabs cross-fade between panels with wipe/rise transitions. */
  function initTabs() {
    $$("[data-tabs]").forEach((wrap) => {
      const triggers = Array.from(wrap.querySelectorAll<HTMLElement>("[data-tab-trigger]"));
      const contents = Array.from(wrap.querySelectorAll<HTMLElement>("[data-tab-content]"));
      if (!triggers.length || !contents.length) return;
      let current = 0;
      let busy = false;
      triggers[0].classList.add("is-active");
      contents[0].classList.add("is-active");

      const parts = (panel: HTMLElement) => ({
        h: panel.querySelectorAll('[data-tab="h"]'),
        p: panel.querySelectorAll('[data-tab="p"]'),
        ctn: panel.querySelectorAll('[data-tab="ctn"]'),
        slide: panel.querySelectorAll('[data-tab="slide"]'),
      });

      triggers.forEach((trigger, index) => {
        const handler = () => {
          if (index === current || busy) return;
          const outPanel = wrap.querySelector<HTMLElement>(
            `[data-tab-content="${triggers[current].getAttribute("data-tab-trigger")}"]`
          )!;
          const inPanel = wrap.querySelector<HTMLElement>(
            `[data-tab-content="${trigger.getAttribute("data-tab-trigger")}"]`
          )!;
          const o = parts(outPanel);
          const n = parts(inPanel);
          gsap.killTweensOf([outPanel, inPanel]);
          busy = true;
          gsap.set(inPanel, { display: "block", position: "relative", zIndex: 1 });
          gsap.set(outPanel, { display: "block", position: "absolute", zIndex: 0 });
          animateTextH(n.h, "initial");
          animateTextP(n.p, "initial");
          animateCtn(n.ctn, "initial");
          animateImg(n.slide, "initial");
          ScrollTrigger.refresh();
          gsap
            .timeline({
            onComplete: () => {
              busy = false;
            },
          })
            .add(() => {
              animateTextH(o.h, "hide", 0);
              animateTextP(o.p, "hide", 0);
              animateCtn(o.ctn, "hide", 0);
              animateImg(o.slide, "hide", 0);
              animateImg(n.slide, "reveal", 0);
            })
            .to({}, { duration: durM })
            .add(() => {
              animateTextH(n.h, "reveal", 0);
              animateTextP(n.p, "reveal", 0);
              animateCtn(n.ctn, "reveal", 0);
            })
            .to({}, { duration: durS })
            .set(outPanel, { display: "none" });
          triggers[current].classList.remove("is-active");
          trigger.classList.add("is-active");
          current = index;
        };
        on(trigger, "click", handler);
      });
    });
  }

  /**
   * About: a tall section pins a stage while the page scrolls through phantom
   * triggers; each trigger swaps the visible slide and slides the name list so
   * the active name sits at the top of its column.
   */
  function initStickySlider() {
    mm.add(`(min-width: ${BREAKPOINT}px)`, () => {
      $$("[data-sticky-slider]").forEach((wrap) => {
        const slides = $$("[data-sticky-slide]", wrap);
        const triggers = $$("[data-sticky-trigger]", wrap);
        const names = $$("[data-sticky-name]", wrap);
        const list = wrap.querySelector<HTMLElement>("[data-sticky-names]");
        if (!slides.length || !list) return;

        const parts = {
          slide: animateImg,
          h: animateTextH,
          p: animateTextP,
          line: animateLine,
          ctn: animateCtn,
        } as const;
        const run = (el: HTMLElement, mode: "initial" | "reveal" | "hide", delay?: number, dir?: "next" | "prev") => {
          const fn = parts[el.dataset.el as keyof typeof parts];
          if (fn === animateImg) animateImg(el, mode, delay, dir);
          else fn?.(el, mode, delay);
        };

        let current = 0;
        let z = slides.length;

        const slideNames = (index: number) => {
          const offset = names[index].offsetTop - names[0].offsetTop;
          names.forEach((n) => n.classList.remove("is-active"));
          names[index].classList.add("is-active");
          gsap.to(list, { y: -offset, duration: durM, ease: "Out" });
        };
        const show = (slide: HTMLElement, dir: "next" | "prev") => {
          const els = $$<HTMLElement>("[data-el]", slide);
          (slide as HTMLElement & { _hide?: gsap.core.Tween })._hide?.kill();
          gsap.set(slide, { display: "block", zIndex: ++z });
          gsap.set(els, { clearProps: "opacity", overwrite: true });
          els.forEach((el, i) => run(el, "reveal", i * stagger, dir));
          return els.length * stagger + durL;
        };
        const go = (index: number) => {
          if (index === current) return;
          const out = slides[current];
          const inn = slides[index];
          const fading = $$<HTMLElement>('[data-el]:not([data-el="slide"])', out);
          const dir = index > current ? "next" : "prev";
          current = index;
          gsap.to(fading, { opacity: 0, duration: 0.2, ease: "Out" });
          const wait = show(inn, dir);
          slideNames(index);
          (out as HTMLElement & { _hide?: gsap.core.Tween })._hide = gsap.delayedCall(wait, () => {
            gsap.set(out, { display: "none" });
          });
        };

        slides.slice(1).forEach((slide) => $$<HTMLElement>("[data-el]", slide).forEach((el) => run(el, "initial")));
        gsap.set(slides.slice(1), { display: "none" });
        slideNames(0);

        triggers.forEach((trigger, index) => {
          ScrollTrigger.create({
            trigger,
            start: "top center",
            end: "bottom center",
            onEnter: () => go(index),
            onEnterBack: () => go(index),
          });
        });
        names.forEach((name, index) => {
          const click = () =>
            lenis.scrollTo(triggers[index], { offset: -window.innerHeight / 2 + triggers[index].offsetHeight / 2 });
          name.addEventListener("click", click);
          cleanups.push(() => name.removeEventListener("click", click));
        });
      });
    });
  }

  /** Mobile twin of the sticky slider: one card open at a time. */
  function initAccordion() {
    let open: (HTMLElement & { closeFunc?: () => void }) | null = null;
    $$('[data-accordion-card=""]').forEach((card: HTMLElement & { closeFunc?: () => void }) => {
      const content = card.querySelector<HTMLElement>('[data-accordion-card="content"]');
      const plus = card.querySelector<HTMLElement>('[data-ico-plus="v"]');
      const text = card.querySelectorAll('[data-accordion-card="p"]');
      const img = card.querySelectorAll('[data-accordion-card="img"]');
      if (!content) return;
      gsap.set(content, { height: 0, overflow: "hidden" });
      const expand = () => {
        gsap.to(content, { height: "auto", duration: durL, ease: "Out", onComplete: () => ScrollTrigger.refresh() });
        gsap.fromTo(plus, { rotate: 0 }, { rotate: -90, duration: durM, ease: "InOut", overwrite: true });
        animateTextP(text as never, "reveal");
        animateImg(img as never, "reveal");
      };
      const collapse = () => {
        gsap.to(content, { height: 0, duration: durL, ease: "Out", onComplete: () => ScrollTrigger.refresh(), overwrite: true });
        gsap.to(plus, { rotate: -180, duration: durM, ease: "InOut", overwrite: true });
        animateTextP(text as never, "hide");
        animateImg(img as never, "hide");
      };
      const toggle = () => {
        if (open && open !== card) open.closeFunc?.();
        if (open !== card) {
          expand();
          open = card;
        } else {
          collapse();
          open = null;
        }
      };
      on(card, "click", toggle);
      card.closeFunc = collapse;
    });
  }

  /** About: the sticky stage's strapline fades once the list takes over; a rule draws down as you scroll. */
  function initOurValuesFlow() {
    mm.add(`(min-width: ${BREAKPOINT}px)`, () => {
      const wrap = root.querySelector<HTMLElement>(".our-values-w");
      if (!wrap) return;
      const desc = wrap.querySelectorAll<HTMLElement>(".our-values-s_desc p");
      ScrollTrigger.create({
        trigger: wrap,
        start: "20% top",
        onEnter: () => animateTextP(desc, "hide"),
        onLeaveBack: () => animateTextP(desc, "reveal"),
      });
      const progress = wrap.querySelector<HTMLElement>(".our-values-s_progress");
      if (progress) {
        ScrollTrigger.create({
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => progress.style.setProperty("--progress", String(self.progress)),
        });
      }
    });
  }

  /** Circular labels that trail the cursor (e.g. "View project"). */
  function initFloatingTips() {
    mm.add(`(min-width: ${BREAKPOINT}px)`, () => {
      const MARGIN = 8;
      const tips = new Map<string, HTMLElement>();
      const active = new Set<HTMLElement>();
      $$("[floating-tip]").forEach((tip) => tips.set(tip.getAttribute("floating-tip")!, tip));

      const clamped = (el: HTMLElement, x: number, y: number) => {
        const r = el.getBoundingClientRect();
        const ox = r.left - (parseFloat(String(gsap.getProperty(el, "--x"))) || 0);
        const oy = r.top - (parseFloat(String(gsap.getProperty(el, "--y"))) || 0);
        return {
          "--x": `${gsap.utils.clamp(MARGIN - ox, window.innerWidth - r.width - MARGIN - ox, x)}px`,
          "--y": `${gsap.utils.clamp(MARGIN - oy, window.innerHeight - r.height - MARGIN - oy, y)}px`,
        };
      };
      const show = (tip: HTMLElement, x: number, y: number) => {
        gsap.set(tip, clamped(tip, x, y));
        tip.classList.add("is-active");
        active.add(tip);
      };
      const hide = (tip: HTMLElement) => {
        tip.classList.remove("is-active");
        active.delete(tip);
      };

      const move = (e: MouseEvent) => {
        active.forEach((tip) => gsap.to(tip, { ...clamped(tip, e.clientX, e.clientY), duration: durL * 2, ease: "power3" }));
      };
      root.addEventListener("mousemove", move);

      const bound: Array<[HTMLElement, (e: MouseEvent) => void, () => void]> = [];
      $$("[floating-tip-trigger]").forEach((trigger) => {
        const tip = tips.get(trigger.getAttribute("floating-tip-trigger")!);
        if (!tip) return;
        const enter = (e: MouseEvent) => show(tip, e.clientX, e.clientY);
        const leave = () => hide(tip);
        trigger.addEventListener("mouseenter", enter);
        trigger.addEventListener("mouseleave", leave);
        bound.push([trigger, enter, leave]);
      });
      return () => {
        root.removeEventListener("mousemove", move);
        bound.forEach(([t, enter, leave]) => {
          t.removeEventListener("mouseenter", enter as EventListener);
          t.removeEventListener("mouseleave", leave);
        });
        active.forEach(hide);
      };
    });
  }

  /** "Let's talk" slide-in panel and the mobile menu sheet. */
  function initModals() {
    // Contact panel
    $$("[data-modal-cta-btn]").forEach((btn) => {
      const name = btn.getAttribute("data-modal-cta-btn")!;
      const modal = root.querySelector<HTMLElement>(`[data-modal-cta="${name}"]`);
      if (!modal) return;
      const container = modal.querySelector<HTMLElement>("[data-modal-container]")!;
      const over = modal.querySelector<HTMLElement>("[data-modal-over]")!;
      const closers = Array.from(modal.querySelectorAll<HTMLElement>("[data-modal-close]"));
      let open = false;
      gsap.set(modal, { display: "none" });

      const show = () => {
        const small = window.innerWidth < BREAKPOINT;
        gsap.set([modal, over], { display: "block" });
        gsap.fromTo(
          container,
          { xPercent: small ? 0 : 100, yPercent: small ? 100 : 0 },
          { xPercent: 0, yPercent: 0, duration: durL, ease: "Out", overwrite: true }
        );
        gsap.fromTo(over, { opacity: 0 }, { opacity: 1, duration: durL, ease: "Out", overwrite: true });
        lockScroll(lenis);
      };
      const hideModal = () => {
        const small = window.innerWidth < BREAKPOINT;
        gsap.to(container, {
          xPercent: small ? 0 : 100,
          yPercent: small ? 100 : 0,
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
      on(btn, "click", () => {
        if (!open) {
          show();
          open = true;
        }
      });
      closers.forEach((c) =>
        on(c, "click", () => {
          if (open) {
            hideModal();
            open = false;
          }
        })
      );
      on(document, "keydown", ((e: KeyboardEvent) => {
        if (e.key === "Escape" && open) {
          hideModal();
          open = false;
        }
      }) as never);
    });

    // Mobile menu
    $$("[data-modal-menu-btn]").forEach((btn) => {
      const name = btn.getAttribute("data-modal-menu-btn")!;
      const modal = root.querySelector<HTMLElement>(`[data-modal-menu="${name}"]`);
      if (!modal) return;
      const over = modal.querySelector<HTMLElement>("[data-modal-over]")!;
      const list = modal.querySelector<HTMLElement>('[data-modal="list"]')!;
      const items = Array.from(list.children) as HTMLElement[];
      const small = modal.querySelectorAll("[data-modal-p]");
      const labels = btn.querySelectorAll<HTMLElement>(".header_menu_label");
      const themed = $$("[data-theme]");
      let open = false;
      gsap.set(modal, { display: "none" });

      const show = () => {
        gsap.set(modal, { display: "block" });
        themed.forEach((el) => el.classList.add("theme_on-dark"));
        labels.forEach((l) => l.classList.toggle("is-active"));
        gsap.fromTo(over, { opacity: 0 }, { opacity: 1, duration: durM, ease: "Out", overwrite: true });
        animateCtn(items, "reveal");
        animateTextP(small, "reveal");
        lockScroll(lenis);
      };
      const hideMenu = () => {
        themed.forEach((el) => el.classList.remove("theme_on-dark"));
        labels.forEach((l) => l.classList.toggle("is-active"));
        gsap.to(over, {
          opacity: 0,
          duration: durM,
          ease: "In",
          overwrite: true,
          onComplete: () => {
            gsap.set(modal, { display: "none" });
          },
        });
        animateCtn(items, "hide");
        animateTextP(small, "hide");
        unlockScroll(lenis);
      };
      on(btn, "click", () => {
        if (open) hideMenu();
        else show();
        open = !open;
      });
      root.querySelectorAll<HTMLElement>(`[data-modal-close="${name}"]`).forEach((c) =>
        on(c, "click", () => {
          if (open) {
            hideMenu();
            open = false;
          }
        })
      );
      on(document, "keydown", ((e: KeyboardEvent) => {
        if (e.key === "Escape" && open) {
          hideMenu();
          open = false;
        }
      }) as never);
    });
  }

  function initCookies() {
    const el = root.querySelector<HTMLElement>("[data-cookies]");
    if (!el) return;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("df-cookies");
    } catch {
      /* storage blocked */
    }
    if (stored) {
      el.remove();
      return;
    }
    gsap.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: durM, delay: 2.5, ease: "Out" });
    const dismiss = (value: string) => {
      try {
        localStorage.setItem("df-cookies", value);
      } catch {
        /* storage blocked */
      }
      gsap.to(el, { yPercent: 100, duration: durM, ease: "In", onComplete: () => el.remove() });
    };
    el.querySelector('[data-cookies="accept"]')?.addEventListener("click", (e) => {
      e.preventDefault();
      dismiss("accepted");
    });
    el.querySelector('[data-cookies="decline"]')?.addEventListener("click", (e) => {
      e.preventDefault();
      dismiss("declined");
    });
  }

  /** In-page anchors (`#about`, `#hero`) scroll through Lenis. */
  function initAnchors() {
    $$('a[href^="#"]').forEach((a) => {
      const id = a.getAttribute("href")!.slice(1);
      if (!id) return;
      on(a, "click", ((e: MouseEvent) => {
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { duration: durL * 1.5 });
      }) as never);
    });
  }
}
