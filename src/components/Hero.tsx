"use client";

import Image from "next/image";
import CompanyLink from "@/components/CompanyLink";
import ContactLink from "@/components/ContactLink";
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
            <ContactLink
              href="https://www.linkedin.com/in/mathieu-astruc/"
              label="LinkedIn"
              icon={
                <svg viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                </svg>
              }
            />
            <span className="doc-contact-sep">·</span>
            <ContactLink
              href="mailto:mathastruc@gmail.com"
              label="Email"
              external={false}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              }
            />
            <span className="doc-contact-sep">·</span>
            <ContactLink
              href="/MathieuResume.pdf"
              label={lang === "fr" ? "CV" : "Resume"}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M15 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-4-5z" />
                  <path d="M9 13h6M9 17h4" />
                </svg>
              }
            />
            <span className="doc-contact-sep">·</span>
            <ContactLink
              href="https://github.com/lmveprog"
              label="GitHub"
              icon={
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7 0-.7 0-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z" />
                </svg>
              }
            />
          </nav>

          <p className="home-avail">
            <span className="hero-badge-dot" />
            {t.about.availability}
          </p>
        </div>

        <div className="home-portrait portrait-swap">
          <Image
            className="portrait-default"
            src="/images/portrait-default.png"
            alt="Mathieu Astruc"
            width={800}
            height={800}
            priority
          />
          <Image
            className="portrait-hover"
            src="/images/portrait-hover.png"
            alt="Mathieu Astruc"
            width={1672}
            height={941}
            aria-hidden="true"
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
                      <CompanyLink name={e.company} handle={e.handle} link={e.link} />
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
                    <CompanyLink name={s.school} handle={s.handle} link={s.link} />
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
