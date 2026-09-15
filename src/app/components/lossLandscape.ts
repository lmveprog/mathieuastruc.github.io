// the training side of the picture, bottom left: a wireframe loss surface in the
// same space as the clouds and the transformer (same camera, depth fade, ink),
// with an optimizer rolling down it. gradient descent with momentum from a new
// start every cycle, a short trail behind it, a bloom when it settles. no labels.

const N = 13; // grid resolution of the surface
const STEPS = 80; // optimizer steps per descent
const CYCLE = 7.5;
const APPEAR = 0.5;
const SETTLE = 5.0; // descent runs from APPEAR to SETTLE
const FADE_FROM = 6.3;

type Ink = [number, number, number];
type Pt = { x: number; y: number; z: number; s: number };

function rand(a: number, b: number, c: number) {
  const x = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453;
  return x - Math.floor(x);
}
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const span = (t: number, from: number, to: number) => clamp((t - from) / (to - from), 0, 1);
const rgba = (c: Ink, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const depth = (z: number) => clamp((1.3 - z) / 2.6, 0, 1);

// a bowl with one deep valley, a shallow trap and a bit of ripple
const loss = (x: number, z: number) =>
  0.42 * (x * x + z * z) -
  0.62 * Math.exp(-((x - 0.32) ** 2 + (z + 0.28) ** 2) / 0.2) -
  0.22 * Math.exp(-((x + 0.52) ** 2 + (z - 0.48) ** 2) / 0.07) +
  0.09 * Math.sin(3.1 * x + 0.4) * Math.sin(2.7 * z);
// +y is down on screen, so high loss goes up
const surfaceY = (x: number, z: number) => 0.15 - loss(x, z) * 0.58;

let cached: { cycle: number; path: [number, number][] } = { cycle: -1, path: [] };

function descent(cycle: number) {
  if (cached.cycle === cycle) return cached.path;
  const angle = rand(cycle, 3.1, 7.7) * Math.PI * 2;
  let x = Math.cos(angle) * 0.95;
  let z = Math.sin(angle) * 0.95;
  let vx = 0;
  let vz = 0;
  const e = 0.002;
  const path: [number, number][] = [[x, z]];
  for (let i = 0; i < STEPS; i++) {
    const gx = (loss(x + e, z) - loss(x - e, z)) / (2 * e);
    const gz = (loss(x, z + e) - loss(x, z - e)) / (2 * e);
    vx = vx * 0.88 - gx * 0.006;
    vz = vz * 0.88 - gz * 0.006;
    x = clamp(x + vx, -1, 1);
    z = clamp(z + vz, -1, 1);
    path.push([x, z]);
  }
  cached = { cycle, path };
  return path;
}

export function drawLossLandscape(
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
  const size = Math.min(112, width * 0.075);
  const cx = width * 0.125;
  const cy = height * 0.7 - Math.sin(scroll * 0.45) * 18;
  const rot = time * 0.12 + 2.1 + pointerX * 0.16;
  const tilt = 0.62 + Math.sin(time * 0.09) * 0.06 + pointerY * 0.12;
  const ink: Ink = dark ? [177, 165, 219] : [86, 83, 115];
  const hi: Ink = dark ? [224, 215, 255] : [104, 84, 158];
  const base = dark ? 0.17 : 0.16;

  // start mid-descent so the reduced-motion still frame shows the idea
  const shifted = time + 3.2;
  const cycle = Math.floor(shifted / CYCLE);
  const tc = shifted - cycle * CYCLE;

  const pr = (px: number, py: number, pz: number): Pt => {
    const x1 = px * Math.cos(rot) + pz * Math.sin(rot);
    const z1 = -px * Math.sin(rot) + pz * Math.cos(rot);
    const y1 = py * Math.cos(tilt) - z1 * Math.sin(tilt);
    const z2 = py * Math.sin(tilt) + z1 * Math.cos(tilt);
    const s = 3.4 / (3.4 + z2);
    return { x: cx + x1 * size * s, y: cy + y1 * size * s, z: z2, s };
  };
  const dot = (p: Pt, r: number, alpha: number, c: Ink = ink) => {
    ctx.fillStyle = rgba(c, alpha);
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  // where the optimizer is right now
  const path = descent(cycle);
  const progress = span(tc, APPEAR, SETTLE) * STEPS;
  const k = Math.min(STEPS - 1, Math.floor(progress));
  const f = progress - k;
  const bx = path[k][0] + (path[k + 1][0] - path[k][0]) * f;
  const bz = path[k][1] + (path[k + 1][1] - path[k][1]) * f;
  const presence = span(tc, 0, APPEAR) * (1 - span(tc, FADE_FROM, CYCLE - 0.1));

  // the surface: rows and columns of the grid, lit around the optimizer
  const grid: Pt[][] = [];
  const glow: number[][] = [];
  for (let i = 0; i < N; i++) {
    grid.push([]);
    glow.push([]);
    for (let j = 0; j < N; j++) {
      const x = -1 + (2 * i) / (N - 1);
      const z = -1 + (2 * j) / (N - 1);
      grid[i].push(pr(x, surfaceY(x, z), z));
      glow[i].push(Math.exp(-((x - bx) ** 2 + (z - bz) ** 2) / 0.09) * presence);
    }
  }
  const segment = (a: Pt, b: Pt, ga: number, gb: number) => {
    const g = (ga + gb) / 2;
    const d = (depth(a.z) + depth(b.z)) / 2;
    ctx.strokeStyle = rgba(g > 0.35 ? hi : ink, base * (0.45 + d * 0.85) + g * 0.3);
    ctx.lineWidth = 0.5 + g * 0.4;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  };
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N - 1; j++) {
      segment(grid[i][j], grid[i][j + 1], glow[i][j], glow[i][j + 1]);
      segment(grid[j][i], grid[j + 1][i], glow[j][i], glow[j + 1][i]);
    }
  }
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const p = grid[i][j];
      const d = depth(p.z);
      const g = glow[i][j];
      dot(p, (0.45 + d * 0.6 + g * 0.8) * p.s, (dark ? 0.1 + d * 0.4 : 0.08 + d * 0.3) + g * 0.45, g > 0.35 ? hi : ink);
    }
  }

  if (presence <= 0.01) return;
  const onSurface = (x: number, z: number) => pr(x, surfaceY(x, z) - 0.05, z);

  // the trail it leaves, fading towards the start
  const trail = Math.min(k, 26);
  for (let s = trail; s >= 1; s--) {
    const [tx, tz] = path[k - s + 1];
    dot(onSurface(tx, tz), (1.5 - s * 0.03) * 0.8, presence * (0.5 - s * 0.017), hi);
  }

  // the optimizer: halo + core, and a ring when it settles
  const ball = onSurface(bx, bz);
  dot(ball, 5 * ball.s, presence * 0.16, hi);
  dot(ball, 2.1 * ball.s, presence * 0.9, hi);
  const bloom = span(tc, SETTLE, SETTLE + 0.6);
  if (bloom > 0 && bloom < 1) {
    ctx.strokeStyle = rgba(hi, (1 - bloom) * 0.55 * presence);
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, (4 + bloom * 16) * ball.s, 0, Math.PI * 2);
    ctx.stroke();
  }
}
