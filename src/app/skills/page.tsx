import PageLayout from "@/components/PageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Skills — Mathieu Astruc" };

const TECHNICAL = [
  {
    title: "Programming Languages",
    description: "Primary focus on Python. Also C#, C++, JavaScript, HTML & CSS.",
    tags: ["Python", "C++", "C#", "JavaScript", "HTML / CSS"],
  },
  {
    title: "AI & Machine Learning",
    description: "LLMs, Fine-tuning, Transfer Learning, Deep Learning, Computer Vision, Speech Recognition (ASR).",
    tags: ["LLMs", "Deep Learning", "Computer Vision", "ASR", "RAG"],
  },
  {
    title: "Frameworks & Libraries",
    description: "Main ML frameworks and AI tooling for research and production.",
    tags: ["PyTorch", "TensorFlow", "Keras", "Hugging Face", "OpenCV"],
  },
  {
    title: "Data Analysis & Image Processing",
    description: "Data wrangling, visualisation, and classical image processing.",
    tags: ["NumPy", "Pandas", "Matplotlib", "Matlab"],
  },
  {
    title: "Robotics",
    description: "Social robotics, real-time AI systems, human-robot interaction.",
    tags: ["NAO Robot", "Reachy Robot", "RRI", "ROS"],
  },
  {
    title: "Tools & Project Management",
    description: "Version control, project tracking, and Agile workflows.",
    tags: ["GitHub", "GitLab", "Jira", "Trello", "Agile"],
  },
];

const SOFT = [
  {
    title: "Communication",
    description: "Public Speaking · Stress Management · Synthesising complex ideas clearly",
  },
  {
    title: "Team Work",
    description: "Collaboration · Cross-cultural communication · Agile workflows across 4 countries",
  },
  {
    title: "Leadership & Management",
    description: "Decision-Making · Time-Management · Founded & led student Sports Association at ESAIP",
  },
  {
    title: "Adaptability",
    description: "Resilience · Open-Mindedness · Studied and lived in France, Finland, Norway & Spain",
  },
];

export default function Skills() {
  return (
    <PageLayout title="Skills" subtitle="Technical expertise & soft skills">

      {/* Technical */}
      <section style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
        <h2 style={sectionLabel}>Technical</h2>
        <div style={grid}>
          {TECHNICAL.map(({ title, description, tags }) => (
            <div key={title} style={card}>
              <h3 style={cardTitle}>{title}</h3>
              <p style={cardDesc}>{description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "auto", paddingTop: "var(--space-sm)" }}>
                {tags.map((t) => (
                  <span key={t} style={tag}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Soft skills */}
      <section>
        <h2 style={sectionLabel}>Soft Skills</h2>
        <div style={grid}>
          {SOFT.map(({ title, description }) => (
            <div key={title} style={card}>
              <h3 style={cardTitle}>{title}</h3>
              <p style={{ ...cardDesc, margin: 0 }}>{description}</p>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

const sectionLabel: React.CSSProperties = {
  fontSize: "var(--text-xs)",
  fontWeight: 500,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "var(--color-text-tertiary)",
  marginBottom: "var(--space-md)",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "1px",
  border: "0.5px solid var(--color-border)",
  borderRadius: "var(--radius-lg)",
  overflow: "hidden",
};

const card: React.CSSProperties = {
  padding: "clamp(1.25rem, 2.5vw, 1.75rem)",
  background: "rgba(255,255,255,0.55)",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const cardTitle: React.CSSProperties = {
  fontSize: "var(--text-sm)",
  fontWeight: 500,
  color: "var(--color-text)",
  letterSpacing: "-0.01em",
  margin: 0,
};

const cardDesc: React.CSSProperties = {
  fontSize: "var(--text-sm)",
  color: "var(--color-text-secondary)",
  letterSpacing: "-0.01em",
  lineHeight: 1.65,
  margin: 0,
};

const tag: React.CSSProperties = {
  fontSize: "var(--text-xs)",
  color: "var(--color-text-secondary)",
  background: "rgba(0,0,0,0.04)",
  padding: "3px 9px",
  borderRadius: "var(--radius-full)",
  letterSpacing: "-0.005em",
};
