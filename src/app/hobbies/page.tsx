import PageLayout from "@/components/PageLayout";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Hobbies — Mathieu Astruc" };

export default function Hobbies() {
  return (
    <PageLayout title="Hobbies" subtitle="Beyond work">
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(2rem, 4vw, 3rem)" }}>

        {/* ── Basketball ─────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1px",
          border: "0.5px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}>
          <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
            <Image
              src="/images/hobbies/basketball.png"
              alt="Basketball"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div style={{
            padding: "clamp(1.5rem, 3vw, 2.5rem)",
            background: "rgba(255,255,255,0.6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "var(--space-sm)",
          }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Sport
            </span>
            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 500, color: "var(--color-text)", letterSpacing: "-0.03em", margin: 0, lineHeight: 1.15 }}>
              Basketball
            </h2>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)", letterSpacing: "-0.01em", margin: 0 }}>
              Top-level athlete · Training Academy
            </p>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.72, letterSpacing: "-0.01em", margin: 0 }}>
              The Basketball Training Academy at Lycée Jean Perrin shaped my competitive drive, leadership instincts, and team communication — skills I carry into every project.
            </p>
          </div>
        </div>

        {/* ── Content Creation ───────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1px",
          border: "0.5px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "clamp(1.5rem, 3vw, 2.5rem)",
            background: "rgba(255,255,255,0.6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "var(--space-sm)",
          }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Content
            </span>
            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 500, color: "var(--color-text)", letterSpacing: "-0.03em", margin: 0, lineHeight: 1.15 }}>
              Content Creator
            </h2>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)", letterSpacing: "-0.01em", margin: 0 }}>
              ~80k subscribers · 15M+ views
            </p>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.72, letterSpacing: "-0.01em", margin: 0 }}>
              YouTube channels covering AI, technology and education. I handle the full production cycle: scripting, filming, editing, publishing and audience engagement — with a deep algorithmic understanding built through systematic iteration.
            </p>
          </div>
          <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "#fff" }}>
            <Image
              src="/images/hobbies/youtube.png"
              alt="YouTube"
              fill
              style={{ objectFit: "contain", padding: "clamp(1.5rem, 4vw, 3rem)" }}
            />
          </div>
        </div>

        {/* ── Associations ───────────────────────────── */}
        <div style={{
          border: "0.5px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "21/6", overflow: "hidden" }}>
            <Image
              src="/images/hobbies/associations.jpg"
              alt="School Associations"
              fill
              style={{ objectFit: "cover", objectPosition: "center 40%" }}
            />
          </div>
          <div style={{
            padding: "clamp(1.5rem, 3vw, 2.5rem)",
            background: "rgba(255,255,255,0.6)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(1rem, 2vw, 2rem)",
            alignItems: "start",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Leadership
              </span>
              <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 500, color: "var(--color-text)", letterSpacing: "-0.03em", margin: 0, lineHeight: 1.15 }}>
                School Associations
              </h2>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)", letterSpacing: "-0.01em", margin: 0 }}>
                Founder & President
              </p>
            </div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.72, letterSpacing: "-0.01em", margin: 0 }}>
              Founded and led the Sports Association at ESAIP, enabling the school&apos;s entry into the Grandes Écoles Championship. Also improved quality processes and KPI monitoring at Junior Conseil AQSE.
            </p>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
