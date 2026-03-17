import PageLayout from "@/components/PageLayout";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Education — Mathieu Astruc" };

const EDUCATION = [
  {
    period: "Sep 2025\nFeb 2026",
    school: "Universidad Politécnica de Madrid",
    location: "Madrid, Spain · International Exchange",
    degree: "Exchange Semester",
    description: "Machine Learning · Cloud Computing · Programming · Large-Scale Data Processing Architectures.",
    photo: "/images/education/upm.jpg",
  },
  {
    period: "Sep 2021\nJun 2026",
    school: "ESAIP",
    location: "Angers, France · CTI & EUR-ACE Accredited",
    degree: "IT Engineering — Big Data & AI",
    description: "Engineering diploma accredited by the Commission des Titres d'Ingénieurs (CTI) and EUR-ACE. 2021–2023: Integrated preparatory courses. 2023–2026: Computer & network engineering — Big Data & AI option.",
    main: true,
    photo: "/images/education/esaipv2.webp",
    
  },
  {
    period: "Jan 2024\nMay 2024",
    school: "SeAMK",
    location: "Seinäjoki, Finland · International Exchange",
    degree: "Exchange Semester",
    description: "C++, C#, Embedded Systems, OOP, Introduction to AI, Electronics labs, Software Project (Unity), Project Work in Automation.",
    photo: "/images/education/seamk.jpg",
  },
  {
    period: "Sep 2018\nJul 2021",
    school: "Lycée Jean Perrin",
    location: "Marseille, France",
    degree: "Baccalauréat",
    description: "High-level athlete — Basketball Training Academy. BAC — Specialty: Physics & Human Sciences, Mathematics option.",
    photo: "/images/education/lycee.jpg",
  },
];

export default function Education() {
  return (
    <PageLayout title="Education" subtitle="Academic journey across 4 countries">
      <div style={{ display: "flex", flexDirection: "column" }}>
        {EDUCATION.map(({ period, school, location, degree, description, main, photo, logo }, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "88px 1fr",
              gap: "clamp(1rem, 3vw, 2rem)",
              paddingBottom: i < EDUCATION.length - 1 ? "clamp(1.75rem, 3.5vw, 2.5rem)" : 0,
              marginBottom: i < EDUCATION.length - 1 ? "clamp(1.75rem, 3.5vw, 2.5rem)" : 0,
              borderBottom: i < EDUCATION.length - 1 ? "0.5px solid var(--color-border)" : "none",
            }}
          >
            {/* Period */}
            <div
              style={{
                paddingTop: "3px",
                fontSize: "var(--text-xs)",
                color: "var(--color-text-tertiary)",
                letterSpacing: "0.01em",
                lineHeight: 1.5,
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "pre-line",
              }}
            >
              {period}
            </div>

            {/* Content */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "4px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
                  <h2 style={{ fontSize: "var(--text-base)", fontWeight: 500, color: "var(--color-text)", letterSpacing: "-0.02em", margin: 0 }}>
                    {school}
                  </h2>
                  {main && (
                    <span style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-tertiary)",
                      background: "var(--color-bg-secondary)",
                      padding: "2px 8px",
                      borderRadius: "var(--radius-full)",
                      letterSpacing: "0.02em",
                    }}>
                      Main school
                    </span>
                  )}
                </div>

                {/* ESAIP logo */}
                {logo && (
                  <div
                    style={{
                      flexShrink: 0,
                      width: "64px",
                      height: "40px",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      border: "0.5px solid var(--color-border)",
                      background: "#fff",
                    }}
                  >
                    <Image
                      src={logo}
                      alt={school}
                      width={128}
                      height={80}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                )}
              </div>

              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)", marginBottom: "8px", letterSpacing: "-0.01em" }}>
                {degree} · {location}
              </p>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.72, letterSpacing: "-0.01em", margin: 0 }}>
                {description}
              </p>

              {/* Campus / context photo */}
              {photo && (
                <div
                  style={{
                    marginTop: "var(--space-md)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: "0.5px solid var(--color-border)",
                    maxWidth: "420px",
                    aspectRatio: "16/7",
                  }}
                >
                  <Image
                    src={photo}
                    alt={school}
                    width={840}
                    height={368}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
