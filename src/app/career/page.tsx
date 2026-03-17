import PageLayout from "@/components/PageLayout";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Career — Mathieu Astruc" };

const EXPERIENCES = [
  {
    period: "Mar 2026\nSep 2026",
    company: "Airbus Helicopters",
    location: "France",
    role: "Engineering Intern — Final Year (PFE)",
    description:
      "Final year engineering internship applying AI and data engineering expertise",
    current: true,
    logo: "/images/career/airbus.webp",
    logoSize: { w: 120, h: 36 },
  },
  {
    period: "Jun 2025\nAug 2025",
    company: "NTNU",
    location: "Gjøvik, Norway · EduTech Lab",
    role: "Intern Researcher — Social Robotics",
    bullets: [
      "Real-time gesture-based interaction with the NAO social robot.",
      "Conversational assistant with the Reachy robot — optimized response times, dialogue flow and human-in-the-loop interruption handling.",
      "Robot–Robot Interaction (RRI) loop enabling NAO and Reachy to communicate autonomously.",
      "Expected to lead to two scientific publications.",
    ],
    photo: "/images/career/ntnu.jpg",
  },
  {
    period: "Jan 2025\nMay 2025",
    company: "COMAT Specific",
    location: "Angers, France · Aerospace Industry",
    role: "OCR / Computer Vision Project",
    bullets: [
      "Led a hybrid academic–industry project applying computer vision and deep learning to digitalize handwritten 2D sketches.",
      "Built an OCR pipeline (Python, doctr, OpenCV, CNNs) extracting angles, RAL codes and finishes, exporting structured JSON/PDF data.",
      "Agile methodology: dataset preprocessing, model training, error analysis (GitHub, Trello, weekly stakeholder feedback).",
    ],
    logo: "/images/career/comat.png",
    logoSize: { w: 120, h: 40 },
  },
  {
    period: "2024\n3 months",
    company: "Banque de France",
    location: "Poitiers, France",
    role: "Data Engineer Junior",
    description:
      "Built web scraping pipelines with Python and Selenium to retrieve data from ElasticSearch platforms, feeding RAG AI models. Explored NLP including ASR (speech-to-text) and OCR for text recognition, enhancing analytical capabilities and automation efficiency.",
    logo: "/images/career/bdf.png",
    logoSize: { w: 110, h: 36 },
  },
  {
    period: "Summer\n2023",
    company: "Via Electro",
    location: "Marseille, France",
    role: "Electronic Technician",
    description:
      "Installed and maintained electronic security, access control, image and sound systems for major clients. Managed network and computer rack systems.",
    logo: "/images/career/via-electro.png",
    logoSize: { w: 100, h: 36 },
  },
  {
    period: "2022\n1 month",
    company: "GRDF",
    location: "Marseille, France",
    role: "Intern",
    description:
      "Worked across departments at France's leading gas distribution operator: managerial roles, financial and economic aspects, asbestos prevention, green gas and its ecological benefits.",
    logo: "/images/career/grdf.png",
    logoSize: { w: 90, h: 36 },
  },
  {
    period: "2021\n2022",
    company: "JCAQSE",
    location: "Aix-en-Provence, France",
    role: "Junior Company — Quality Management",
    description:
      "Quality management in the Junior Enterprise. Managed processes and KPIs for continuous improvement.",
    logo: "/images/career/jcaqse.webp",
    logoSize: { w: 90, h: 36 },
  },
];

export default function Career() {
  return (
    <PageLayout title="Career" subtitle="7 professional experiences across 4 countries">
      <div style={{ display: "flex", flexDirection: "column" }}>
        {EXPERIENCES.map(({ period, company, location, role, description, bullets, current, logo, logoSize, photo }, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "88px 1fr",
              gap: "clamp(1rem, 3vw, 2rem)",
              paddingBottom: i < EXPERIENCES.length - 1 ? "clamp(1.75rem, 3.5vw, 2.5rem)" : 0,
              marginBottom: i < EXPERIENCES.length - 1 ? "clamp(1.75rem, 3.5vw, 2.5rem)" : 0,
              borderBottom: i < EXPERIENCES.length - 1 ? "0.5px solid var(--color-border)" : "none",
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
              {/* Header row — company name + logo */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "4px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
                  <h2
                    style={{
                      fontSize: "var(--text-base)",
                      fontWeight: 500,
                      color: "var(--color-text)",
                      letterSpacing: "-0.02em",
                      margin: 0,
                    }}
                  >
                    {company}
                  </h2>
                  {current && (
                    <span
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "#34c759",
                        background: "rgba(52,199,89,0.10)",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      Current
                    </span>
                  )}
                </div>

                {/* Logo */}
                {logo && logoSize && (
                  <div style={{ flexShrink: 0 }}>
                    <Image
                      src={logo}
                      alt={company}
                      width={logoSize.w}
                      height={logoSize.h}
                      style={{
                        height: `${logoSize.h}px`,
                        width: "auto",
                        maxWidth: `${logoSize.w}px`,
                        objectFit: "contain",
                        filter: "grayscale(30%)",
                        opacity: 0.80,
                      }}
                    />
                  </div>
                )}
              </div>

              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)", marginBottom: "8px", letterSpacing: "-0.01em" }}>
                {role} · {location}
              </p>

              {description && (
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.72, letterSpacing: "-0.01em", margin: 0 }}>
                  {description}
                </p>
              )}

              {bullets && (
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {bullets.map((b, j) => (
                    <li key={j} style={{ display: "flex", gap: "8px", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.65, letterSpacing: "-0.01em" }}>
                      <span style={{ color: "var(--color-text-tertiary)", flexShrink: 0, marginTop: "2px" }}>—</span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {/* Context photo (NTNU lab photo) */}
              {photo && (
                <div
                  style={{
                    marginTop: "var(--space-md)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: "0.5px solid var(--color-border)",
                    maxWidth: "380px",
                  }}
                >
                    <Image
                      src={photo}
                      alt={company}
                      width={760}
                      height={400}
                      style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
                    />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Availability */}
        <div
          style={{
            marginTop: "clamp(2rem, 4vw, 3rem)",
            paddingTop: "clamp(1.5rem, 3vw, 2rem)",
            borderTop: "0.5px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34c759", flexShrink: 0 }} />
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", letterSpacing: "-0.01em", margin: 0 }}>
            Open to new opportunities from{" "}
            <strong style={{ fontWeight: 500, color: "var(--color-text)" }}>September / October 2026</strong>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
