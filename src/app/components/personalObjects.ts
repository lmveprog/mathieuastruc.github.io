// Small original line sculptures tied to Mathieu's interests and international path.
// Rendered in the existing animation loop, with the same content-protection mask.
export function drawPersonalObjects(
  ctx: CanvasRenderingContext2D, width: number, height: number, time: number, dark: boolean,
) {
  const narrow = width < 900;
  const margin = Math.max(60, (width - 640) / 2);
  const left = margin * 0.48;
  const right = width - margin * 0.48;
  const ink = dark ? "#c2b5ed" : "#696078";

  // A gently bouncing, rotating basketball. Its shadow stays on the same plane.
  ctx.save();
  const bx = narrow ? width - 8 : left + Math.sin(time * 0.22) * 16;
  const floor = height * 0.79;
  const bounce = Math.abs(Math.sin(time * 0.8)) * 28;
  const radius = narrow ? 18 : 26;
  ctx.globalAlpha = narrow ? 0.42 : 0.78;
  ctx.fillStyle = dark ? "rgba(212,160,112,0.1)" : "rgba(127,88,52,0.08)";
  ctx.beginPath();
  ctx.ellipse(bx, floor + radius + 10, radius * (0.8 - bounce / 100), 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.translate(bx, floor - bounce);
  ctx.rotate(time * 0.18);
  const shade = ctx.createRadialGradient(-9, -11, 0, 0, 0, radius * 1.5);
  shade.addColorStop(0, dark ? "rgba(231,170,112,0.22)" : "rgba(197,116,49,0.14)");
  shade.addColorStop(1, "rgba(171,100,49,0.02)");
  ctx.fillStyle = shade;
  ctx.strokeStyle = dark ? "#c89a73" : "#996c48";
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-radius, 0); ctx.lineTo(radius, 0);
  ctx.moveTo(0, -radius); ctx.lineTo(0, radius);
  ctx.moveTo(-radius * 0.64, -radius * 0.77);
  ctx.bezierCurveTo(radius * 0.05, -radius * 0.4, radius * 0.05, radius * 0.4, -radius * 0.64, radius * 0.77);
  ctx.moveTo(radius * 0.64, -radius * 0.77);
  ctx.bezierCurveTo(-radius * 0.05, -radius * 0.4, -radius * 0.05, radius * 0.4, radius * 0.64, radius * 0.77);
  ctx.stroke();
  ctx.restore();
  if (narrow) return;

  // A friendly research robot: a slow nod and a tiny signal at the antenna.
  ctx.save();
  ctx.translate(right + Math.sin(time * 0.18) * 14, height * 0.23 + Math.sin(time * 0.6) * 9);
  ctx.rotate(Math.sin(time * 0.3) * 0.08);
  ctx.globalAlpha = 0.68;
  ctx.strokeStyle = ink;
  ctx.fillStyle = dark ? "rgba(162,146,211,0.07)" : "rgba(109,96,142,0.04)";
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.roundRect(-23, -17, 46, 34, 9); ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -17); ctx.lineTo(0, -27);
  ctx.moveTo(-27, -5); ctx.lineTo(-27, 5);
  ctx.moveTo(27, -5); ctx.lineTo(27, 5);
  ctx.moveTo(-7, 9); ctx.quadraticCurveTo(0, 12, 7, 9);
  ctx.stroke();
  ctx.fillStyle = ink;
  for (const x of [-9, 9]) {
    ctx.beginPath(); ctx.ellipse(x, -2, 2.3, 3.3, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 0.35 + (Math.sin(time * 1.1) + 1) * 0.18;
  ctx.beginPath(); ctx.arc(0, -29, 2.3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // A folded paper plane follows a small curved route, never crossing the copy.
  ctx.save();
  ctx.translate(left + Math.sin(time * 0.24 + 1) * 22, height * 0.085 + Math.cos(time * 0.3) * 12);
  ctx.rotate(-0.3 + Math.cos(time * 0.24) * 0.13);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.1;
  ctx.globalAlpha = 0.58;
  ctx.fillStyle = dark ? "rgba(181,171,211,0.08)" : "rgba(96,91,108,0.04)";
  ctx.beginPath();
  ctx.moveTo(25, -15); ctx.lineTo(-24, -2); ctx.lineTo(-6, 5); ctx.lineTo(0, 23); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-6, 5); ctx.lineTo(25, -15); ctx.lineTo(3, 8); ctx.lineTo(0, 23); ctx.stroke();
  ctx.globalAlpha = 0.2;
  ctx.setLineDash([2, 6]);
  ctx.beginPath(); ctx.moveTo(-30, 9); ctx.bezierCurveTo(-50, 20, -57, -9, -78, 3); ctx.stroke();
  ctx.restore();
}
