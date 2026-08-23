"use client";

import { useEffect, useRef } from "react";

// densité croissante, l'index est piloté par la luminosité du bloc
const GLYPHS = " .,:;irsXA253hMHGS#9B&@";

type Props = {
  src: string;
  className?: string;
};

type Bounds = { x: number; y: number; width: number; height: number };

// boîte englobante des pixels opaques, coupée sous les épaules :
// le visage remplit le cadre au lieu de flotter dans du vide
function findBounds(image: HTMLImageElement): Bounds | null {
  const source = document.createElement("canvas");
  source.width = image.naturalWidth;
  source.height = image.naturalHeight;
  const context = source.getContext("2d", { willReadFrequently: true });
  if (!context) return null;

  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, source.width, source.height).data;
  let minX = source.width;
  let minY = source.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < source.height; y += 2) {
    for (let x = 0; x < source.width; x += 2) {
      if (pixels[(y * source.width + x) * 4 + 3] <= 8) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < minX || maxY < minY) return null;

  const height = maxY - minY;
  const padX = Math.round((maxX - minX) * 0.04);
  const left = Math.max(0, minX - padX);
  const right = Math.min(source.width, maxX + padX);
  const top = Math.max(0, minY - Math.round(height * 0.03));
  return { x: left, y: top, width: right - left, height: maxY - top };
}

export default function AsciiPortrait({ src, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let disposed = false;
    let bounds: Bounds | null = null;
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

      // le portrait est dessiné en "contain", ancré en haut, sur un canvas
      // intermédiaire dont on lit les pixels bloc par bloc
      const staging = document.createElement("canvas");
      staging.width = width;
      staging.height = height;
      const stagingContext = staging.getContext("2d", { willReadFrequently: true });
      if (!stagingContext) return;

      const crop = bounds ?? { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight };
      const aspect = crop.width / crop.height;
      const drawHeight = height * 1.04;
      const drawWidth = drawHeight * aspect;
      stagingContext.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        (width - drawWidth) / 2,
        0,
        drawWidth,
        drawHeight,
      );

      const pixels = stagingContext.getImageData(0, 0, width, height).data;
      const cellHeight = 2.4;
      const cellWidth = cellHeight * 0.57;

      // premier passage : moyenne alpha/couleur/luminosité par cellule
      type Cell = { x: number; y: number; alpha: number; lum: number; r: number; g: number; b: number };
      const cells: Cell[] = [];
      let lumMin = 1;
      let lumMax = 0;

      for (let y = 0; y < height; y += cellHeight) {
        for (let x = 0; x < width; x += cellWidth) {
          let alphaSum = 0;
          let lumSum = 0;
          let rSum = 0;
          let gSum = 0;
          let bSum = 0;
          let count = 0;

          const endX = Math.min(width, Math.ceil(x + cellWidth));
          const endY = Math.min(height, Math.ceil(y + cellHeight));
          for (let py = Math.floor(y); py < endY; py += 1) {
            for (let px = Math.floor(x); px < endX; px += 1) {
              const i = (py * width + px) * 4;
              const alpha = pixels[i + 3] / 255;
              if (alpha <= 0.02) continue;
              alphaSum += alpha;
              rSum += pixels[i] * alpha;
              gSum += pixels[i + 1] * alpha;
              bSum += pixels[i + 2] * alpha;
              lumSum +=
                ((pixels[i] * 0.2126 + pixels[i + 1] * 0.7152 + pixels[i + 2] * 0.0722) / 255) * alpha;
              count += 1;
            }
          }

          if (!count || alphaSum <= 0) continue;
          const alpha = alphaSum / count;
          if (alpha < 0.06) continue;

          const lum = lumSum / alphaSum;
          if (alpha > 0.5) {
            if (lum < lumMin) lumMin = lum;
            if (lum > lumMax) lumMax = lum;
          }
          cells.push({
            x,
            y,
            alpha,
            lum,
            r: Math.round(rSum / alphaSum),
            g: Math.round(gSum / alphaSum),
            b: Math.round(bSum / alphaSum),
          });
        }
      }

      // second passage : chaque glyphe garde la couleur de la photo. Le
      // relief vient de la densité : sur fond clair elle suit l'ombre
      // (l'encre dessine les zones sombres), sur fond noir elle suit la
      // lumière (le visage éclairé dessine, les ombres s'éteignent) —
      // sinon le rendu paraît inversé et boueux.
      const dark = document.documentElement.dataset.theme === "dark";
      const lumRange = Math.max(0.001, lumMax - lumMin);
      context.font = `600 ${cellHeight * 1.08}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      for (const cell of cells) {
        const normalized = Math.min(1, Math.max(0, (cell.lum - lumMin) / lumRange));
        const emphasis = dark ? Math.pow(normalized, 0.75) : Math.pow(1 - normalized, 0.85);
        const density = Math.min(1, cell.alpha * (0.18 + emphasis * 1.05));
        const glyph =
          GLYPHS[Math.max(1, Math.min(GLYPHS.length - 1, Math.round(density * (GLYPHS.length - 1))))];

        let { r, g, b } = cell;
        let alpha = Math.min(0.97, 0.5 + cell.alpha * 0.5);
        if (dark) {
          // léger boost pour que la peau garde sa chaleur sur fond noir,
          // et les cellules sombres s'estompent au lieu de virer au gris
          r = Math.min(255, Math.round(r * 1.25));
          g = Math.min(255, Math.round(g * 1.25));
          b = Math.min(255, Math.round(b * 1.25));
          alpha *= 0.35 + emphasis * 0.65;
        }

        context.fillStyle = `rgb(${r}, ${g}, ${b})`;
        context.globalAlpha = alpha;
        context.fillText(glyph, cell.x + cellWidth / 2, cell.y + cellHeight / 2);
      }

      context.globalAlpha = 1;
      canvas.classList.add("is-ready");
    };

    image
      .decode()
      .then(() => {
        bounds = findBounds(image);
        render();
      })
      .catch(() => {});

    const resizeObserver = new ResizeObserver(render);
    resizeObserver.observe(canvas);

    const themeObserver = new MutationObserver(render);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      themeObserver.disconnect();
    };
  }, [src]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
