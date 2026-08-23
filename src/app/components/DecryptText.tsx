"use client";

import { useEffect, useState } from "react";

// le texte arrive brouillé en glyphes ASCII et se résout de gauche à
// droite, une fois, au chargement (idée empruntée au Decrypt Reveal de
// canvasui.dev, en version one-shot pour ne jamais gêner la lecture)
const GLYPHS = "!#$%&*+-:;=?@";

export default function DecryptText({ text }: { text: string }) {
  // au rendu serveur le vrai texte est là : rien à perdre côté SEO
  const [display, setDisplay] = useState(text);

  useEffect(() => {
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
  }, [text]);

  return <>{display}</>;
}
