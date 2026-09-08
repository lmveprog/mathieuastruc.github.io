"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };

// A slowly breathing wire surface, with light travelling along its contours.
// The centre fades out so the motion stays behind the portfolio, never the copy.
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
    let mask: CanvasGradient;

    const surface = (u: number, v: number, time: number): Point => {
      const wave = Math.sin(u * 0.72 + time * 0.28) * Math.cos(v * 0.6 - time * 0.19);
      const swell = Math.sin(v * 0.82 + u * 0.28 + time * 0.17);
      const z = wave * 0.85 + swell * 0.45;
      const perspective = 1 / (1 + v * 0.025);
      return {
        x: width * 0.5 + (u * width * 0.075 + v * width * 0.02) * perspective + pointerX * 12,
        y: height * 0.5 + (v * height * 0.083 + z * height * 0.13 + u * height * 0.018) * perspective + pointerY * 10,
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const t = elapsed / 1000;
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = dark ? "rgba(168,155,221,0.34)" : "rgba(83,89,125,0.2)";
      const step = width < 600 ? 0.7 : 0.48;
      // Curves share the same surface and remain continuous throughout the loop.
      for (let axis = 0; axis < 2; axis++) {
        for (let fixed = -11; fixed <= 11; fixed += step) {
          ctx.beginPath();
          for (let sample = 0; sample <= 100; sample++) {
            const along = -11 + sample * 0.22;
            const p = axis === 0 ? surface(fixed, along, t) : surface(along, fixed, t);
            if (sample === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.stroke();
        }
      }
      // Two understated highlights trace actual grid lines, at different phases.
      for (let i = 0; i < 2; i++) {
        const desired = i === 0 ? 5.76 : -5.76;
        const u = -11 + Math.round((desired + 11) / step) * step;
        const head = ((t * 0.45 + i * 9) % 18) - 9;
        for (let segment = 0; segment < 22; segment++) {
          const v = head - segment * 0.06;
          const a = surface(u, v, t);
          const b = surface(u, v - 0.065, t);
          const fade = Math.min(1, (9 - Math.abs(head)) / 1.2);
          ctx.strokeStyle = dark
            ? `rgba(180,159,255,${(1 - segment / 22) * 0.8 * fade})`
            : `rgba(99,85,159,${(1 - segment / 22) * 0.5 * fade})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
        const p = surface(u, head, t);
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 16);
        glow.addColorStop(0, dark ? "rgba(180,159,255,0.4)" : "rgba(99,85,159,0.16)");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(p.x - 16, p.y - 16, 32, 32);
      }
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
      if (now - last < 1000 / 30) return;
      const dt = Math.min(now - last, 80);
      last = now;
      elapsed += dt;
      const smooth = 1 - Math.exp(-dt / 400);
      pointerX += (targetX - pointerX) * smooth;
      pointerY += (targetY - pointerY) * smooth;
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
      targetX = event.clientX / width - 0.5;
      targetY = event.clientY / height - 0.5;
    };
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
    document.addEventListener("visibilitychange", syncPlayback);
    motion.addEventListener("change", syncPlayback);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", syncPlayback);
      motion.removeEventListener("change", syncPlayback);
    };
  }, []);

  return <canvas ref={canvasRef} className="ascii-bg" aria-hidden="true" />;
}
