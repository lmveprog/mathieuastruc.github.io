"use client";

import { useEffect, useRef, useState } from "react";

// la photo d'un polaroid se transforme en ASCII couleur au survol
// (au tap sur mobile) — même moteur que le portrait du hero
const GLYPHS = " .,:;irsXA253hMHGS#9B&@";

type Props = {
  src: string;
  alt: string;
};

export default function AsciiPolaroid({ src, alt }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let disposed = false;
    const image = new Image();
    image.decoding = "async";
    image.src = src;

    const render = () => {
      if (disposed || !image.naturalWidth) return;

      const width = Math.max(1, Math.round(canvas.clientWidth));
      const height = Math.max(1, Math.round(canvas.clientHeight));
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      // reproduit le cadrage object-fit: cover de l'image du dessous
      const staging = document.createElement("canvas");
      staging.width = width;
      staging.height = height;
      const stagingContext = staging.getContext("2d", { willReadFrequently: true });
      if (!stagingContext) return;

      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      stagingContext.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);

      const pixels = stagingContext.getImageData(0, 0, width, height).data;
      const cellHeight = 3.1;
      const cellWidth = cellHeight * 0.57;

      context.font = `600 ${cellHeight * 1.08}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      for (let y = 0; y < height; y += cellHeight) {
        for (let x = 0; x < width; x += cellWidth) {
          const px = Math.min(width - 1, Math.floor(x + cellWidth / 2));
          const py = Math.min(height - 1, Math.floor(y + cellHeight / 2));
          const i = (py * width + px) * 4;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const lum = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;

          const darkness = Math.pow(1 - lum, 0.8);
          const glyph =
            GLYPHS[Math.max(1, Math.min(GLYPHS.length - 1, Math.round((0.2 + darkness * 0.95) * (GLYPHS.length - 1))))];

          context.fillStyle = `rgb(${r}, ${g}, ${b})`;
          context.fillText(glyph, x + cellWidth / 2, y + cellHeight / 2);
        }
      }
    };

    image
      .decode()
      .then(render)
      .catch(() => {});

    const resizeObserver = new ResizeObserver(render);
    resizeObserver.observe(canvas);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
    };
  }, [src]);

  return (
    <span
      className={active ? "ascii-photo is-ascii" : "ascii-photo"}
      onPointerEnter={(e) => e.pointerType !== "touch" && setActive(true)}
      onPointerLeave={(e) => e.pointerType !== "touch" && setActive(false)}
      onClick={() => setActive((v) => !v)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      <canvas ref={canvasRef} aria-hidden="true" />
    </span>
  );
}
