import { useEffect, useRef } from "react";
import { initFluidCursor } from "./fluid";

/** Full-screen canvas: cream smoke that trails the pointer and wakes the footer wordmark. */
export default function FluidCursor() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    return initFluidCursor(canvas);
  }, []);

  return <canvas ref={ref} data-fluid-cursor="" className="fluid-cur" aria-hidden="true" />;
}
