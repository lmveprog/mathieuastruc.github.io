"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { T } from "@/lib/translations";

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggle } = useLanguage();
  const t = T[lang].nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NAV_LINKS = [
    { href: "/about", label: t.about },
    { href: "/skills", label: t.skills },
    { href: "/education", label: t.education },
    { href: "/career", label: t.career },
    { href: "/hobbies", label: t.hobbies },
    { href: "/references", label: t.references },
  ];

  return (
    <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,height:"52px",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 clamp(1.25rem, 5vw, 3.5rem)",transition:"background 280ms ease, border-color 280ms ease",background:scrolled?"rgba(255,255,255,0.84)":"transparent",backdropFilter:scrolled?"blur(24px) saturate(1.8)":"none",WebkitBackdropFilter:scrolled?"blur(24px) saturate(1.8)":"none",borderBottom:scrolled?"0.5px solid var(--color-border)":"0.5px solid transparent" }}>
      <Link href="/" style={{ fontSize:"var(--text-sm)",fontWeight:500,letterSpacing:"-0.015em",color:"var(--color-text)",textDecoration:"none",flexShrink:0 }}>
        Mathieu Astruc
      </Link>

      <div className="nav-center">
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{ fontSize:"var(--text-sm)",fontWeight:active?500:400,color:active?"var(--color-text)":"var(--color-text-secondary)",textDecoration:"none",letterSpacing:"-0.01em",transition:"color 120ms ease",position:"relative" }}>
              {label}
              {active && <span style={{ position:"absolute",bottom:"-18px",left:"50%",transform:"translateX(-50%)",width:"3px",height:"3px",borderRadius:"50%",background:"var(--color-text)" }} />}
            </Link>
          );
        })}
      </div>

      <div style={{ display:"flex",alignItems:"center",gap:"clamp(0.75rem, 2vw, 1.25rem)",flexShrink:0 }}>
        <a href="mailto:mathastruc@gmail.com" style={{ fontSize:"var(--text-sm)",fontWeight:400,color:"var(--color-text-secondary)",textDecoration:"none",letterSpacing:"-0.01em",transition:"color 120ms ease" }}>
          {t.contact}
        </a>
        <button
          onClick={toggle}
          style={{ fontSize:"var(--text-xs)",fontWeight:500,letterSpacing:"0.04em",color:"var(--color-text-tertiary)",background:"none",border:"0.5px solid var(--color-border)",borderRadius:"var(--radius-full)",padding:"3px 10px",cursor:"pointer",fontFamily:"inherit",transition:"color 120ms ease, border-color 120ms ease" }}
          onMouseEnter={(e) => { e.currentTarget.style.color="var(--color-text)"; e.currentTarget.style.borderColor="var(--color-border-strong)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color="var(--color-text-tertiary)"; e.currentTarget.style.borderColor="var(--color-border)"; }}
        >
          {lang === "en" ? "FR" : "EN"}
        </button>
      </div>
    </nav>
  );
}
