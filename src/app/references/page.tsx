"use client";
import PageLayout from "@/components/PageLayout";
import { useLanguage } from "@/context/LanguageContext";
import { T } from "@/lib/translations";

export default function References() {
  const { lang } = useLanguage();
  const t = T[lang].references;
  return (
    <PageLayout title={t.title} subtitle={t.subtitle}>
      <div style={{ maxWidth:"480px" }}>
        <p style={{ fontSize:"var(--text-base)",color:"var(--color-text-secondary)",letterSpacing:"-0.01em",lineHeight:1.75,marginBottom:"var(--space-lg)" }}>{t.text}</p>
        <a href="mailto:mathastruc@gmail.com?subject=Reference%20Request" className="btn-dark"
          style={{ display:"inline-flex",alignItems:"center",gap:"8px",padding:"10px 20px",background:"var(--color-text)",color:"#fff",borderRadius:"var(--radius-full)",fontSize:"var(--text-sm)",fontWeight:500,textDecoration:"none",letterSpacing:"-0.01em" }}>
          {t.button}
        </a>
      </div>
    </PageLayout>
  );
}
