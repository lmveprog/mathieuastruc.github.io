"use client";

import { useEffect, useState } from "react";

// interrupteur light/dark — le site démarre en clair, le choix est retenu
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
    >
      <span className="toggle-track" aria-hidden="true" />
      <span className="toggle-thumb" aria-hidden="true">
        <span className="toggle-dot" />
      </span>
    </button>
  );
}
