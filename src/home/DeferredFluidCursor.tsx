import { Suspense, lazy, useEffect, useState } from "react";
import { isTransitioning, onTransitionSettled } from "./pageTransition";

// three.js is only needed for the pointer trail and the footer wordmark, so keep it out of the first load.
const FluidCursor = lazy(() => import("./FluidCursor"));

/**
 * Mounts the WebGL pointer trail (which also lights the footer wordmark) on every
 * page that has the shared footer. Its one-off set-up never lands inside a page
 * transition: after one, it waits for the transition to settle and an idle moment.
 */
export default function DeferredFluidCursor() {
  const [ready, setReady] = useState(() => !isTransitioning());

  useEffect(() => {
    if (ready) return;
    let timer = 0;
    const off = onTransitionSettled(() => {
      timer = window.setTimeout(() => {
        const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
        idle(() => setReady(true), { timeout: 1500 });
      }, 800);
    });
    return () => {
      off();
      window.clearTimeout(timer);
    };
  }, [ready]);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <FluidCursor />
    </Suspense>
  );
}
