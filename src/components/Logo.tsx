/** Mathieu Astruc monogram — outer triangle (A) with an inner mountain "M".
    Drawn with currentColor so it adapts to the theme. */
export default function Logo({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={4.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* outer triangle with open base + slightly extended corners */}
      <path d="M60 22 L30 92 M60 22 L90 92 M24 92 L50 92 M70 92 L96 92" />
      {/* inner double-peak mountain (M) */}
      <path d="M41 85 L50 55 L60 68 L70 55 L79 85" />
    </svg>
  );
}
