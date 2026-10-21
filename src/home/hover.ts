import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { durM, stagger } from "./motion";

gsap.registerPlugin(SplitText);

type Cleanup = () => void;

/**
 * Elements flagged `data-magnetic-strength` drift toward the pointer and snap
 * back elastically on leave. Inner targets (`data-magnetic-inner-target`) move
 * a little more, for a subtle parallax inside the button.
 */
export function bindMagnetic(scope: ParentNode): Cleanup {
  const settle = (el: HTMLElement, instant: boolean) => {
    gsap.killTweensOf(el);
    (instant ? gsap.set : gsap.to)(el, {
      x: 0,
      y: 0,
      force3D: true,
      clearProps: "all",
      ...(!instant && { ease: "elastic.out(1, 0.3)", duration: 1.6 }),
    });
  };
  const inner = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>("[data-magnetic-inner-target]"));
  const bound: Array<[HTMLElement, EventListener, EventListener, EventListener]> = [];

  scope.querySelectorAll<HTMLElement>("[data-magnetic-strength]").forEach((el) => {
    const enter = () => {
      settle(el, true);
      inner(el).forEach((i) => settle(i, true));
    };
    const move = (e: Event) => {
      const ev = e as MouseEvent;
      const r = el.getBoundingClientRect();
      const s = parseFloat(el.dataset.magneticStrength ?? "") || 25;
      const si = parseFloat(el.dataset.magneticStrengthInner ?? "") || s;
      const fx = (ev.clientX - r.left) / el.offsetWidth - 0.5;
      const fy = (ev.clientY - r.top) / el.offsetHeight - 0.5;
      gsap.to(el, { x: `${fx * (s / 16)}em`, y: `${fy * (s / 16)}em`, force3D: true, ease: "power4.out", duration: 1.6 });
      inner(el).forEach((i) =>
        gsap.to(i, { x: `${fx * (si / 16)}em`, y: `${fy * (si / 16)}em`, force3D: true, ease: "power4.out", duration: 2 })
      );
    };
    const leave = () => {
      settle(el, false);
      inner(el).forEach((i) => settle(i, false));
    };
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    bound.push([el, enter, move, leave]);
  });

  return () =>
    bound.forEach(([el, enter, move, leave]) => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    });
}

/**
 * Nav labels (`[hover-nav-item]` with two `[hover='text']` copies): the
 * characters roll up and out while a twin rolls in beneath.
 */
export function bindNavItemHover(scope: ParentNode): Cleanup {
  const splits: SplitText[] = [];
  const bound: Array<[HTMLElement, EventListener, EventListener]> = [];

  scope.querySelectorAll<HTMLElement>("[hover-nav-item]").forEach((item) => {
    const labels = item.querySelectorAll<HTMLElement>("[hover='text']");
    if (labels.length < 2) return;
    const a = new SplitText(labels[0], { type: "chars", tag: "span", charsClass: "split-char", smartWrap: true });
    const b = new SplitText(labels[1], { type: "chars", tag: "span", charsClass: "split-char", smartWrap: true });
    splits.push(a, b);
    gsap.set(b.chars, { yPercent: 100, opacity: 0 });
    const enter = () => {
      gsap.fromTo(
        a.chars,
        { opacity: 1, yPercent: 0 },
        { opacity: 0, yPercent: -100, duration: durM, ease: "Out", stagger: stagger / 5, overwrite: true, force3D: true }
      );
      gsap.fromTo(
        b.chars,
        { yPercent: 100, opacity: 0 },
        { opacity: 1, yPercent: 0, duration: durM, ease: "Out", stagger: stagger / 5, overwrite: true, force3D: true }
      );
    };
    const leave = () => {
      gsap.to(a.chars, { opacity: 1, yPercent: 0, duration: durM, ease: "Out", stagger: stagger / 5, overwrite: true, force3D: true });
      gsap.to(b.chars, { opacity: 0, yPercent: 100, duration: durM, ease: "Out", stagger: stagger / 5, overwrite: true, force3D: true });
    };
    const trigger = item.closest<HTMLElement>("[hover-nav-item-trigger]") ?? item;
    trigger.addEventListener("mouseenter", enter);
    trigger.addEventListener("mouseleave", leave);
    bound.push([trigger, enter, leave]);
  });

  return () => {
    bound.forEach(([t, enter, leave]) => {
      t.removeEventListener("mouseenter", enter);
      t.removeEventListener("mouseleave", leave);
    });
    splits.forEach((s) => s.revert());
  };
}
