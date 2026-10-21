/** "DESIGN FORTIS" set as an even, wide-tracked mark that scales with its container's height. */
export default function Wordmark({
  label = "DESIGN FORTIS",
}: {
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 28"
      role="img"
      aria-label="Design Fortis"
      preserveAspectRatio="xMidYMid meet"
    >
      <text
        x="0"
        y="21"
        fontSize="19"
        textLength="160"
        lengthAdjust="spacing"
        style={{
          fill: "currentColor",
          fontFamily: "var(--font-body)",
          fontWeight: 400,
        }}
      >
        {label}
      </text>
    </svg>
  );
}
