/**
 * Arsvel's symbol beside "ARSVEL" set as an even, wide-tracked word. Scales with its
 * container's height and takes the surrounding text colour; the symbol's two tones are
 * the same colour at full and reduced strength, so it reads on both light and dark pages.
 * The symbol's outlines are the ones in `assets/optimized/logo/arsvel-symbol.svg`.
 */
export default function Wordmark({ label = "ARSVEL" }: { label?: string }) {
  return (
    <svg viewBox="0 0 160 28" role="img" aria-label="Arsvel" preserveAspectRatio="xMidYMid meet">
      <g transform="translate(0 4) scale(0.0667)" fill="currentColor">
        <path opacity="0.6" d="M0 240 L130 0 L176 80 L77 221.43 Q64 240 42 240 Z" />
        <path d="M130 0 L260 300 L260 210 L176 80 Z" />
        <path opacity="0.6" d="M260 300 L400 100 H353 Q332 100 320.5 117.57 L260 210 Z" />
      </g>
      <text
        x="36"
        y="21"
        fontSize="19"
        textLength="124"
        lengthAdjust="spacing"
        style={{ fill: "currentColor", fontFamily: "var(--font-body)", fontWeight: 400 }}
      >
        {label}
      </text>
    </svg>
  );
}
