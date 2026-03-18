"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { T } from "@/lib/translations";

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, toggle } = useLanguage();
  const t = T[lang].nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const NAV_LINKS = [
    { href: "/about", label: t.about },
    { href: "/skills", label: t.skills },
    { href: "/education", label: t.education },
    { href: "/career", label: t.career },
    { href: "/hobbies", label: t.hobbies },
    { href: "/references", label: t.references },
  ];

  return (
    <>
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,height:"52px",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 clamp(1.25rem, 5vw, 3.5rem)",transition:"background 280ms ease, border-color 280ms ease",background:scrolled||mobileOpen?"var(--nav-scrolled-bg)":"transparent",backdropFilter:scrolled||mobileOpen?"blur(24px) saturate(1.8)":"none",WebkitBackdropFilter:scrolled||mobileOpen?"blur(24px) saturate(1.8)":"none",borderBottom:scrolled||mobileOpen?"0.5px solid var(--color-border)":"0.5px solid transparent" }}>
        <div style={{ display:"flex",alignItems:"center",gap:"8px",flexShrink:0 }}>
          <Link href="/" style={{ fontSize:"var(--text-sm)",fontWeight:500,letterSpacing:"-0.015em",color:"var(--color-text)",textDecoration:"none" }}>
            Mathieu Astruc
          </Link>
          <a href="https://www.linkedin.com/in/mathieu-astruc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ display:"flex",alignItems:"center",color:"var(--color-text-tertiary)",transition:"color 120ms ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.color="var(--color-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color="var(--color-text-tertiary)")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>

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
          <a href="mailto:mathastruc@gmail.com" className="nav-contact-desktop" style={{ fontSize:"var(--text-sm)",fontWeight:400,color:"var(--color-text-secondary)",textDecoration:"none",letterSpacing:"-0.01em",transition:"color 120ms ease" }}>
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
          {/* Hamburger — mobile only */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Menu"
            style={{ background:"none",border:"none",cursor:"pointer",padding:"4px",display:"flex",flexDirection:"column",gap:"5px",flexShrink:0 }}
          >
            <span style={{ display:"block",width:"18px",height:"1.5px",background:"var(--color-text)",transition:"transform 180ms ease, opacity 180ms ease",transform:mobileOpen?"rotate(45deg) translate(4.7px, 4.7px)":"none" }} />
            <span style={{ display:"block",width:"18px",height:"1.5px",background:"var(--color-text)",transition:"opacity 180ms ease",opacity:mobileOpen?0:1 }} />
            <span style={{ display:"block",width:"18px",height:"1.5px",background:"var(--color-text)",transition:"transform 180ms ease",transform:mobileOpen?"rotate(-45deg) translate(4.7px, -4.7px)":"none" }} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{ position:"fixed",top:"52px",left:0,right:0,background:"rgba(255,255,255,0.96)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"0.5px solid var(--color-border)",zIndex:99,padding:"0 clamp(1.25rem, 5vw, 3.5rem)",display:"flex",flexDirection:"column" }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              style={{ padding:"16px 0",fontSize:"var(--text-base)",fontWeight:pathname===href?500:400,color:pathname===href?"var(--color-text)":"var(--color-text-secondary)",textDecoration:"none",borderBottom:"0.5px solid var(--color-border)",letterSpacing:"-0.01em" }}>
              {label}
            </Link>
          ))}
          <a href="mailto:mathastruc@gmail.com" onClick={() => setMobileOpen(false)}
            style={{ padding:"16px 0",fontSize:"var(--text-base)",color:"var(--color-text-secondary)",textDecoration:"none",letterSpacing:"-0.01em" }}>
            {t.contact}
          </a>
        </div>
      )}
    </>
  );
}
