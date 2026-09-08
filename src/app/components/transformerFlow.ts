// a transformer living in the same space as the particle clouds: a stack of
// five wireframe layers seen in perspective (same rotation, tilt, parallaxe and
// depth fade as the clouds), four tokens rising through it, attention lighting
// up on each plane, and the generated token whipping back around the stack to
// join the next input. no labels, no boxes, just points and thin lines.

const LAYERS = 5;
const GRID = 6;
const HALF = 0.85;
const SLOTS: [number, number][] = [[-0.45, -0.45], [0.45, -0.45], [0.45, 0.45], [-0.45, 0.45]];

// one generation step, in seconds
const CYCLE = 6.0;
const RISE = 3.2; // tokens climb from below the stack to above it
const BLOOM_AT = 3.2; // the last position becomes the output
const RETURN_AT = 3.6; // and rides back around the stack
const RETURN_END = 5.0;
const REST_FADE = 4.6; // afterglow on the layers fades out
const Y_START = 1.35; // model space, +y is down on screen like the clouds
const Y_END = -1.25;
const TOP = 0.8; // the layers sit between -TOP and +TOP

type Ink = [number, number, number];
type Pt = { x: number; y: number; z: number; s: number };

function rand(a: number, b: number, c: number, d = 0) {
  const x = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719 + d * 4.13) * 43758.5453;
  return x - Math.floor(x);
}
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const span = (t: number, from: number, to: number) => clamp01((t - from) / (to - from));
const rgba = (c: Ink, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const depth = (z: number) => clamp01((1.3 - z) / 2.6);

export function drawTransformerFlow(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  dark: boolean,
  pointerX: number,
  pointerY: number,
  scroll: number,
) {
  if (width < 900) return;
  const size = Math.min(122, width * 0.085);
  const cx = width * 0.865;
  const cy = height * 0.29 - Math.sin(scroll * 0.45) * 18;
  const rot = time * 0.15 + 0.7 + pointerX * 0.16;
  const tilt = 0.52 + Math.sin(time * 0.1) * 0.08 + pointerY * 0.12;
  const ink: Ink = dark ? [177, 165, 219] : [86, 83, 115];
  const hi: Ink = dark ? [224, 215, 255] : [104, 84, 158];
  const base = dark ? 0.17 : 0.16;
  const cycle = Math.floor(time / CYCLE);
  const tc = time - cycle * CYCLE;

  // same camera as the clouds so the stack sits in their space
  const pr = (px: number, py: number, pz: number): Pt => {
    const x1 = px * Math.cos(rot) + pz * Math.sin(rot);
    const z1 = -px * Math.sin(rot) + pz * Math.cos(rot);
    const y1 = py * Math.cos(tilt) - z1 * Math.sin(tilt);
    const z2 = py * Math.sin(tilt) + z1 * Math.cos(tilt);
    const s = 3.4 / (3.4 + z2);
    return { x: cx + x1 * size * s, y: cy + y1 * size * s, z: z2, s };
  };
  const line = (a: Pt, b: Pt, alpha: number, w: number, c: Ink = ink) => {
    ctx.strokeStyle = rgba(c, alpha);
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  };
  const dot = (p: Pt, r: number, alpha: number, c: Ink = ink) => {
    ctx.fillStyle = rgba(c, alpha);
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  // where the tokens are on their way up, and how lit each layer is
  const rise = span(tc, 0, RISE);
  const yTok = Y_START + (Y_END - Y_START) * (0.5 - 0.5 * Math.cos(rise * Math.PI));
  const afterglow = 0.3 * (1 - span(tc, REST_FADE, CYCLE - 0.15));
  const lit = (y: number) => {
    const glow = Math.exp(-((yTok - y) * (yTok - y)) / (2 * 0.16 * 0.16));
    return Math.min(1, glow + (yTok < y ? afterglow : 0));
  };

  // the four rails the tokens follow, and the edges of the stack
  for (const [sx, sz] of SLOTS) line(pr(sx, TOP + 0.15, sz), pr(sx, -TOP - 0.15, sz), base * 0.45, 0.5);
  for (const [ex, ez] of [[-HALF, -HALF], [HALF, -HALF], [HALF, HALF], [-HALF, HALF]]) {
    line(pr(ex, TOP, ez), pr(ex, -TOP, ez), base * 0.35, 0.5);
  }

  // layers, bottom (input) to top (output)
  for (let l = 0; l < LAYERS; l++) {
    const yl = TOP - (2 * TOP * l) / (LAYERS - 1);
    const a = lit(yl);
    const tone = a > 0.4 ? hi : ink;
    const corners = [[-HALF, -HALF], [HALF, -HALF], [HALF, HALF], [-HALF, HALF]].map(([x, z]) => pr(x, yl, z));
    ctx.strokeStyle = rgba(tone, base + a * 0.4);
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    corners.forEach((c, i) => (i ? ctx.lineTo(c.x, c.y) : ctx.moveTo(c.x, c.y)));
    ctx.closePath();
    ctx.stroke();
    // the inner mesh
    for (let g = 1; g < GRID - 1; g++) {
      const c = -HALF + (2 * HALF * g) / (GRID - 1);
      line(pr(c, yl, -HALF), pr(c, yl, HALF), base * 0.3 + a * 0.12, 0.5);
      line(pr(-HALF, yl, c), pr(HALF, yl, c), base * 0.3 + a * 0.12, 0.5);
    }
    // points, brighter around the token positions when the layer fires
    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        const x = -HALF + (2 * HALF * i) / (GRID - 1);
        const z = -HALF + (2 * HALF * j) / (GRID - 1);
        let near = 0;
        for (const [sx, sz] of SLOTS) near = Math.max(near, Math.exp(-((x - sx) * (x - sx) + (z - sz) * (z - sz)) / 0.16));
        const p = pr(x, yl, z);
        const d = depth(p.z);
        const glow = a * near;
        dot(p, (0.5 + d * 0.7 + glow * 0.9) * p.s, (dark ? 0.1 + d * 0.42 : 0.07 + d * 0.3) + glow * 0.55, glow > 0.4 ? hi : ink);
      }
    }
    // attention between the positions on this plane, weights fixed per step
    if (a > 0.04) {
      for (let j = 1; j < SLOTS.length; j++) {
        for (let i = 0; i < j; i++) {
          const w = 0.15 + 0.85 * rand(cycle, l, i * 4 + j);
          const from = pr(SLOTS[i][0], yl, SLOTS[i][1]);
          const to = pr(SLOTS[j][0], yl, SLOTS[j][1]);
          if (a > 0.6) line(from, to, (a - 0.6) * w * 0.35, 2.2, hi);
          line(from, to, a * w * 0.6, 0.5 + w * 0.5, hi);
        }
      }
    }
  }

  // tokens: a bright core with a soft halo, riding the rails
  const token = (p: Pt, alpha: number, boost = 0) => {
    if (alpha <= 0.01) return;
    dot(p, (5 + boost * 3) * p.s, alpha * 0.16, hi);
    dot(p, (2.1 + boost * 0.6) * p.s, alpha * 0.9, hi);
  };
  const outFade = 1 - span(-yTok, TOP + 0.12, TOP + 0.38); // the first three stop after the last layer
  const backIn = span(tc, RETURN_AT + 0.8, RETURN_AT + 1.2); // and the next ones show up below
  for (let k = 0; k < 3; k++) {
    const [sx, sz] = SLOTS[k];
    if (tc < RETURN_AT) token(pr(sx, yTok, sz), outFade);
    else token(pr(sx, Y_START, sz), backIn);
  }
  const [ox, oz] = SLOTS[3];
  if (tc < RETURN_AT) {
    const bloom = span(tc, BLOOM_AT, BLOOM_AT + 0.5);
    const p = pr(ox, yTok, oz);
    token(p, 1, bloom * (1 - bloom) * 2);
    if (bloom > 0 && bloom < 1) {
      ctx.strokeStyle = rgba(hi, (1 - bloom) * 0.55);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, (4 + bloom * 16) * p.s, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (tc < RETURN_END) {
    // one full turn around the stack, bulging outwards, down to the input row
    const theta0 = Math.atan2(oz, ox);
    const r0 = Math.hypot(ox, oz);
    const at = (u: number) => {
      const th = theta0 + Math.PI * 2 * u;
      const r = r0 + 0.8 * Math.sin(Math.PI * u);
      return pr(r * Math.cos(th), Y_END + (Y_START - Y_END) * u, r * Math.sin(th));
    };
    const u = ease(span(tc, RETURN_AT, RETURN_END));
    for (let k = 6; k >= 1; k--) {
      const p = at(Math.max(0, u - k * 0.012));
      dot(p, (1.6 - k * 0.18) * p.s, 0.5 - k * 0.07, hi);
    }
    token(at(u), 1);
  } else {
    token(pr(ox, Y_START, oz), 1);
  }
}
