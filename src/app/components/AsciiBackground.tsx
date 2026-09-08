"use client";

import { useEffect, useRef } from "react";
import { drawTransformerFlow } from "./transformerFlow";

// two particle volumes slowly morphing between a globe and an orbit, plus a
// wireframe transformer stack sharing their camera. the centre fades out so
// the motion stays behind the portfolio, never the copy.
export default function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let elapsed = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let dark = false;
    let cursorX = -1000;
    let cursorY = -1000;
    let cursorPresence = 0;
    let cursorTarget = 0;
    let scroll = 0;
    let scrollTarget = window.scrollY / Math.max(1, window.innerHeight);
    let mask: CanvasGradient;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const t = elapsed / 1000;
      const mobile = width < 900;
      const count = mobile ? 480 : 1000;
      ctx.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let cloud = 0; cloud < (mobile ? 1 : 2); cloud++) {
        const phase = t * 0.19 + cloud * 2.6 + scroll * 0.1;
        const morph = (1 - Math.cos(t * 0.16 + cloud * 2)) / 2;
        const cx = mobile ? width * 0.94 : width * (cloud === 0 ? 0.12 : 0.88);
        const cy = height * (cloud === 0 ? 0.32 : 0.76) - Math.sin(scroll * 0.45) * 18;
        const size = mobile ? 125 : Math.min(190, width * 0.15);
        const points: { x: number; y: number; z: number; seed: number }[] = [];
        for (let i = 0; i < count; i++) {
          const a = i * 2.39996323;
          const y = 1 - 2 * (i + 0.5) / count;
          const ring = Math.sqrt(1 - y * y);
          const longitude = (i / count) * Math.PI * 2;
          const tube = 0.32;
          const radius = 0.85 + tube * Math.cos(a);
          // A continuous transformation between a breathing globe and an orbit.
          const breath = 1 + 0.055 * Math.sin(a * 0.4 + t * 0.6);
          const px = ((1 - morph) * Math.cos(a) * ring + morph * radius * Math.cos(longitude)) * breath;
          const py = (1 - morph) * y + morph * tube * Math.sin(a);
          const pz = (1 - morph) * Math.sin(a) * ring + morph * radius * Math.sin(longitude);
          const rot = phase + pointerX * 0.16;
          const x1 = px * Math.cos(rot) + pz * Math.sin(rot);
          const z1 = -px * Math.sin(rot) + pz * Math.cos(rot);
          const tilt = 0.55 + Math.sin(t * 0.12) * 0.3 + pointerY * 0.12;
          const y1 = py * Math.cos(tilt) - z1 * Math.sin(tilt);
          const z2 = py * Math.sin(tilt) + z1 * Math.cos(tilt);
          const perspective = 3.4 / (3.4 + z2);
          points.push({ x: cx + x1 * size * perspective, y: cy + y1 * size * perspective, z: z2, seed: i });
        }
        points.sort((a, b) => b.z - a.z);
        for (const p of points) {
          const depth = Math.max(0, Math.min(1, (1.3 - p.z) / 2.6));
          const dx = p.x - cursorX;
          const dy = p.y - cursorY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.exp(-distance * distance / 8500) * cursorPresence;
          const force = influence * 13 * (0.4 + depth * 0.6);
          const x = p.x + dx / Math.max(1, distance) * force;
          const y = p.y + dy / Math.max(1, distance) * force;
          const shimmer = Math.pow((1 + Math.sin(p.seed * 0.023 - t * 0.45)) / 2, 12) * 0.12;
          const alpha = Math.min(0.85, (dark ? 0.12 + depth * 0.58 : 0.08 + depth * 0.34) + shimmer + influence * 0.12);
          ctx.fillStyle = dark ? `rgba(177,165,219,${alpha})` : `rgba(86,83,115,${alpha})`;
          if (p.seed % 7 === 0) {
            const glyph = ".:+*"[Math.min(3, Math.floor(depth * 4))];
            ctx.fillText(glyph, x, y);
          } else {
            const dot = 0.55 + depth * 0.8;
            ctx.beginPath(); ctx.arc(x, y, dot, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
      drawTransformerFlow(ctx, width, height, t, dark, pointerX, pointerY, scroll);
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = mask;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mask = ctx.createLinearGradient(0, 0, width, 0);
      if (width < 900) {
        mask.addColorStop(0, "rgba(0,0,0,0.12)");
        mask.addColorStop(0.6, "rgba(0,0,0,0.06)");
        mask.addColorStop(1, "rgba(0,0,0,0.3)");
      } else {
        const margin = Math.max(0.04, (width - 720) / 2 / width);
        mask.addColorStop(0, "rgba(0,0,0,0.15)");
        mask.addColorStop(margin * 0.65, "#000");
        mask.addColorStop(margin, "rgba(0,0,0,0.12)");
        mask.addColorStop(0.5, "rgba(0,0,0,0.04)");
        mask.addColorStop(1 - margin, "rgba(0,0,0,0.12)");
        mask.addColorStop(1 - margin * 0.65, "#000");
        mask.addColorStop(1, "rgba(0,0,0,0.15)");
      }
      draw();
    };
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (now - last < 1000 / (width < 900 ? 30 : 45)) return;
      const dt = Math.min(now - last, 80);
      last = now;
      elapsed += dt;
      const smooth = 1 - Math.exp(-dt / 400);
      pointerX += (targetX - pointerX) * smooth;
      pointerY += (targetY - pointerY) * smooth;
      cursorPresence += (cursorTarget - cursorPresence) * smooth;
      scroll += (scrollTarget - scroll) * smooth;
      draw();
    };
    const syncPlayback = () => {
      cancelAnimationFrame(frame);
      if (!motion.matches && !document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      } else {
        pointerX = pointerY = 0;
        draw();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      cursorX = event.clientX;
      cursorY = event.clientY;
      cursorTarget = 1;
      targetX = event.clientX / width - 0.5;
      targetY = event.clientY / height - 0.5;
    };
    const onScroll = () => { scrollTarget = window.scrollY / Math.max(1, height); };
    const onLeave = () => { cursorTarget = 0; targetX = targetY = 0; };
    const onOut = (event: PointerEvent) => { if (!event.relatedTarget) onLeave(); };
    const onTheme = () => {
      dark = document.documentElement.dataset.theme === "dark";
      if (width) draw();
    };
    onTheme();
    resize();
    syncPlayback();
    const observer = new MutationObserver(onTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerout", onOut);
    window.addEventListener("blur", onLeave);
    document.addEventListener("visibilitychange", syncPlayback);
    motion.addEventListener("change", syncPlayback);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("visibilitychange", syncPlayback);
      motion.removeEventListener("change", syncPlayback);
    };
  }, []);

  return <canvas ref={canvasRef} className="ascii-bg" aria-hidden="true" />;
}
