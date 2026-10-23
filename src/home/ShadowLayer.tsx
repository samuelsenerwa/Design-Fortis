/**
 * Soft architectural shadows (window frames and a diagonal) that multiply into
 * the surface behind them. Pure SVG, so it costs no network. The blur is a CSS
 * filter on a static layer and only the wrapper drifts, which keeps it on the GPU.
 *
 * `inverse` flips the picture: the whole surface is shaded and the window panes are
 * the lit parts, which is how daylight falls across a room.
 */
export default function ShadowLayer({ className = "", inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <div aria-hidden="true" className={`shadow-layer ${className}`}>
      <div className="shadow-layer_drift">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="none" fill="#211a19">
          {inverse ? (
            <path
              fillRule="evenodd"
              d="M-40-40H1040V640H-40Z
                 M385 238 404 226 335 525 318 540Z
                 M452 150 700 170 640 520 430 560Z
                 M540 -40 600 -40 575 70 520 80Z
                 M185 420 296 330 262 600 190 640Z"
            />
          ) : (
            <>
              <polygon points="70,-40 150,-40 40,640 -40,640" />
              <polygon points="300,-40 395,-40 285,640 190,640" />
              <polygon points="610,-40 700,-40 590,640 500,640" />
              <polygon points="860,-40 950,-40 840,640 750,640" />
              <polygon opacity="0.6" points="-40,-40 40,-40 1040,580 1040,640 960,640" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
