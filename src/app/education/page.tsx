"use client";
import PageLayout from "@/components/PageLayout";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { T } from "@/lib/translations";

export default function Education() {
  const { lang } = useLanguage();
  const t = T[lang].education;
  return (
    <PageLayout title={t.title} subtitle={t.subtitle}>
      <div style={{ display:"flex",flexDirection:"column" }}>
        {t.schools.map(({ period, school, location, degree, description, main, photo, logo }, i) => (
          <div key={i} className="timeline-row" style={{ paddingBottom:i<t.schools.length-1?"clamp(1.75rem, 3.5vw, 2.5rem)":0,marginBottom:i<t.schools.length-1?"clamp(1.75rem, 3.5vw, 2.5rem)":0,borderBottom:i<t.schools.length-1?"0.5px solid var(--color-border)":"none" }}>
            <div className="timeline-date" style={{ paddingTop:"3px",fontSize:"var(--text-xs)",color:"var(--color-text-tertiary)",letterSpacing:"0.01em",lineHeight:1.5,fontVariantNumeric:"tabular-nums",whiteSpace:"pre-line" }}>{period}</div>
            <div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"12px",marginBottom:"4px" }}>
                <div style={{ display:"flex",alignItems:"baseline",gap:"10px",flexWrap:"wrap" }}>
                  <h2 style={{ fontSize:"var(--text-base)",fontWeight:500,color:"var(--color-text)",letterSpacing:"-0.02em",margin:0 }}>{school}</h2>
                  {main && <span style={{ fontSize:"var(--text-xs)",color:"var(--color-text-tertiary)",background:"var(--color-bg-secondary)",padding:"2px 8px",borderRadius:"var(--radius-full)",letterSpacing:"0.02em" }}>{t.mainLabel}</span>}
                </div>
                {logo && (
                  <div style={{ flexShrink:0,width:"64px",height:"40px",borderRadius:"var(--radius-sm)",overflow:"hidden",border:"0.5px solid var(--color-border)",background:"#fff" }}>
                    <Image src={logo} alt={school} width={128} height={80} style={{ width:"100%",height:"100%",objectFit:"contain" }} />
                  </div>
                )}
              </div>
              <p style={{ fontSize:"var(--text-sm)",color:"var(--color-text-tertiary)",marginBottom:"8px",letterSpacing:"-0.01em" }}>{degree} · {location}</p>
              <p style={{ fontSize:"var(--text-sm)",color:"var(--color-text-secondary)",lineHeight:1.72,letterSpacing:"-0.01em",margin:0 }}>{description}</p>
              {photo && (
                <div style={{ marginTop:"var(--space-md)",borderRadius:"var(--radius-md)",overflow:"hidden",border:"0.5px solid var(--color-border)",maxWidth:"420px",aspectRatio:"16/7" }}>
                  <Image src={photo} alt={school} width={840} height={368} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
