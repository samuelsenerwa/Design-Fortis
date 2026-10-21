import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

/** One window-level Lenis, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function ensureLenis(): Lenis {
  if (instance) return instance;
  instance = new Lenis({
    wrapper: window,
    duration: 1.2,
    smoothWheel: true,
    syncTouch: true,
    touchMultiplier: 1.5,
    allowNestedScroll: true,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    infinite: false,
  });
  instance.on("scroll", ScrollTrigger.update);
  tick = (time) => instance?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return instance;
}

export function destroyLenis() {
  if (tick) gsap.ticker.remove(tick);
  instance?.destroy();
  instance = null;
  tick = null;
}
