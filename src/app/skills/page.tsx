"use client";
import PageLayout from "@/components/PageLayout";
import { useLanguage } from "@/context/LanguageContext";
import { T } from "@/lib/translations";

export default function Skills() {
  const { lang } = useLanguage();
  const t = T[lang].skills;
  return (
    <PageLayout title={t.title} subtitle={t.subtitle}>
      <section style={{ marginBottom:"clamp(2.5rem, 5vw, 4rem)" }}>
        <h2 style={sectionLabel}>{t.technicalLabel}</h2>
        <div style={grid}>
          {t.technical.map(({ title, description, tags }) => (
            <div key={title} style={card}>
              <h3 style={cardTitle}>{title}</h3>
              <p style={cardDesc}>{description}</p>
              <div style={{ display:"flex",flexWrap:"wrap",gap:"5px",marginTop:"auto",paddingTop:"var(--space-sm)" }}>
                {tags.map((tg) => <span key={tg} style={tagStyle}>{tg}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 style={sectionLabel}>{t.softLabel}</h2>
        <div style={grid}>
          {t.soft.map(({ title, description }) => (
            <div key={title} style={card}>
              <h3 style={cardTitle}>{title}</h3>
              <p style={{ ...cardDesc, margin:0 }}>{description}</p>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

const sectionLabel: React.CSSProperties = { fontSize:"var(--text-xs)",fontWeight:500,letterSpacing:"0.07em",textTransform:"uppercase",color:"var(--color-text-tertiary)",marginBottom:"var(--space-md)" };
const grid: React.CSSProperties = { display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",gap:"1px",border:"0.5px solid var(--color-border)",borderRadius:"var(--radius-lg)",overflow:"hidden" };
const card: React.CSSProperties = { padding:"clamp(1.25rem, 2.5vw, 1.75rem)",background:"var(--card-bg)",display:"flex",flexDirection:"column",gap:"6px" };
const cardTitle: React.CSSProperties = { fontSize:"var(--text-sm)",fontWeight:500,color:"var(--color-text)",letterSpacing:"-0.01em",margin:0 };
const cardDesc: React.CSSProperties = { fontSize:"var(--text-sm)",color:"var(--color-text-secondary)",letterSpacing:"-0.01em",lineHeight:1.65,margin:0 };
const tagStyle: React.CSSProperties = { fontSize:"var(--text-xs)",color:"var(--color-text-secondary)",background:"var(--tag-bg)",padding:"3px 9px",borderRadius:"var(--radius-full)",letterSpacing:"-0.005em" };
