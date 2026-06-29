/** Mathieu Astruc monogram — the real artwork, driven as a mask filled with the
    current theme text color so it shows correctly in both light and dark modes. */
export default function Logo({ size = 22, className }: { size?: number; className?: string }) {
  const mask = "url(/images/logo-mark.png) center / contain no-repeat";
  return (
    <span
      role="img"
      aria-label="Mathieu Astruc logo"
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        flexShrink: 0,
        backgroundColor: "var(--color-text)",
        WebkitMask: mask,
        mask,
      }}
    />
  );
}
