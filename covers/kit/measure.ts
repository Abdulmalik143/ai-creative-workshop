import type { V } from "./math";
export type Box = { x: number; y: number; w: number; h: number };

/** Boxes of elements in authored stage coordinates, measured against the stage root. */
export function measure(root: HTMLElement, els: (HTMLElement | null)[], scale: number): Box[] {
  const rr = root.getBoundingClientRect();
  return els.map((el) => {
    if (!el) return { x: 0, y: 0, w: 0, h: 0 };
    const r = el.getBoundingClientRect();
    return { x: (r.left - rr.left) / scale, y: (r.top - rr.top) / scale, w: r.width / scale, h: r.height / scale };
  });
}
export const center = (b: Box): V => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });
export function nearest(boxes: Box[], p: V): number {
  let best = 0;
  let bd = Infinity;
  boxes.forEach((b, i) => {
    const dx = Math.max(b.x - p.x, 0, p.x - (b.x + b.w));
    const dy = Math.max(b.y - p.y, 0, p.y - (b.y + b.h));
    const c = center(b);
    const d = Math.hypot(dx, dy) * 2 + Math.hypot(c.x - p.x, c.y - p.y) * 0.15;
    if (d < bd) {
      bd = d;
      best = i;
    }
  });
  return best;
}
