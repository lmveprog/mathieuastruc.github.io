"use client";

import { useEffect, useRef } from "react";

// nuage de points 3D en ASCII qui morphe entre plusieurs formes (tore,
// sphère, hélice) en rotation continue, avec une parallaxe légère qui
// suit la souris. Projection perspective + z-buffer par cellule, la
// profondeur pilote le glyphe et l'alpha.
const RAMP = ".,-~:;=!*#$@";
const POINTS = 720;
const HOLD_MS = 5200;
const MORPH_MS = 1700;

type Vec3 = [number, number, number];

function torus(): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i < POINTS; i += 1) {
    const theta = ((i * 0.61803) % 1) * Math.PI * 2;
    const phi = (i / POINTS) * Math.PI * 2;
    const r = 1 + 0.42 * Math.cos(theta);
    pts.push([r * Math.cos(phi) * 1.45, 0.62 * Math.sin(theta), r * Math.sin(phi) * 1.45]);
  }
  return pts;
}

function sphere(): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i < POINTS; i += 1) {
    const y = 1 - (2 * i) / (POINTS - 1);
    const radius = Math.sqrt(1 - y * y);
    const angle = i * 2.399963;
    pts.push([Math.cos(angle) * radius * 1.5, y * 1.5, Math.sin(angle) * radius * 1.5]);
  }
  return pts;
}

function helix(): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i < POINTS; i += 1) {
    const strand = i % 2;
    const t = (i / POINTS) * Math.PI * 2 * 2.3 + strand * Math.PI;
    pts.push([Math.cos(t) * 0.85, ((i / POINTS) - 0.5) * 3.1, Math.sin(t) * 0.85]);
  }
  return pts;
}

const SHAPES = [torus(), sphere(), helix()];

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Cloud = {
  cx: number;
  cy: number;
  scale: number;
  a: number;
  b: number;
  da: number;
  db: number;
  shape: number;
  next: number;
  morph: number; // 0..1, 1 = posé
  holdUntil: number;
};

export default function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cell = 12;
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    let tiltX = 0;
    let tiltY = 0;
    let tiltTargetX = 0;
    let tiltTargetY = 0;

    const start = performance.now();
    const clouds: Cloud[] = [
      { cx: 0, cy: 0, scale: 340, a: 0.7, b: 0.3, da: 0.011, db: 0.005, shape: 0, next: 0, morph: 1, holdUntil: start + HOLD_MS },
      { cx: 0, cy: 0, scale: 210, a: 2.2, b: 1.1, da: -0.008, db: 0.007, shape: 1, next: 1, morph: 1, holdUntil: start + HOLD_MS * 1.6 },
    ];

    const place = () => {
      clouds[0].cx = width * 0.87;
      clouds[0].cy = height * 0.36;
      clouds[1].cx = width * 0.11;
      clouds[1].cy = height * 0.74;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.font = `${cell * 0.9}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      place();
    };

    const drawCloud = (c: Cloud, inkLow: string, inkHigh: string, dark: boolean) => {
      const from = SHAPES[c.shape];
      const to = SHAPES[c.next];
      const t = easeInOut(Math.min(1, c.morph));

      const cosA = Math.cos(c.a);
      const sinA = Math.sin(c.a);
      const cosB = Math.cos(c.b + tiltY);
      const sinB = Math.sin(c.b + tiltY);
      const cosT2 = Math.cos(tiltX);
      const sinT2 = Math.sin(tiltX);

      const best = new Map<number, { n: number; x: number; y: number; z: number }>();

      for (let i = 0; i < POINTS; i += 1) {
        const px0 = from[i][0] + (to[i][0] - from[i][0]) * t;
        const py0 = from[i][1] + (to[i][1] - from[i][1]) * t;
        const pz0 = from[i][2] + (to[i][2] - from[i][2]) * t;

        // rotation Y (a) puis X (b + parallaxe) puis un chouïa de Z
        const x1 = px0 * cosA + pz0 * sinA;
        const z1 = -px0 * sinA + pz0 * cosA;
        const y2 = py0 * cosB - z1 * sinB;
        const z2 = py0 * sinB + z1 * cosB;
        const x3 = x1 * cosT2 - y2 * sinT2;
        const y3 = x1 * sinT2 + y2 * cosT2;

        const zCam = z2 + 4.2;
        const ooz = 1 / zCam;
        const sx = Math.round((c.cx + c.scale * ooz * x3) / cell);
        const sy = Math.round((c.cy - c.scale * ooz * y3) / cell);
        const key = sy * 4096 + sx;

        // plus proche de la caméra = plus lumineux
        const n = Math.min(1, Math.max(0, (2.1 - z2) / 3.6));
        const prev = best.get(key);
        if (!prev || z2 < prev.z) {
          best.set(key, { n, x: sx * cell, y: sy * cell, z: z2 });
        }
      }

      for (const hit of best.values()) {
        const glyph = RAMP[Math.min(RAMP.length - 1, Math.floor(hit.n * RAMP.length))];
        context.fillStyle = hit.n > 0.62 ? inkHigh : inkLow;
        context.globalAlpha = dark ? 0.1 + hit.n * 0.32 : 0.08 + hit.n * 0.24;
        context.fillText(glyph, hit.x, hit.y);
      }
      context.globalAlpha = 1;
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      if (width < 1080) return; // pas de marges = pas de formes

      const dark = document.documentElement.dataset.theme === "dark";
      const inkLow = dark ? "#5c6b7a" : "#8a847b";
      const inkHigh = dark ? "#96b6d4" : "#1a3a5c";
      for (const c of clouds) drawCloud(c, inkLow, inkHigh, dark);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 50) return; // ~20 img/s
      const dt = now - last;
      last = now;

      tiltX += (tiltTargetX - tiltX) * 0.05;
      tiltY += (tiltTargetY - tiltY) * 0.05;

      for (const c of clouds) {
        c.a += c.da;
        c.b += c.db;
        if (c.morph < 1) {
          c.morph = Math.min(1, c.morph + dt / MORPH_MS);
          if (c.morph >= 1) {
            c.shape = c.next;
            c.holdUntil = now + HOLD_MS;
          }
        } else if (now > c.holdUntil) {
          c.next = (c.shape + 1) % SHAPES.length;
          c.morph = 0;
        }
      }
      draw();
    };

    const onPointerMove = (event: PointerEvent) => {
      tiltTargetX = (event.clientX / width - 0.5) * 0.22;
      tiltTargetY = (event.clientY / height - 0.5) * 0.3;
    };

    resize();
    draw();

    if (!reducedMotion) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    const onResize = () => {
      resize();
      draw();
    };
    window.addEventListener("resize", onResize);
    const themeObserver = new MutationObserver(draw);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="ascii-bg" aria-hidden="true" />;
}
