import { lazy, Suspense } from "react";

// Three.js is a sizeable dependency — defer it into its own chunk so the
// purely-decorative LiquidDistortion effect never blocks a page's initial
// bundle/render. Falls back to rendering nothing while the chunk loads.
const LiquidDistortion = lazy(() => import("./LiquidDistortion"));

interface LazyLiquidDistortionProps {
  dark: boolean;
  className?: string;
}

export default function LazyLiquidDistortion(props: LazyLiquidDistortionProps) {
  return (
    <Suspense fallback={null}>
      <LiquidDistortion {...props} />
    </Suspense>
  );
}
