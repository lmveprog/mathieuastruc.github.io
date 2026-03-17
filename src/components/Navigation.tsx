"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/about",      label: "About" },
  { href: "/skills",     label: "Skills" },
  { href: "/education",  label: "Education" },
  { href: "/career",     label: "Career" },
  { href: "/hobbies",    label: "Hobbies" },
  { href: "/references", label: "References" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(1.25rem, 5vw, 3.5rem)",
        transition: "background 280ms ease, border-color 280ms ease",
        background:
          scrolled || !isHome
            ? "rgba(255,255,255,0.84)"
            : "transparent",
        backdropFilter:
          scrolled || !isHome ? "blur(24px) saturate(1.8)" : "none",
        WebkitBackdropFilter:
          scrolled || !isHome ? "blur(24px) saturate(1.8)" : "none",
        borderBottom:
          scrolled || !isHome
            ? "0.5px solid var(--color-border)"
            : "0.5px solid transparent",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          letterSpacing: "-0.015em",
          color: "var(--color-text)",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        Mathieu Astruc
      </Link>

      {/* Center links */}
      <div className="nav-center">
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: active ? 500 : 400,
                color: active ? "var(--color-text)" : "var(--color-text-secondary)",
                textDecoration: "none",
                letterSpacing: "-0.01em",
                transition: "color 120ms ease",
                position: "relative",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = active
                  ? "var(--color-text)"
                  : "var(--color-text-secondary)")
              }
            >
              {label}
              {active && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "-18px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "3px",
                    height: "3px",
                    borderRadius: "50%",
                    background: "var(--color-text)",
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right: contact */}
      <a
        href="mailto:mathastruc@gmail.com"
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: 400,
          color: "var(--color-text-secondary)",
          textDecoration: "none",
          letterSpacing: "-0.01em",
          transition: "color 120ms ease",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--color-text-secondary)")
        }
      >
        Contact
      </a>
    </nav>
  );
}
