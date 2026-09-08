// Decorative interface fragments drift through the margins. No controls or mock data.
// They share the existing canvas, timing and reduced-motion handling.
export function drawAmbientPanels(
  ctx: CanvasRenderingContext2D, width: number, height: number, time: number, dark: boolean,
) {
  const compact = width < 900;
  const margin = Math.max(64, (width - 640) / 2);
  const stroke = dark ? "#b6abd7" : "#746985";
  const accent = dark ? "#bba5f5" : "#82709f";
  const panelWidth = compact ? 116 : Math.min(158, margin * 0.66);
  const panelHeight = panelWidth * 0.66;
  const travel = height + panelHeight * 3;
  for (let lane = 0; lane < (compact ? 1 : 2); lane++) {
    const progress = (time * 13 + travel * (lane === 0 ? 0.7 : 0.31)) % travel;
    const y = height + panelHeight * 1.5 - progress;
    const entry = Math.max(0, Math.min(1, (height + panelHeight - y) / 100, (y + panelHeight) / 100));
    const x = compact ? width + 14 : (lane === 0 ? margin * 0.45 : width - margin * 0.45);
    const cycle = Math.floor((time * 13 + travel * (lane === 0 ? 0.7 : 0.31)) / travel);
    const variant = (lane + cycle) % 3;
    ctx.save();
    ctx.translate(x + Math.sin(time * 0.17 + lane) * 9, y);
    ctx.rotate(Math.sin(time * 0.12 + lane * 2) * 0.035);
    ctx.scale(panelWidth / 158, panelWidth / 158);
    ctx.globalAlpha = entry * (compact ? 0.46 : 0.83);
    const surface = ctx.createLinearGradient(-79, -52, 79, 52);
    surface.addColorStop(0, dark ? "rgba(62,55,79,0.64)" : "rgba(255,255,255,0.84)");
    surface.addColorStop(1, dark ? "rgba(24,23,30,0.5)" : "rgba(238,234,243,0.5)");
    ctx.fillStyle = surface;
    ctx.strokeStyle = dark ? "rgba(193,179,225,0.36)" : "rgba(99,85,126,0.3)";
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.roundRect(-79, -52, 158, 104, 9); ctx.fill(); ctx.stroke();
    // Thin window chrome makes the objects read as interfaces, without fake labels.
    ctx.fillStyle = stroke;
    for (let dot = 0; dot < 3; dot++) {
      ctx.beginPath(); ctx.arc(-65 + dot * 7, -39, 1.1, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha *= 0.7;
    ctx.beginPath(); ctx.moveTo(-79, -27); ctx.lineTo(79, -27); ctx.stroke();
    ctx.fillStyle = stroke;
    ctx.fillRect(47, -40, 18, 1.5);
    ctx.globalAlpha /= 0.7;
    if (variant === 0) {
      // Signal editor: a live ribbon with a moving playhead and quiet grid ticks.
      ctx.strokeStyle = dark ? "rgba(190,174,224,0.12)" : "rgba(108,94,135,0.13)";
      for (let row = 0; row < 3; row++) {
        ctx.beginPath(); ctx.moveTo(-64, -8 + row * 17); ctx.lineTo(64, -8 + row * 17); ctx.stroke();
      }
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const x = -64 + i * 1.6;
        const envelope = Math.sin(i / 80 * Math.PI);
        const y = 9 + Math.sin(i * 0.15 - time * 0.9) * Math.cos(i * 0.037 + time * 0.15) * 18 * envelope;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      const playhead = -61 + ((time * 9) % 122);
      ctx.strokeStyle = dark ? "rgba(207,198,230,0.28)" : "rgba(94,78,122,0.3)";
      ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(playhead, -17); ctx.lineTo(playhead, 36); ctx.stroke();
    } else if (variant === 1) {
      // Node editor: a pulse travels between compact, connected modules.
      const nodes = [[-53, 12], [-5, -8], [49, 14], [-2, 31]];
      ctx.strokeStyle = dark ? "rgba(179,162,218,0.44)" : "rgba(109,94,138,0.4)";
      ctx.lineWidth = 0.9;
      for (let i = 1; i < nodes.length; i++) {
        const [ax, ay] = nodes[i - 1];
        const [bx, by] = nodes[i];
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.bezierCurveTo(ax + 24, ay, bx - 24, by, bx, by); ctx.stroke();
      }
      for (let i = 0; i < nodes.length; i++) {
        const [x, y] = nodes[i];
        ctx.fillStyle = dark ? "#282431" : "#f6f3fa";
        ctx.strokeStyle = i === Math.floor(time * 0.6) % nodes.length ? accent : stroke;
        ctx.beginPath(); ctx.roundRect(x - 10, y - 6, 20, 12, 3); ctx.fill(); ctx.stroke();
        ctx.fillStyle = accent;
        ctx.fillRect(x - 4, y - 0.6, 8, 1.2);
      }
    } else {
      // A composition fragment: selection brackets surround a softly breathing shape.
      ctx.strokeStyle = dark ? "rgba(183,166,219,0.25)" : "rgba(111,95,140,0.25)";
      ctx.setLineDash([2, 4]);
      ctx.strokeRect(-48, -15, 65, 51);
      ctx.setLineDash([]);
      ctx.strokeStyle = accent;
      for (const x of [-48, 17]) for (const y of [-15, 36]) ctx.strokeRect(x - 1.5, y - 1.5, 3, 3);
      ctx.fillStyle = dark ? "rgba(177,151,224,0.2)" : "rgba(150,127,188,0.18)";
      ctx.beginPath(); ctx.ellipse(-16, 10, 20 + Math.sin(time * 0.6) * 3, 16, time * 0.12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = stroke;
      for (let row = 0; row < 4; row++) ctx.fillRect(32, -10 + row * 12, row % 2 ? 22 : 31, 1.5);
    }
    ctx.restore();
  }
}
