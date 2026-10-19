import { useRef, useState } from "react";
import Lightbox, { useController, type Slide, type ZoomRef } from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { X } from "lucide-react";

import "yet-another-react-lightbox/styles.css";

interface AppLightboxProps {
  open: boolean;
  close: () => void;
  index: number;
  slides: Slide[];
  /** Shown bottom-left alongside the progress bar (e.g. the project title). */
  title: string;
}

function CloseButton({ close }: { close: () => void }) {
  return (
    <button
      type="button"
      onClick={close}
      data-cursor="hover"
      aria-label="Close gallery"
      className="cursor-pointer text-white/80 hover:text-white transition-colors"
    >
      <X className="w-5 h-5" strokeWidth={1.5} />
    </button>
  );
}

/** Numeric counter + text-based Prev/Next, positioned bottom-right inline
 * (instead of the library's default screen-edge arrow buttons). */
function CounterAndNav({ currentIndex, total }: { currentIndex: number; total: number }) {
  const { prev, next } = useController();
  return (
    <div className="pointer-events-auto flex items-center gap-4">
      <span className="text-xs font-light tracking-[0.15em] text-white/60 tabular-nums">
        {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => prev()}
            data-cursor="hover"
            className="cursor-pointer text-[11px] font-medium uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors"
          >
            Prev
          </button>
          <span className="text-white/30 text-xs">/</span>
          <button
            type="button"
            onClick={() => next()}
            data-cursor="hover"
            className="cursor-pointer text-[11px] font-medium uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors"
          >
            Next
          </button>
        </>
      )}
    </div>
  );
}

/**
 * Shared gallery lightbox skinned to match the reference design: a near-black
 * warm backdrop, title + slim progress bar bottom-left, numeric counter +
 * text Prev/Next bottom-right, a minimal close icon top-right, and a
 * click-to-toggle zoom (single click zooms in centered on the cursor, click
 * again to zoom back out) with a live "Zoom In"/"Zoom Out" cursor label.
 * The enlarging circle itself is CustomCursor's `data-cursor`/
 * `data-cursor-label` convention, not a static button style.
 */
export default function AppLightbox({ open, close, index, slides, title }: AppLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(index);
  const [prevOpen, setPrevOpen] = useState(open);
  const [isZoomed, setIsZoomed] = useState(false);
  const zoomRef = useRef<ZoomRef | null>(null);

  // Reset local state whenever the lightbox transitions from closed to open
  // at a new starting slide. Adjusting state during render (rather than in
  // an effect) is the React-recommended pattern for "reset state when a
  // prop changes" — see https://react.dev/learn/you-might-not-need-an-effect.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      if (currentIndex !== index) setCurrentIndex(index);
      if (isZoomed) setIsZoomed(false);
    }
  }

  const total = slides.length;
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

  return (
    <Lightbox
      open={open}
      close={close}
      index={index}
      slides={slides}
      plugins={[Zoom]}
      on={{
        view: ({ index: i }) => setCurrentIndex(i),
        // Authoritative zoom-state source (fires for click, scroll, and
        // pinch alike) — keeps the cursor label in sync with the real
        // zoom level rather than guessing from the triggering gesture.
        zoom: ({ zoom }) => setIsZoomed(zoom > 1.01),
        click: () => {
          const zoomApi = zoomRef.current;
          if (!zoomApi) return;
          if (zoomApi.zoom > 1) zoomApi.zoomOut();
          else zoomApi.zoomIn();
        },
      }}
      zoom={{ ref: zoomRef, maxZoomPixelRatio: 3, scrollToZoom: true }}
      controller={{ closeOnBackdropClick: true }}
      animation={{ fade: 350, swipe: 400 }}
      styles={{
        container: { backgroundColor: "rgba(10, 8, 7, 0.98)" },
      }}
      render={{
        buttonClose: () => <CloseButton close={close} />,
        buttonPrev: () => null,
        buttonNext: () => null,
        slideContainer: ({ children }) => (
          <div className="contents" data-cursor-label={isZoomed ? "Zoom Out" : "Zoom In"}>
            {children}
          </div>
        ),
        controls: () => (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-6 py-6 md:px-10 md:py-8">
            {/* Title + progress — bottom-left */}
            <div className="max-w-xs">
              <p className="text-xs font-light uppercase tracking-[0.25em] text-white/90 mb-3">
                {title}
              </p>
              <div className="h-px w-32 bg-white/20">
                <div
                  className="h-px bg-white transition-[width] duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Counter + Prev/Next — bottom-right */}
            <CounterAndNav currentIndex={currentIndex} total={total} />
          </div>
        ),
      }}
    />
  );
}
