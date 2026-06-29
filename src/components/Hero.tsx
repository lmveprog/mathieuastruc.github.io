"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { T } from "@/lib/translations";

/** Start year extracted from a period string like "Mar 2026\nSep 2026" or "2025 · NTNU". */
function startYear(period: string): string {
  const first = period.split("\n")[0].trim();
  const yearMatch = first.match(/\d{4}/);
  if (yearMatch) return yearMatch[0];
  return first.split(/[\s·]+/)[0];
}

/** Context after the year, e.g. "2025 · NTNU" -> "NTNU". */
function periodContext(period: string): string | null {
  const parts = period.split("·");
  return parts.length > 1 ? parts.slice(1).join("·").trim() : null;
}

export default function Hero() {
  const { lang } = useLanguage();
  const t = T[lang];

  const experiences = t.career.experiences;
  const projects = t.projects.items;
  const schools = t.education.schools;

  return (
    <main className="home">
      {/* ── Masthead - name, one-line bio, inline contact ── */}
      <header className="home-head">
        <div className="home-head-text">
          <h1 className="home-name">Mathieu Astruc</h1>
          <p className="home-headline">{t.hero.headline}</p>

          <nav className="doc-contact">
            <a href="https://www.linkedin.com/in/mathieu-astruc/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span className="doc-contact-sep">·</span>
            <a href="mailto:mathastruc@gmail.com">Email</a>
            <span className="doc-contact-sep">·</span>
            <a href="/MathieuResume.pdf" target="_blank" rel="noopener noreferrer">{lang === "fr" ? "CV" : "Resume"}</a>
            <span className="doc-contact-sep">·</span>
            <a href="https://github.com/lmveprog" target="_blank" rel="noopener noreferrer">GitHub</a>
          </nav>

          <p className="home-avail">
            <span className="hero-badge-dot" />
            {t.about.availability}
          </p>
        </div>

        <div className="home-portrait">
          <Image
            src="/images/about-portrait.png"
            alt="Mathieu Astruc"
            width={300}
            height={400}
            priority
          />
        </div>
      </header>

      {/* ── Experience - full entries ── */}
      <section className="home-section">
        <div className="home-section-head">
          <h2>{t.career.title}</h2>
        </div>
        <ul className="home-list">
          {experiences.map((e, i) => (
            <li key={i} className="home-row">
              <span className="home-row-year">{startYear(e.period)}</span>
              <div className="home-row-body">
                <div className="home-row-title">
                  <div className="home-row-titlemain">
                    <span className="home-row-co">
                      {e.link ? (
                        <a href={e.link} target="_blank" rel="noopener noreferrer" className="company-link" style={{ color:"inherit",textDecoration:"none" }}>{e.company}</a>
                      ) : e.company}
                    </span>
                    <span className="home-row-role">{e.role.split(" - ")[0]}</span>
                    {e.current && <span className="home-row-current">{t.career.current}</span>}
                  </div>
                  {e.logo && e.logoSize && (
                    <Image
                      src={e.logo}
                      alt={e.company}
                      width={e.logoSize.w}
                      height={e.logoSize.h}
                      className="home-row-logo"
                    />
                  )}
                </div>
                <ul className="doc-bullets">
                  {(e.bullets ?? (e.description ? [e.description] : [])).map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
                {e.videos && e.videos.length > 0 && (
                  <div className="doc-links">
                    {e.videos.map((v) => (
                      <a key={v.url} href={v.url} target="_blank" rel="noopener noreferrer" className="home-row-demo">
                        ▸ {v.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Projects - all entries ── */}
      <section className="home-section">
        <div className="home-section-head">
          <h2>{t.projects.title}</h2>
        </div>
        <ul className="home-list">
          {projects.map((p, i) => {
            const ctx = periodContext(p.period);
            return (
              <li key={i} className="home-row">
                <span className="home-row-year">{startYear(p.period)}</span>
                <div className="home-row-body">
                  <div className="home-row-title">
                    <div className="home-row-titlemain">
                      <span className="home-row-co">{p.title}</span>
                      {ctx && <span className="home-row-role">{ctx}</span>}
                    </div>
                  </div>
                  <p className="doc-desc">{p.description}</p>
                  <div className="home-row-tags">
                    {p.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  {(p.link || (p.videos && p.videos.length > 0)) && (
                    <div className="doc-links">
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="home-row-demo">
                          ▸ Code
                        </a>
                      )}
                      {p.videos?.map((v) => (
                        <a key={v.url} href={v.url} target="_blank" rel="noopener noreferrer" className="home-row-demo">
                          ▸ {v.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Education ── */}
      <section className="home-section">
        <div className="home-section-head">
          <h2>{t.education.title}</h2>
        </div>
        <ul className="home-list">
          {schools.map((s, i) => (
            <li key={i} className="home-row">
              <span className="home-row-year">{startYear(s.period)}</span>
              <div className="home-row-body">
                <div className="home-row-titlemain">
                  <span className="home-row-co">
                    {s.link ? (
                      <a href={s.link} target="_blank" rel="noopener noreferrer" className="company-link" style={{ color:"inherit",textDecoration:"none" }}>{s.school}</a>
                    ) : s.school}
                  </span>
                  <span className="home-row-role">{s.degree}</span>
                </div>
                <p className="doc-desc">{s.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

    </main>
  );
}
