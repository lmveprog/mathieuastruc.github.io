import AsciiBackground from "./components/AsciiBackground";
import AsciiPortrait from "./components/AsciiPortrait";
import HoverIndicator from "./components/HoverIndicator";
import LocalTime from "./components/LocalTime";
import ThemeToggle from "./components/ThemeToggle";

const experience = [
  { role: "???", org: "", period: "2026-now" },
  { role: "Applied AI Engineer - Master Thesis", org: "Airbus", logo: "/images/career/fav-airbus.png", period: "2026" },
  { role: "Research Engineer Intern", org: "NTNU, Norway", logo: "/images/career/fav-ntnu.png", period: "2025" },
  { role: "Machine Learning Engineer", org: "Comat Specific", logo: "/images/career/fav-comat.png", period: "2025" },
  { role: "Data Scientist Intern", org: "Banque de France", logo: "/images/career/fav-bdf.png", period: "2024" },
];

const education = [
  { degree: "MEng Data Science", org: "ESAIP · Grade A, top 10%", period: "2021-2026" },
  { degree: "Universidad Politécnica de Madrid", org: "Madrid, Spain", period: "2025-2026" },
  { degree: "SeAMK University of Applied Sciences", org: "Finland", period: "2024" },
];

const linkedIn = "https://www.linkedin.com/in/mathieu-astruc/";

function SocialLinks() {
  return (
    <div className="social-links">
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
      <a href="https://x.com/matheusnpu" target="_blank" rel="noreferrer" aria-label="X">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
      </a>
    </div>
  );
}

function PlatformIcons() {
  return (
    <span className="platform-icons" aria-label="Instagram, TikTok, YouTube, Facebook">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
      </svg>
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
      </svg>
    </span>
  );
}

type Project = {
  title: string;
  desc: string;
  href?: string;
  platforms?: boolean;
  extra?: { label: string; href: string };
  detail?: string;
};


const projects: Project[] = [
  {
    title: "Impostral",
    desc: "Mistral agents infiltrating a real-time social deduction game. 1st in our track, finalist at the Mistral AI Hackathon.",
    href: "https://github.com/MistralGagnant/impostralv2",
    extra: { label: "demo", href: "https://youtu.be/wsBaHW688Lc" },
  },
  {
    title: "AI content creation",
    desc: "Breaking down AI concepts and news for a wide audience.",
    platforms: true,
  },
  {
    title: "Humanoid robot interaction stack",
    desc: "Gesture recognition and an embedded LLM running on a humanoid robot at NTNU.",
    href: "https://youtu.be/QZ8oGMaRq6M",
    detail: "video",
  },
  {
    title: "HCI International 2026 paper",
    desc: "Lead author of an accepted HRI paper on real-time gesture recognition. Springer.",
    href: "https://link.springer.com/chapter/10.1007/978-3-032-29586-6_1",
    detail: "paper",
  },
];

export default function Home() {
  return (
    <div className="page">
      <AsciiBackground />
      <HoverIndicator />

      <header className="hero">
        <ThemeToggle />
        <div className="hero-identity">
          <div className="bust" aria-hidden="true">
            <AsciiPortrait src="/images/portrait-ascii.png" className="bust-canvas" />
          </div>
          <div className="identity-copy">
            <h1 className="hero-name">
              Mathieu Astruc<span aria-hidden="true">.</span>
            </h1>
            <SocialLinks />
          </div>
        </div>

        <div className="lede">
          <p className="lede-line lede-line--1">
            Hello, welcome to my portfolio! I&apos;m 23 yo, passionate about how we can
            build the future with AI.
          </p>
          <p className="lede-line lede-line--2">
            Let&apos;s connect on the socials above, or scroll to see what I&apos;m
            building.
          </p>
        </div>
      </header>

      <section aria-labelledby="experience-title">
        <h2 id="experience-title">experience</h2>
        <ol className="row-list">
          {experience.map((e) => (
            <li key={e.role + e.org}>
              {e.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="exp-fav" src={e.logo} alt="" loading="lazy" decoding="async" />
              ) : (
                <span className="exp-fav exp-fav--mystery" aria-hidden="true">?</span>
              )}
              <p className="what">
                <strong>{e.role}</strong>{e.org ? <> <span>{e.org}</span></> : null}
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
              {p.href ? (
                <a className="project-row" href={p.href} target="_blank" rel="noreferrer">
                  <span className="project-copy">
                    <span className="project-title">{p.title}</span>
                    <span className="project-desc">{p.desc}</span>
                  </span>
                  {p.detail ? <span className="project-detail">{p.detail}</span> : null}
                </a>
              ) : (
                <span className="project-row">
                  <span className="project-copy">
                    <span className="project-title">
                      {p.title}
                      {p.platforms ? <PlatformIcons /> : null}
                    </span>
                    <span className="project-desc">{p.desc}</span>
                  </span>
                </span>
              )}
              {p.extra ? (
                <a className="project-detail project-detail--link" href={p.extra.href} target="_blank" rel="noreferrer">
                  {p.extra.label}
                </a>
              ) : null}
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

      <section className="interests-section" aria-labelledby="interests-title">
        <h2 id="interests-title">interests</h2>
        <div className="polaroid-row">
          <figure className="polaroid">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/interests/basketball.png" alt="Mathieu playing basketball for SMUC" loading="lazy" decoding="async" />
            <figcaption>basketball</figcaption>
          </figure>
          <figure className="polaroid">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/interests/associations.jpg" alt="Speaking at a student event" loading="lazy" decoding="async" />
            <figcaption>content creation</figcaption>
          </figure>
          <figure className="polaroid">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/interests/building.png" alt="Mathieu at a hackathon holding a pixel-art invader" loading="lazy" decoding="async" />
            <figcaption>building</figcaption>
          </figure>
        </div>
        <p className="interest-more">and most things competitive.</p>
      </section>

      <footer>
        <LocalTime />
        <p>France</p>
      </footer>
    </div>
  );
}
