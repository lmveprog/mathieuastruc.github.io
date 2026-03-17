import PageLayout from "@/components/PageLayout";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About — Mathieu Astruc" };

const STATS = [
  { value: "4+",  label: "Countries" },
  { value: "7",   label: "Experiences" },
  { value: "200k +", label: "Subscribers" },
  { value: "2",   label: "Publications" },
];

export default function About() {
  return (
    <PageLayout title="About" subtitle="Future AI Engineer">

      {/* Photo + bio */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--space-xl)", alignItems: "start", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
        <div>
          <p style={prose}>
            I&apos;m a Final-Year AI engineering student at{" "}
            <strong style={{ fontWeight: 500, color: "var(--color-text)" }}>ESAIP</strong> (Angers, France),
            currently completing my Final Year Internship at{" "}
            <strong style={{ fontWeight: 500, color: "var(--color-text)" }}>Airbus Helicopters</strong>.
          </p>
          <p style={{ ...prose, marginTop: "1.1em" }}>
            My work spans machine learning, large language models, computer vision, and social robotics —
            built across research labs in Norway, exchange semesters in Finland &amp; Spain,
            and projects in France.
          </p>
          <p style={{ ...prose, marginTop: "1.1em" }}>
            I&apos;m fluent in French,English and I am a former high-level athlete. Additionally, I am a passionate content creator with a significant online presence, reaching over 80M views and growing a community of more than 200,000 subscribers across my channels.
          </p>
        </div>

        <div
          style={{
            width: "clamp(140px, 18vw, 220px)",
            aspectRatio: "4/3",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            border: "0.5px solid var(--color-border)",
            flexShrink: 0,
          }}
        >
          <Image
            src="/mathieu.png"
            alt="Mathieu Astruc"
            width={520}
            height={293}
            style={{ objectFit: "cover", objectPosition: "center center", width: "100%", height: "100%" }}
          />
        </div>
      </section>

      {/* Stats */}
      <section style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "1px",
            border: "0.5px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              style={{
                padding: "clamp(1rem, 2.5vw, 1.5rem)",
                background: "rgba(255,255,255,0.55)",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span style={{ fontSize: "var(--text-2xl)", fontWeight: 600, letterSpacing: "-0.04em", color: "var(--color-text)", lineHeight: 1 }}>
                {value}
              </span>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Availability + links */}
      <section style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", alignItems: "center" }}>
        <div style={badge}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34c759", flexShrink: 0 }} />
          <span style={badgeText}>Open to opportunities · Sept / Oct 2026</span>
        </div>
        <a href="https://www.linkedin.com/in/mathieu-astruc/" target="_blank" rel="noopener noreferrer" style={badgeLink}>
          LinkedIn →
        </a>
        <a href="mailto:mathastruc@gmail.com" style={badgeLink}>
          mathastruc@gmail.com
        </a>
      </section>
    </PageLayout>
  );
}

const prose: React.CSSProperties = {
  fontSize: "var(--text-base)",
  fontWeight: 400,
  color: "var(--color-text-secondary)",
  letterSpacing: "-0.01em",
  lineHeight: 1.75,
  margin: 0,
};

const badge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "7px 14px",
  border: "0.5px solid var(--color-border)",
  borderRadius: "var(--radius-full)",
  background: "rgba(255,255,255,0.5)",
};

const badgeText: React.CSSProperties = {
  fontSize: "var(--text-sm)",
  color: "var(--color-text-secondary)",
  letterSpacing: "-0.01em",
};

const badgeLink: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "7px 14px",
  border: "0.5px solid var(--color-border)",
  borderRadius: "var(--radius-full)",
  background: "rgba(255,255,255,0.5)",
  fontSize: "var(--text-sm)",
  color: "var(--color-text-secondary)",
  textDecoration: "none",
  letterSpacing: "-0.01em",
  transition: "color 120ms ease",
};
