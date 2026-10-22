/**
 * Soft architectural shadows (window frames and a diagonal) that multiply into
 * the surface behind them. Pure SVG, so it costs no network. The blur is a CSS
 * filter on a static layer and only the wrapper drifts, which keeps it on the GPU.
 */
export default function ShadowLayer({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`shadow-layer ${className}`}>
      <div className="shadow-layer_drift">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="none" fill="#211a19">
          <polygon points="70,-40 150,-40 40,640 -40,640" />
          <polygon points="300,-40 395,-40 285,640 190,640" />
          <polygon points="610,-40 700,-40 590,640 500,640" />
          <polygon points="860,-40 950,-40 840,640 750,640" />
          <polygon opacity="0.6" points="-40,-40 40,-40 1040,580 1040,640 960,640" />
        </svg>
      </div>
    </div>
  );
}
