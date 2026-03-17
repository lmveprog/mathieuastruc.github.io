"use client";
import PageLayout from "@/components/PageLayout";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { T } from "@/lib/translations";

const STATS_VALUES = ["4+", "7", "200k +", "2"];

export default function About() {
  const { lang } = useLanguage();
  const t = T[lang].about;
  return (
    <PageLayout title={t.title} subtitle={t.subtitle}>
      <section style={{ display:"grid",gridTemplateColumns:"1fr auto",gap:"var(--space-xl)",alignItems:"start",marginBottom:"clamp(2.5rem, 5vw, 4rem)" }}>
        <div>
          {t.bio.map((p, i) => (
            <p key={i} style={{ ...prose, marginTop: i > 0 ? "1.1em" : 0 }}>{p}</p>
          ))}
        </div>
        <div style={{ width:"clamp(140px, 18vw, 220px)",aspectRatio:"4/3",borderRadius:"var(--radius-lg)",overflow:"hidden",border:"0.5px solid var(--color-border)",flexShrink:0 }}>
          <Image src="/mathieu.png" alt="Mathieu Astruc" width={520} height={293} style={{ objectFit:"cover",objectPosition:"center center",width:"100%",height:"100%" }} />
        </div>
      </section>

      <section style={{ marginBottom:"clamp(2rem, 4vw, 3rem)" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))",gap:"1px",border:"0.5px solid var(--color-border)",borderRadius:"var(--radius-lg)",overflow:"hidden" }}>
          {STATS_VALUES.map((value, i) => (
            <div key={i} style={{ padding:"clamp(1rem, 2.5vw, 1.5rem)",background:"rgba(255,255,255,0.55)",display:"flex",flexDirection:"column",gap:"4px" }}>
              <span style={{ fontSize:"var(--text-2xl)",fontWeight:600,letterSpacing:"-0.04em",color:"var(--color-text)",lineHeight:1 }}>{value}</span>
              <span style={{ fontSize:"var(--text-xs)",color:"var(--color-text-tertiary)",letterSpacing:"0.05em",textTransform:"uppercase" }}>{t.stats[i]}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display:"flex",gap:"var(--space-sm)",flexWrap:"wrap",alignItems:"center" }}>
        <div style={badge}>
          <span style={{ width:"7px",height:"7px",borderRadius:"50%",background:"#34c759",flexShrink:0 }} />
          <span style={badgeText}>{t.availability}</span>
        </div>
        <a href="https://www.linkedin.com/in/mathieu-astruc/" target="_blank" rel="noopener noreferrer" style={badgeLink}>LinkedIn →</a>
        <a href="mailto:mathastruc@gmail.com" style={badgeLink}>mathastruc@gmail.com</a>
      </section>
    </PageLayout>
  );
}

const prose: React.CSSProperties = { fontSize:"var(--text-base)",fontWeight:400,color:"var(--color-text-secondary)",letterSpacing:"-0.01em",lineHeight:1.75,margin:0 };
const badge: React.CSSProperties = { display:"inline-flex",alignItems:"center",gap:"8px",padding:"7px 14px",border:"0.5px solid var(--color-border)",borderRadius:"var(--radius-full)",background:"rgba(255,255,255,0.5)" };
const badgeText: React.CSSProperties = { fontSize:"var(--text-sm)",color:"var(--color-text-secondary)",letterSpacing:"-0.01em" };
const badgeLink: React.CSSProperties = { display:"inline-flex",alignItems:"center",padding:"7px 14px",border:"0.5px solid var(--color-border)",borderRadius:"var(--radius-full)",background:"rgba(255,255,255,0.5)",fontSize:"var(--text-sm)",color:"var(--color-text-secondary)",textDecoration:"none",letterSpacing:"-0.01em" };
