// a tiny transformer running in the right margin. tokens come in at the bottom,
// climb through three causal attention blocks, the head picks the next token
// and feeds it back into the context window. thin wireframe lines only, so it
// stays quiet behind the page. shares the particle canvas, clock and colours.

const SEQ = ["ma", "thi", "eu", "build", "s", "the", "fut", "ure", "with", "ai", "."];
const SLOT_X = [30, 70, 110, 150];
const STEP = 40;
const W = 180;
const H = 320;

// one generation step, in seconds
const CYCLE = 6.4;
const SWEEP = 3.0; // the pulse climbs from the input row to the head
const HEAD_AT = 3.0; // softmax bars grow
const OUT_AT = 3.4; // next token pops out
const TRAVEL_AT = 3.65; // and rides the loop back down to the context
const TRAVEL_END = 4.85;
const SHIFT_AT = 4.3; // the window slides one slot to the left meanwhile
const REST_AT = 5.1; // afterglow fades, then it starts over

const BLOCK_H = 46;
const BLOCK_GAP = 12;
const BLOCK_X = 14;
const BLOCK_W = 152;
const BLOCK0_BOTTOM = 232;
const Y_IN = 292;
const Y_EMB = 258;
const Y_OUT = 14;
const RESID_X = 8;
const LOOP_X = 172;
const BAR_RIGHT = 160;

type Ink = [number, number, number];

// deterministic noise so every generation step looks different but stable
function rand(a: number, b: number, c: number, d = 0) {
  const x = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719 + d * 4.13) * 43758.5453;
  return x - Math.floor(x);
}
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const span = (t: number, from: number, to: number) => clamp01((t - from) / (to - from));
const rgba = (c: Ink, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const blockBottom = (b: number) => BLOCK0_BOTTOM - b * (BLOCK_H + BLOCK_GAP);

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
  const margin = Math.max(0.04, (width - 720) / 2 / width) * width;
  const scale = Math.min(1, (margin * 0.7) / W, (height * 0.46) / H);
  if (scale < 0.55) return;

  const ink: Ink = dark ? [177, 165, 219] : [86, 83, 115];
  const hi: Ink = dark ? [218, 208, 255] : [104, 84, 158];
  const base = dark ? 0.26 : 0.28;
  const cycle = Math.floor(time / CYCLE);
  const tc = time - cycle * CYCLE;

  // the pulse is a soft band of light sweeping upwards; everything it has
  // passed keeps a bit of afterglow until the step is over
  const sweep = span(tc, 0, SWEEP);
  const pulseY = Y_IN + 8 - (Y_IN + 8 - 40) * (0.5 - 0.5 * Math.cos(sweep * Math.PI));
  const afterglow = 0.32 * (1 - span(tc, REST_AT, CYCLE - 0.2));
  const lit = (y: number, sigma = 14) => {
    const glow = Math.exp(-((pulseY - y) * (pulseY - y)) / (2 * sigma * sigma));
    return Math.min(1, glow + (pulseY < y ? afterglow : 0));
  };

  ctx.save();
  ctx.translate(
    width * 0.88 - (W / 2) * scale + pointerX * 8,
    height * 0.07 + pointerY * 6 + Math.sin(scroll * 0.45) * 10,
  );
  ctx.scale(scale, scale);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.font = "7px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const line = (x1: number, y1: number, x2: number, y2: number, a: number, w = 0.8, c: Ink = ink) => {
    ctx.strokeStyle = rgba(c, a);
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };
  // a wire that lights up when the pulse goes through it
  const wire = (x1: number, y1: number, x2: number, y2: number, l: number, weight = 1) => {
    if (l > 0.3) line(x1, y1, x2, y2, (l - 0.3) * 0.35 * weight, 2.6, hi);
    line(x1, y1, x2, y2, (base * 0.9 + l * 0.7) * weight, 0.7 + l * 0.5 + weight * 0.3, l > 0.35 ? hi : ink);
  };
  const node = (x: number, y: number, l: number) => {
    ctx.fillStyle = rgba(l > 0.35 ? hi : ink, base + 0.15 + l * 0.55);
    ctx.beginPath();
    ctx.arc(x, y, 1.7 + l * 0.6, 0, Math.PI * 2);
    ctx.fill();
  };
  const token = (x: number, y: number, label: string, a: number, l: number) => {
    if (a <= 0.01) return;
    ctx.strokeStyle = rgba(l > 0.35 ? hi : ink, a * (base + 0.1 + l * 0.5));
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.roundRect(x - 14, y - 8, 28, 16, 3);
    ctx.stroke();
    ctx.fillStyle = rgba(ink, a * (base + 0.22 + l * 0.5));
    ctx.fillText(label, x, y + 0.5);
  };
  // an embedding vector: five little cells, values fixed per token
  const strip = (x: number, tokenIndex: number, a: number) => {
    const l = lit(Y_EMB);
    ctx.strokeStyle = rgba(ink, a * base * 0.6);
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.roundRect(x - 3.5, Y_EMB - 9, 7, 18, 1.5);
    ctx.stroke();
    for (let c = 0; c < 5; c++) {
      ctx.fillStyle = rgba(ink, a * (0.15 + 0.85 * rand(tokenIndex, c, 5)) * (base + 0.1 + l * 0.6));
      ctx.fillRect(x - 2.5, Y_EMB - 7.9 + c * 3.3, 5, 2.6);
    }
  };

  // corner brackets, a nod to the frames on unaite
  ctx.strokeStyle = rgba(ink, base * 0.8);
  ctx.lineWidth = 0.8;
  for (const [x, y, dx, dy] of [[-6, -4, 1, 1], [W + 6, -4, -1, 1], [-6, H - 8, 1, -1], [W + 6, H - 8, -1, -1]]) {
    ctx.beginPath();
    ctx.moveTo(x + dx * 8, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy * 8);
    ctx.stroke();
  }

  // the feedback loop the generated token rides on
  ctx.strokeStyle = rgba(ink, base * 0.55);
  ctx.lineWidth = 0.7;
  ctx.setLineDash([2, 3]);
  ctx.beginPath();
  ctx.moveTo(SLOT_X[3] + 14, Y_OUT);
  ctx.arcTo(LOOP_X, Y_OUT, LOOP_X, Y_OUT + 10, 6);
  ctx.arcTo(LOOP_X, Y_IN, LOOP_X - 10, Y_IN, 6);
  ctx.lineTo(SLOT_X[3] + 14, Y_IN);
  ctx.stroke();
  ctx.setLineDash([]);

  // context window: four tokens and their embeddings. after a step they slide
  // one slot to the left and the oldest one drops out
  const advanced = tc >= TRAVEL_END;
  const shift = advanced ? 0 : ease(span(tc, SHIFT_AT, TRAVEL_END));
  const first = advanced ? cycle + 1 : cycle;
  for (let k = 0; k < SLOT_X.length; k++) {
    const x = SLOT_X[k] - STEP * shift;
    const a = k === 0 ? 1 - shift : 1;
    const ti = first + k;
    token(x, Y_IN, SEQ[ti % SEQ.length], a, lit(Y_IN));
    wire(x, Y_IN - 8, x, Y_EMB + 9, lit(Y_IN - 8.5) * a, a);
    strip(x, ti, a);
    wire(x, Y_EMB - 9, x, blockBottom(0) - 7, lit((Y_EMB - 9 + blockBottom(0) - 7) / 2, 12) * a, a);
  }

  // three decoder blocks, bottom to top
  for (let b = 0; b < 3; b++) {
    const bottom = blockBottom(b);
    const top = bottom - BLOCK_H;
    const nodeB = bottom - 7;
    const nodeT = top + 7;
    const inside = lit((top + bottom) / 2, 26);
    ctx.strokeStyle = rgba(ink, base + inside * 0.22);
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.roundRect(BLOCK_X, top, BLOCK_W, BLOCK_H, 6);
    ctx.stroke();

    // residual path around the block
    const lr = lit((nodeB + nodeT) / 2, 20);
    line(RESID_X, nodeB, RESID_X, nodeT, base * 0.75 + lr * 0.3, 0.7);
    line(RESID_X, nodeB, BLOCK_X, nodeB, base * 0.6 + lr * 0.2, 0.6);
    line(RESID_X, nodeT, BLOCK_X, nodeT, base * 0.6 + lr * 0.2, 0.6);
    ctx.strokeStyle = rgba(ink, base + lr * 0.3);
    ctx.beginPath();
    ctx.arc(RESID_X, nodeT, 2, 0, Math.PI * 2);
    ctx.stroke();

    // causal attention: query j only looks at keys i <= j
    const lmid = lit((nodeB + nodeT) / 2, 18);
    for (let j = 0; j < SLOT_X.length; j++) {
      const logits: number[] = [];
      let sum = 0;
      for (let i = 0; i <= j; i++) {
        const e = Math.exp(2.4 * (rand(cycle, b * 7 + j, i) - 0.5));
        logits.push(e);
        sum += e;
      }
      for (let i = 0; i <= j; i++) {
        const w = logits[i] / sum;
        wire(SLOT_X[i], nodeB, SLOT_X[j], nodeT, lmid, 0.25 + w * 0.85);
      }
    }
    for (const x of SLOT_X) {
      node(x, nodeB, lit(nodeB));
      node(x, nodeT, lit(nodeT));
    }

    // up to the next block, or to the head for the last position
    if (b < 2) {
      const nextB = blockBottom(b + 1) - 7;
      for (const x of SLOT_X) wire(x, nodeT, x, nextB, lit((nodeT + nextB) / 2, 12));
    } else {
      for (let k = 0; k < 3; k++) line(SLOT_X[k], nodeT, SLOT_X[k], nodeT - 8, base * 0.6, 0.6);
      wire(SLOT_X[3], nodeT, SLOT_X[3], 63, lit((nodeT + 63) / 2, 12));
    }
  }

  // the head: five logits, softmax, the winner becomes the next token
  const head = ease(span(tc, HEAD_AT, HEAD_AT + 0.5)) * (1 - span(tc, REST_AT, CYCLE - 0.2));
  const win = Math.floor(rand(cycle, 9, 1) * 5);
  line(BAR_RIGHT + 1, 27, BAR_RIGHT + 1, 61, base * 0.8, 0.7);
  for (let i = 0; i < 5; i++) {
    const p = i === win ? 0.55 + rand(cycle, i, 2) * 0.35 : 0.06 + rand(cycle, i, 2) * 0.3;
    const len = (4 + 40 * p) * head;
    if (len < 0.5) continue;
    const y = 30 + i * 6.5;
    if (i === win) line(BAR_RIGHT, y, BAR_RIGHT - len, y, 0.25 + 0.55 * head, 2.4, hi);
    else line(BAR_RIGHT, y, BAR_RIGHT - len, y, base + 0.25 * head, 2.2);
  }

  // the generated token rides the loop back into the window
  if (tc >= OUT_AT && tc < TRAVEL_END) {
    const appear = span(tc, OUT_AT, OUT_AT + 0.25);
    const d = ease(span(tc, TRAVEL_AT, TRAVEL_END)) * 322;
    let x: number;
    let y: number;
    if (d < 22) { x = SLOT_X[3] + d; y = Y_OUT; }
    else if (d < 300) { x = LOOP_X; y = Y_OUT + (d - 22); }
    else { x = LOOP_X - (d - 300); y = Y_IN; }
    if (appear < 1) {
      ctx.strokeStyle = rgba(hi, (1 - appear) * 0.5);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(SLOT_X[3], Y_OUT, 9 + appear * 12, 0, Math.PI * 2);
      ctx.stroke();
    }
    token(x, y, SEQ[(cycle + 4) % SEQ.length], appear, 1);
  }

  ctx.restore();
}
