"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "en" | "fr";
type Ctx = { lang: Lang; toggle: () => void };

const LanguageContext = createContext<Ctx>({ lang: "en", toggle: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "en" || saved === "fr") setLang(saved);
  }, []);

  const toggle = () =>
    setLang((l) => {
      const next = l === "en" ? "fr" : "en";
      localStorage.setItem("lang", next);
      return next;
    });

  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
