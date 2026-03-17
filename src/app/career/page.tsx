"use client";
import PageLayout from "@/components/PageLayout";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { T } from "@/lib/translations";

export default function Career() {
  const { lang } = useLanguage();
  const t = T[lang].career;
  return (
    <PageLayout title={t.title} subtitle={t.subtitle}>
      <div style={{ display:"flex",flexDirection:"column" }}>
        {t.experiences.map(({ period, company, location, role, description, bullets, current, logo, logoSize, photo }, i) => (
          <div key={i} style={{ display:"grid",gridTemplateColumns:"88px 1fr",gap:"clamp(1rem, 3vw, 2rem)",paddingBottom:i<t.experiences.length-1?"clamp(1.75rem, 3.5vw, 2.5rem)":0,marginBottom:i<t.experiences.length-1?"clamp(1.75rem, 3.5vw, 2.5rem)":0,borderBottom:i<t.experiences.length-1?"0.5px solid var(--color-border)":"none" }}>
            <div style={{ paddingTop:"3px",fontSize:"var(--text-xs)",color:"var(--color-text-tertiary)",letterSpacing:"0.01em",lineHeight:1.5,fontVariantNumeric:"tabular-nums",whiteSpace:"pre-line" }}>{period}</div>
            <div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"12px",marginBottom:"4px" }}>
                <div style={{ display:"flex",alignItems:"baseline",gap:"10px",flexWrap:"wrap" }}>
                  <h2 style={{ fontSize:"var(--text-base)",fontWeight:500,color:"var(--color-text)",letterSpacing:"-0.02em",margin:0 }}>{company}</h2>
                  {current && <span style={{ fontSize:"var(--text-xs)",color:"#34c759",background:"rgba(52,199,89,0.10)",padding:"2px 8px",borderRadius:"var(--radius-full)",letterSpacing:"0.02em" }}>{t.current}</span>}
                </div>
                {logo && logoSize && (
                  <div style={{ flexShrink:0 }}>
                    <Image src={logo} alt={company} width={logoSize.w} height={logoSize.h} style={{ height:`${logoSize.h}px`,width:"auto",maxWidth:`${logoSize.w}px`,objectFit:"contain",filter:"grayscale(30%)",opacity:0.80 }} />
                  </div>
                )}
              </div>
              <p style={{ fontSize:"var(--text-sm)",color:"var(--color-text-tertiary)",marginBottom:"8px",letterSpacing:"-0.01em" }}>{role} · {location}</p>
              {description && <p style={{ fontSize:"var(--text-sm)",color:"var(--color-text-secondary)",lineHeight:1.72,letterSpacing:"-0.01em",margin:0 }}>{description}</p>}
              {bullets && (
                <ul style={{ margin:0,padding:0,listStyle:"none",display:"flex",flexDirection:"column",gap:"6px" }}>
                  {bullets.map((b, j) => (
                    <li key={j} style={{ display:"flex",gap:"8px",fontSize:"var(--text-sm)",color:"var(--color-text-secondary)",lineHeight:1.65,letterSpacing:"-0.01em" }}>
                      <span style={{ color:"var(--color-text-tertiary)",flexShrink:0,marginTop:"2px" }}>—</span>{b}
                    </li>
                  ))}
                </ul>
              )}
              {photo && (
                <div style={{ marginTop:"var(--space-md)",borderRadius:"var(--radius-md)",overflow:"hidden",border:"0.5px solid var(--color-border)",maxWidth:"380px" }}>
                  <Image src={photo} alt={company} width={760} height={400} style={{ width:"100%",height:"auto",display:"block",objectFit:"cover" }} />
                </div>
              )}
            </div>
          </div>
        ))}
        <div style={{ marginTop:"clamp(2rem, 4vw, 3rem)",paddingTop:"clamp(1.5rem, 3vw, 2rem)",borderTop:"0.5px solid var(--color-border)",display:"flex",alignItems:"center",gap:"10px" }}>
          <span style={{ width:"7px",height:"7px",borderRadius:"50%",background:"#34c759",flexShrink:0 }} />
          <p style={{ fontSize:"var(--text-sm)",color:"var(--color-text-secondary)",letterSpacing:"-0.01em",margin:0 }}>
            {t.open} <strong style={{ fontWeight:500,color:"var(--color-text)" }}>{t.openDate}</strong>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
