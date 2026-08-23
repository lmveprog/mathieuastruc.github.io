"use client";

import { useEffect, useRef, useState } from "react";

// le texte arrive brouillé en glyphes ASCII et se résout de gauche à
// droite, une fois, au chargement (idée empruntée au Decrypt Reveal de
// canvasui.dev, en version one-shot pour ne jamais gêner la lecture)
const GLYPHS = "!#$%&*+-:;=?@";

type Props = {
  text: string;
  /** "mount" = au chargement, "visible" = à l'entrée dans le viewport,
   *  "hover" = uniquement au survol (rien au chargement) */
  trigger?: "mount" | "visible" | "hover";
  /** rejoue le brouillage quand le curseur passe dessus */
  replayOnHover?: boolean;
  /** sélecteur closest() : le survol de cet ancêtre déclenche l'effet
   *  (ex. "li" pour toute la ligne, ".polaroid" pour la carte) */
  hoverParent?: string;
};

export default function DecryptText({ text, trigger = "mount", replayOnHover = false, hoverParent }: Props) {
  // au rendu serveur le vrai texte est là : rien à perdre côté SEO
  const [display, setDisplay] = useState(text);
  const [armed, setArmed] = useState(trigger !== "visible");
  const [runId, setRunId] = useState(0);
  const animating = useRef(false);
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
    if (!hoverParent) return;
    const parent = spanRef.current?.closest(hoverParent);
    if (!parent) return;
    const onEnter = () => {
      if (!animating.current) setRunId((v) => v + 1);
    };
    parent.addEventListener("pointerenter", onEnter);
    return () => parent.removeEventListener("pointerenter", onEnter);
  }, [hoverParent]);

  useEffect(() => {
    if (!armed) return;
    if (trigger === "hover" && runId === 0) return; // rien au chargement

    const totalFrames = 26;
    animating.current = true;
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
      if (frame >= totalFrames) {
        window.clearInterval(interval);
        animating.current = false;
      }
    }, 42);

    return () => {
      window.clearInterval(interval);
      animating.current = false;
    };
  }, [armed, runId, text, trigger]);

  return (
    <span
      ref={spanRef}
      onPointerEnter={() => {
        if (replayOnHover && armed && !animating.current) setRunId((v) => v + 1);
      }}
    >
      {display}
    </span>
  );
}
