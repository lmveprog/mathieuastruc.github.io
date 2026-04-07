"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { T } from "@/lib/translations";

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, toggle } = useLanguage();
  const { theme, cycle } = useTheme();
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
          {/* CV button */}
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-contact-desktop"
            style={{ position:"relative",display:"inline-flex",alignItems:"center",flexShrink:0 }}
          >
            <span style={{ position:"absolute",inset:"-3px",borderRadius:"var(--radius-full)",background:"var(--color-text)",animation:"cv-ping 2.2s ease-out infinite",pointerEvents:"none" }} />
            <span style={{ position:"relative",fontSize:"var(--text-xs)",fontWeight:600,letterSpacing:"0.06em",color:"var(--color-bg)",background:"var(--color-text)",borderRadius:"var(--radius-full)",padding:"4px 11px",display:"flex",alignItems:"center",gap:"4px",whiteSpace:"nowrap" }}>
              {t.resume} <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 9L9 1M9 1H3M9 1v6"/></svg>
            </span>
          </a>
          <button
            onClick={toggle}
            style={{ fontSize:"var(--text-xs)",fontWeight:500,letterSpacing:"0.04em",color:"var(--color-text-tertiary)",background:"none",border:"0.5px solid var(--color-border)",borderRadius:"var(--radius-full)",padding:"3px 10px",cursor:"pointer",fontFamily:"inherit",transition:"color 120ms ease, border-color 120ms ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.color="var(--color-text)"; e.currentTarget.style.borderColor="var(--color-border-strong)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color="var(--color-text-tertiary)"; e.currentTarget.style.borderColor="var(--color-border)"; }}
          >
            {lang === "en" ? "FR" : "EN"}
          </button>
          <button
            onClick={cycle}
            aria-label="Toggle theme"
            title={theme === "system" ? "System" : theme === "light" ? "Light" : "Dark"}
            style={{ background:"none",border:"none",cursor:"pointer",padding:"4px",display:"flex",alignItems:"center",color:"var(--color-text-tertiary)",transition:"color 120ms ease",flexShrink:0 }}
            onMouseEnter={(e) => { e.currentTarget.style.color="var(--color-text)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color="var(--color-text-tertiary)"; }}
          >
            {theme === "dark" ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            ) : theme === "light" ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            )}
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
        <div style={{ position:"fixed",top:"52px",left:0,right:0,background:"var(--nav-scrolled-bg)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"0.5px solid var(--color-border)",zIndex:99,padding:"0 clamp(1.25rem, 5vw, 3.5rem)",display:"flex",flexDirection:"column" }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              style={{ padding:"16px 0",fontSize:"var(--text-base)",fontWeight:pathname===href?500:400,color:pathname===href?"var(--color-text)":"var(--color-text-secondary)",textDecoration:"none",borderBottom:"0.5px solid var(--color-border)",letterSpacing:"-0.01em" }}>
              {label}
            </Link>
          ))}
          <a href="mailto:mathastruc@gmail.com" onClick={() => setMobileOpen(false)}
            style={{ padding:"16px 0",fontSize:"var(--text-base)",color:"var(--color-text-secondary)",textDecoration:"none",letterSpacing:"-0.01em",borderBottom:"0.5px solid var(--color-border)" }}>
            {t.contact}
          </a>
          <div style={{ padding:"16px 0",display:"flex",alignItems:"center" }}>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              style={{ position:"relative",display:"inline-flex",alignItems:"center" }}
            >
              <span style={{ position:"absolute",inset:"-3px",borderRadius:"var(--radius-full)",background:"var(--color-text)",animation:"cv-ping 2.2s ease-out infinite",pointerEvents:"none" }} />
              <span style={{ position:"relative",fontSize:"var(--text-sm)",fontWeight:600,letterSpacing:"0.06em",color:"var(--color-bg)",background:"var(--color-text)",borderRadius:"var(--radius-full)",padding:"6px 16px",display:"flex",alignItems:"center",gap:"5px" }}>
                {t.resume} <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 9L9 1M9 1H3M9 1v6"/></svg>
              </span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
