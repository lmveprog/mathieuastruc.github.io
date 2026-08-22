import Image from "next/image";

const experience = [
  { role: "Applied AI Engineer", org: "Airbus", period: "2026" },
  { role: "Machine Learning Engineer", org: "Comat Specific", period: "2025" },
  { role: "Research Engineer", org: "NTNU, Norway", period: "2025" },
  { role: "Data Scientist", org: "Banque de France", period: "2024" },
];

const projects = [
  {
    title: "Impostral",
    note: "3rd place, Mistral AI Hackathon",
    desc: "Real-time social deduction game where autonomous Mistral agents infiltrate a group of humans and try to pass as one of them.",
    href: "https://github.com/MistralGagnant/impostralv2",
  },
  {
    title: "Humanoid robot interaction stack",
    note: "NTNU",
    desc: "Real-time gesture recognition, computer vision and a fine-tuned LLM running embedded on a humanoid robot.",
    href: "https://youtu.be/QZ8oGMaRq6M",
  },
  {
    title: "HCI International 2026 paper",
    note: "Springer proceedings",
    desc: "Lead author of an accepted HRI paper on a real-time computer-vision architecture for gesture recognition.",
  },
  {
    title: "Hybrid RAG for export control",
    note: "Airbus",
    desc: "RAG + NL-to-SQL system over 10k+ export licenses and regulatory documents, built for zero generative approximation.",
  },
  {
    title: "Industrial OCR pipeline",
    note: "Comat Specific",
    desc: "Deep-learning OCR turning legacy hand-drawn engineering sketches into structured, machine-readable data.",
  },
];

const education = [
  { degree: "MEng Data Science", org: "ESAIP · Grade A, top 10%", period: "2021-2026" },
  { degree: "Study abroad, ML & cloud", org: "Universidad Politécnica de Madrid", period: "2025-2026" },
  { degree: "Study abroad, ML & embedded", org: "SeAMK, Finland", period: "2024" },
];

const linkedIn = "https://www.linkedin.com/in/mathieu-astruc/";

export default function Home() {
  return (
    <div className="page">
      <header>
        <div className="hero-identity">
          <Image
            className="hero-portrait"
            src="/images/portrait-default.png"
            alt="Portrait of Mathieu Astruc"
            width={76}
            height={76}
            priority
          />
          <div>
            <h1 className="hero-name">Mathieu Astruc</h1>
            <p className="hero-role">AI Engineer</p>
          </div>
        </div>
        <div className="lede">
          <p>
            I&apos;m an AI engineer building applied systems — RAG, LLM engineering,
            computer vision and human-robot interaction.
          </p>
          <p>
            I&apos;m a French engineer trained at ESAIP, lead author of a paper accepted
            at HCI International 2026, with AI work at Airbus, Banque de France and NTNU
            in Norway.
          </p>
          <p>
            What drives me is shipping AI that holds up under real constraints:
            safety-critical data, real-time inference, actual users.
          </p>
          <p className="contact-line">
            You can reach me on{" "}
            <a href={linkedIn} target="_blank" rel="noreferrer">LinkedIn</a> or by{" "}
            <a href="mailto:mathastruc@gmail.com">email</a>, my code is on{" "}
            <a href="https://github.com/lmveprog" target="_blank" rel="noreferrer">GitHub</a> — resume{" "}
            <a href="/MathieuASTRUC_CV.pdf" target="_blank" rel="noreferrer">here</a>.
          </p>
        </div>
      </header>

      <section aria-labelledby="experience-title">
        <h2 id="experience-title">experience</h2>
        <ol className="row-list">
          {experience.map((e) => (
            <li key={e.role + e.org}>
              <p className="what">
                <strong>{e.role}</strong> <span>{e.org}</span>
              </p>
              <time>{e.period}</time>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="projects-title">
        <h2 id="projects-title">projects</h2>
        <ul className="project-list">
          {projects.map((p) => (
            <li key={p.title}>
              <p>
                {p.href ? (
                  <a className="project-title" href={p.href} target="_blank" rel="noreferrer">
                    {p.title}
                  </a>
                ) : (
                  <span className="project-title">{p.title}</span>
                )}{" "}
                <span className="project-note">· {p.note}</span>
              </p>
              <p className="project-desc">{p.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="education-title">
        <h2 id="education-title">education</h2>
        <ol className="row-list">
          {education.map((e) => (
            <li key={e.degree}>
              <p className="what">
                <strong>{e.degree}</strong> <span>{e.org}</span>
              </p>
              <time>{e.period}</time>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="interests-title">
        <h2 id="interests-title">interests</h2>
        <ul className="interests">
          <li>
            <strong>Basketball</strong> — former high-level athlete, team captain and point guard.
          </li>
          <li>
            <strong>Content</strong> — I break down AI and tech for a wider audience on social media.
          </li>
          <li>
            <strong>Chess</strong> — and most things competitive.
          </li>
        </ul>
      </section>

      <footer>
        <p>France · 2026</p>
        <div className="footer-links">
          <a href={linkedIn} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
            </svg>
          </a>
          <a href="https://github.com/lmveprog" target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.2c-3.22.7-3.9-1.36-3.9-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.57-.29-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.16 1.18A10.9 10.9 0 0 1 12 6.18c.98 0 1.95.13 2.86.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.82 1.19 3.08 0 4.41-2.71 5.38-5.29 5.67.42.36.79 1.07.79 2.16v3.21c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
            </svg>
          </a>
          <a href="mailto:mathastruc@gmail.com" aria-label="Email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </a>
          <a href="/MathieuASTRUC_CV.pdf" target="_blank" rel="noreferrer" aria-label="Resume">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 3v4a1 1 0 0 0 1 1h4" />
              <path d="M15 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-4-5z" />
              <path d="M9 13h6M9 17h4" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
