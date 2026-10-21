import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Flip);

/** Shared timing language for the whole page. */
export const durS = 0.4;
export const durM = 0.8;
export const durL = 1.2;
export const stagger = 0.1;
export const delayReveal = 0.3;
export const BREAKPOINT = 992;

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Resolves once the page's web fonts are usable, so SplitText measures real glyphs. */
export function fontsReady(): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return Promise.resolve();
  const loading = Promise.all([
    document.fonts.load('400 1em "Crimson Pro"'),
    document.fonts.load('400 1em "Inter Tight"'),
    document.fonts.ready,
  ]).then(() => undefined);
  // Never let a slow font host hold the intro hostage.
  return Promise.race([loading, new Promise<void>((r) => setTimeout(r, 3000))]);
}

let easesReady = false;
export function registerEases() {
  if (easesReady) return;
  easesReady = true;
  CustomEase.create("InOut", "0.75,0,0.25,1");
  CustomEase.create("Out", "0.25,1,0.5,1");
  CustomEase.create("In", "0.5,0,0.75,0");
  CustomEase.create("Ease", "0.25,0.1,0.25,1");
  CustomEase.create(
    "loaderEase",
    "M0,0,C0,0,0.13,0.34,0.238,0.442,0.305,0.506,0.322,0.514,0.396,0.54,0.478,0.568,0.468,0.56,0.522,0.584,0.572,0.606,0.61,0.719,0.714,0.826,0.79,0.904,0.86,1,1,1"
  );
}
registerEases();

type Mode = "reveal" | "hide" | "initial";
type Els = gsap.TweenTarget;
type SplitEl = HTMLElement & { _split?: SplitText };

const toArray = (els: Els) => gsap.utils.toArray<SplitEl>(els as gsap.TweenTarget);

function split(el: SplitEl) {
  if (!el._split) {
    el._split = new SplitText(el, {
      type: "lines,words",
      tag: "span",
      linesClass: "split-line",
      wordsClass: "split-word",
      mask: "lines",
    });
    el.querySelectorAll(".split-line").forEach((line) => {
      if (line.textContent?.trim() === "") line.replaceWith(document.createElement("br"));
    });
  }
  return el._split;
}

/** Headline: words rise through a line mask. */
export function animateTextH(els: Els, mode: Mode, delay?: number) {
  const list = toArray(els);
  if (!list.length) return;
  const tl = gsap.timeline();
  if (reducedMotion()) return tl;
  list.forEach((el, i) => {
    if (!el.textContent?.trim()) return;
    const s = split(el);
    const offset = i * stagger;
    switch (mode) {
      case "reveal":
        tl.fromTo(
          s.words,
          { yPercent: 135 },
          {
            yPercent: 0,
            duration: durL,
            delay: (delay ?? delayReveal) + offset,
            stagger,
            ease: "Out",
            overwrite: true,
          },
          0
        );
        break;
      case "hide":
        tl.to(
          s.words,
          { yPercent: -135, duration: durS, delay: delay ?? 0, stagger: stagger * 0.25, ease: "In", overwrite: true },
          0
        );
        break;
      case "initial":
        gsap.set(s.words, { yPercent: 135 });
    }
  });
  return tl;
}

/** Paragraph: lines rise through a line mask. */
export function animateTextP(els: Els, mode: Mode, delay?: number) {
  const list = toArray(els);
  if (!list.length) return;
  const tl = gsap.timeline();
  if (reducedMotion()) return tl;
  list.forEach((el, i) => {
    if (!el.textContent?.trim()) return;
    const s = split(el);
    const offset = i * stagger;
    switch (mode) {
      case "reveal":
        tl.fromTo(
          s.lines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: durL,
            delay: (delay ?? delayReveal) + offset,
            stagger,
            ease: "Out",
            overwrite: true,
          },
          0
        );
        break;
      case "hide":
        tl.to(
          s.lines,
          { yPercent: -110, duration: durS, delay: delay ?? 0, stagger: stagger * 0.5, ease: "In", overwrite: true },
          0
        );
        break;
      case "initial":
        gsap.set(s.lines, { yPercent: 110 });
    }
  });
  return tl;
}

/** Container / button: fade up. */
export function animateCtn(els: Els, mode: Mode, delay?: number) {
  const list = gsap.utils.toArray(els);
  if (!list.length || reducedMotion()) return;
  switch (mode) {
    case "reveal":
      return gsap.fromTo(
        list,
        { opacity: 0, y: "3.333rem" },
        { opacity: 1, y: "0rem", duration: durL, delay: delay ?? delayReveal, stagger, ease: "Out", overwrite: true }
      );
    case "hide":
      return gsap.to(list, {
        opacity: 0,
        y: "0rem",
        duration: durS,
        delay: delay ?? 0,
        stagger: stagger * 0.5,
        ease: "In",
        overwrite: true,
      });
    case "initial":
      gsap.set(list, { opacity: 0, y: "3.333rem" });
  }
}

/** Hairline: draws left → right. */
export function animateLine(els: Els, mode: Mode, delay?: number) {
  const list = gsap.utils.toArray(els);
  if (!list.length || reducedMotion()) return;
  switch (mode) {
    case "reveal":
      return gsap.fromTo(
        list,
        { clipPath: "inset(0% 100% -1px 0%)" },
        {
          clipPath: "inset(0% 0% -1px 0%)",
          duration: durL,
          delay: delay ?? delayReveal,
          stagger,
          ease: "Out",
          overwrite: true,
        }
      );
    case "hide":
      return gsap.to(list, {
        clipPath: "inset(0% 0% -1px 100%)",
        duration: durS,
        delay: delay ?? 0,
        stagger: stagger * 0.5,
        ease: "In",
        overwrite: true,
      });
    case "initial":
      gsap.set(list, { clipPath: "inset(0% 0% -1px 100%)" });
  }
}

/** Image: wipes open from the top while the picture settles from 1.5× → 1×. */
export function animateImg(els: Els, mode: Mode, delay?: number, dir: "next" | "prev" = "next") {
  const list = gsap.utils.toArray<HTMLElement>(els);
  if (!list.length || reducedMotion()) return;
  const inners = list.map((el) => el.firstElementChild);
  const [from, to] = {
    next: ["inset(0% 0% 100% 0%)", "inset(100% 0% 0% 0%)"],
    prev: ["inset(100% 0% 0% 0%)", "inset(0% 0% 100% 0%)"],
  }[dir];
  const tl = gsap.timeline({ defaults: { duration: durL, ease: "InOut", overwrite: true } });
  switch (mode) {
    case "reveal":
      tl.delay(delay ?? delayReveal)
        .fromTo(list, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)" })
        .fromTo(inners, { scale: 1.5 }, { scale: 1 }, "<");
      break;
    case "hide":
      tl.delay(delay ?? 0)
        .to(list, { clipPath: to })
        .to(inners, { scale: 1.5 }, "<");
      break;
    case "initial":
      gsap.set(list, { clipPath: from });
      gsap.set(inners, { scale: 1.5 });
  }
  return tl;
}

export const REVEAL_FNS = {
  h: animateTextH,
  p: animateTextP,
  ctn: animateCtn,
  line: animateLine,
  slide: animateImg,
} as const;

/** Plays the "hide" version of everything currently in view. */
export function animateVisibleElements(root: ParentNode, mode: Mode) {
  (Object.keys(REVEAL_FNS) as (keyof typeof REVEAL_FNS)[]).forEach((key) => {
    root.querySelectorAll(`[data-scroll-reveal="${key}"], [data-el="${key}"]`).forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) REVEAL_FNS[key](el as HTMLElement, mode, 0);
    });
  });
}
