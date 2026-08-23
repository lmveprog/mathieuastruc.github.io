"use client";

import { useEffect, useRef, useState } from "react";

// le texte arrive brouillé en glyphes ASCII et se résout de gauche à
// droite, une fois, au chargement (idée empruntée au Decrypt Reveal de
// canvasui.dev, en version one-shot pour ne jamais gêner la lecture)
const GLYPHS = "!#$%&*+-:;=?@";

type Props = {
  text: string;
  /** "mount" = au chargement, "visible" = à l'entrée dans le viewport */
  trigger?: "mount" | "visible";
};

export default function DecryptText({ text, trigger = "mount" }: Props) {
  // au rendu serveur le vrai texte est là : rien à perdre côté SEO
  const [display, setDisplay] = useState(text);
  const [armed, setArmed] = useState(trigger === "mount");
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (trigger !== "visible" || armed) return;
    const el = spanRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [trigger, armed]);

  useEffect(() => {
    if (!armed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const totalFrames = 26;
    let frame = 0;
    const interval = window.setInterval(() => {
      frame += 1;
      const settled = Math.floor((frame / totalFrames) * text.length);
      let out = "";
      for (let i = 0; i < text.length; i += 1) {
        out +=
          i < settled || text[i] === " "
            ? text[i]
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(frame >= totalFrames ? text : out);
      if (frame >= totalFrames) window.clearInterval(interval);
    }, 42);

    return () => window.clearInterval(interval);
  }, [armed, text]);

  return <span ref={spanRef}>{display}</span>;
}
