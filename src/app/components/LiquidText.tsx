"use client";

import { useEffect, useId, useRef } from "react";

// The original type stays intact: a short refraction ripples through its outline.
export default function LiquidText({ text }: { text: string }) {
  const id = `liquid-${useId().replace(/:/g, "")}`;
  const ref = useRef<HTMLSpanElement>(null);
  const noise = useRef<SVGFETurbulenceElement>(null);
  const displacement = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let disposed = false;
    const stop = () => {
      cancelAnimationFrame(frame);
      element.style.filter = "none";
      displacement.current?.setAttribute("scale", "0");
    };
    const ripple = () => {
      if (disposed || motion.matches) return;
      cancelAnimationFrame(frame);
      const start = performance.now();
      element.style.filter = `url(#${id})`;
      const animate = (now: number) => {
        const progress = Math.min(1, (now - start) / 1500);
        // Fast arrival, then a long fluid settling; no text replacement or layout change.
        const strength = Math.sin(Math.PI * Math.pow(progress, 0.55)) * (1 - progress * 0.55);
        displacement.current?.setAttribute("scale", String(strength * 10));
        noise.current?.setAttribute("baseFrequency", `${0.008 + progress * 0.008} ${0.055 + progress * 0.012}`);
        if (progress < 1) frame = requestAnimationFrame(animate);
        else stop();
      };
      frame = requestAnimationFrame(animate);
    };
    document.fonts.ready.then(() => { if (!disposed) ripple(); });
    element.addEventListener("pointerenter", ripple);
    element.addEventListener("pointerdown", ripple);
    motion.addEventListener("change", stop);
    return () => {
      disposed = true;
      stop();
      element.removeEventListener("pointerenter", ripple);
      element.removeEventListener("pointerdown", ripple);
      motion.removeEventListener("change", stop);
    };
  }, [id]);

  return (
    <>
      <svg className="liquid-filter" aria-hidden="true" focusable="false">
        <defs>
          <filter id={id} x="-12%" y="-40%" width="124%" height="180%" colorInterpolationFilters="sRGB">
            <feTurbulence ref={noise} type="fractalNoise" baseFrequency="0.012 0.06" numOctaves="1" seed="8" result="ripple" />
            <feDisplacementMap ref={displacement} in="SourceGraphic" in2="ripple" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <span ref={ref} className="liquid-text">{text}</span>
    </>
  );
}
