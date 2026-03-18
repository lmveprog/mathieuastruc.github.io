"use client";
import PageLayout from "@/components/PageLayout";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { T } from "@/lib/translations";

export default function Hobbies() {
  const { lang } = useLanguage();
  const t = T[lang].hobbies;
  return (
    <PageLayout title={t.title} subtitle={t.subtitle}>
      <div style={{ display:"flex",flexDirection:"column",gap:"clamp(2rem, 4vw, 3rem)" }}>
        {t.items.map((item) => {
          if (item.layout === "full-width") return (
            <div key={item.title} style={{ border:"0.5px solid var(--color-border)",borderRadius:"var(--radius-lg)",overflow:"hidden" }}>
              <div style={{ position:"relative",width:"100%",aspectRatio:"21/6",overflow:"hidden" }}>
                <Image src={item.image} alt={item.title} fill style={{ objectFit:"cover",objectPosition:"center 15%" }} />
              </div>
              <div style={{ padding:"clamp(1.5rem, 3vw, 2.5rem)",background:"var(--card-bg)",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(1rem, 2vw, 2rem)",alignItems:"start" }}>
                <div style={{ display:"flex",flexDirection:"column",gap:"6px" }}>
                  <span style={labelStyle}>{item.label}</span>
                  <h2 style={titleStyle}>{item.title}</h2>
                  <p style={detailStyle}>{item.detail}</p>
                </div>
                <p style={descStyle}>{item.description}</p>
              </div>
            </div>
          );
          const imageFirst = item.layout === "image-right";
          return (
            <div key={item.title} className="hobby-split">
              {imageFirst ? (
                <>
                  <div className="hobby-split-image" style={{ position:"relative",minHeight:"clamp(220px, 35vw, 380px)",overflow:"hidden",background:item.imageBg??"var(--color-bg-secondary)" }}>
                    <Image src={item.image} alt={item.title} fill style={{ objectFit:item.imageFit??"cover",objectPosition:item.imagePosition??"center",padding:item.imageFit==="contain"?"clamp(1.5rem, 4vw, 3rem)":undefined }} />
                  </div>
                  <div className="hobby-split-text" style={{ padding:"clamp(1.5rem, 3vw, 2.5rem)",background:"var(--card-bg)",display:"flex",flexDirection:"column",justifyContent:"center",gap:"var(--space-sm)" }}>
                    <span style={labelStyle}>{item.label}</span>
                    <h2 style={titleStyle}>{item.title}</h2>
                    <p style={detailStyle}>{item.detail}</p>
                    <p style={descStyle}>{item.description}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="hobby-split-text" style={{ padding:"clamp(1.5rem, 3vw, 2.5rem)",background:"var(--card-bg)",display:"flex",flexDirection:"column",justifyContent:"center",gap:"var(--space-sm)" }}>
                    <span style={labelStyle}>{item.label}</span>
                    <h2 style={titleStyle}>{item.title}</h2>
                    <p style={detailStyle}>{item.detail}</p>
                    <p style={descStyle}>{item.description}</p>
                  </div>
                  <div className="hobby-split-image" style={{ position:"relative",minHeight:"clamp(220px, 35vw, 380px)",overflow:"hidden",background:item.imageBg??"var(--color-bg-secondary)" }}>
                    <Image src={item.image} alt={item.title} fill style={{ objectFit:item.imageFit??"cover",objectPosition:item.imagePosition??"center",padding:item.imageFit==="contain"?"clamp(1.5rem, 4vw, 3rem)":undefined }} />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}

const labelStyle: React.CSSProperties = { fontSize:"var(--text-xs)",color:"var(--color-text-tertiary)",letterSpacing:"0.08em",textTransform:"uppercase" };
const titleStyle: React.CSSProperties = { fontSize:"var(--text-xl)",fontWeight:500,color:"var(--color-text)",letterSpacing:"-0.03em",margin:0,lineHeight:1.15 };
const detailStyle: React.CSSProperties = { fontSize:"var(--text-sm)",color:"var(--color-text-tertiary)",letterSpacing:"-0.01em",margin:0 };
const descStyle: React.CSSProperties = { fontSize:"var(--text-sm)",color:"var(--color-text-secondary)",lineHeight:1.72,letterSpacing:"-0.01em",margin:0 };
