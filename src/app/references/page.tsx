import PageLayout from "@/components/PageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "References — Mathieu Astruc", robots: "noindex" };

export default function References() {
  return (
    <PageLayout title="References" subtitle="Professional endorsements">
      <div style={{ maxWidth: "480px" }}>
        <p
          style={{
            fontSize: "var(--text-base)",
            color: "var(--color-text-secondary)",
            letterSpacing: "-0.01em",
            lineHeight: 1.75,
            marginBottom: "var(--space-lg)",
          }}
        >
          Professional references are available upon request.
        </p>

        <a
          href="mailto:mathastruc@gmail.com?subject=Reference%20Request"
          className="btn-dark"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            background: "var(--color-text)",
            color: "#fff",
            borderRadius: "var(--radius-full)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          Request References
        </a>
      </div>
    </PageLayout>
  );
}
