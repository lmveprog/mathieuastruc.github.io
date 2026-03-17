export default function PageLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        padding:
          "clamp(80px, 10vw, 110px) clamp(1.25rem, 8vw, 6rem) clamp(4rem, 8vw, 7rem)",
        maxWidth: "860px",
        margin: "0 auto",
      }}
    >
      {/* Page header */}
      <div
        style={{
          marginBottom: "clamp(2.5rem, 5vw, 4.5rem)",
          animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <h1
          style={{
            fontSize: "var(--text-3xl)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            color: "var(--color-text)",
            marginBottom: subtitle ? "var(--space-sm)" : 0,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 300,
              color: "var(--color-text-secondary)",
              letterSpacing: "-0.01em",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Page content */}
      <div style={{ animation: "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}>
        {children}
      </div>
    </main>
  );
}
