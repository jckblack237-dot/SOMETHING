/** Clean axis ticks covering [min, max] — returns the padded domain too. */
export function niceTicks(min: number, max: number, count = 4): { ticks: number[]; lo: number; hi: number } {
  if (min === max) {
    const bump = Math.abs(min) * 0.05 || 1;
    min -= bump;
    max += bump;
  }
  const raw = (max - min) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = mag * (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10);
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(v);
  return { ticks, lo, hi };
}

type Pt = [number, number];

/** Catmull-Rom → cubic bézier smoothing for a gentle, non-overshooting line. */
export function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return '';
  if (pts.length === 2) return `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]}`;
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

export function areaPath(pts: Pt[], baseY: number): string {
  if (pts.length < 2) return '';
  return `${smoothPath(pts)} L${pts[pts.length - 1][0]},${baseY} L${pts[0][0]},${baseY} Z`;
}

/** Column with a 4px-rounded cap and a square baseline. */
export function roundedColumn(x: number, y: number, w: number, h: number, r = 4): string {
  const rr = Math.min(r, h / 2, w / 2);
  return `M${x},${y + h} L${x},${y + rr} Q${x},${y} ${x + rr},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h} Z`;
}

/** Donut arc segment path (stroked). Angles in radians, 0 = 12 o'clock, clockwise. */
export function donutArc(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p = (a: number): Pt => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M${x0},${y0} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1},${y1}`;
}
