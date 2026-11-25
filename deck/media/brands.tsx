"use client";

/* eslint-disable @next/next/no-img-element */
import { BlenderIcon, PinterestIcon, DribbbleIcon, BehanceIcon } from "@hugeicons/core-free-icons";
import { Icon, type IconSvgElement } from "../kit/ui";

/**
 * Product marks used on slides 11, 12, 15 and 16.
 * Pinterest and Mobbin use their official files (public/deck/logos/platforms/). The rest show a stand-in:
 * its Hugeicons glyph or a lettered tile in the product's colours. Drop the official file at the `logo` path
 * (public/deck/logos/<id>.svg) and set `logo` below: every slide picks it up.
 */
export type Brand = {
  id: string;
  name: string;
  /** official logo file, once provided (public path) */
  logo?: string;
  /** draw the logo file on a tile of this colour (same size and radius as the stand-in tiles) */
  logoTile?: string;
  tile: string;
  fg: string;
  icon?: IconSvgElement;
  letters?: string;
  kind: "glyph" | "letters" | "adobe" | "figma" | "canva";
};

export const BRANDS: Record<string, Brand> = {
  figma: { id: "figma", name: "Figma", tile: "#1e1e1e", fg: "#ffffff", kind: "figma" },
  canva: { id: "canva", name: "Canva", tile: "#7d2ae8", fg: "#ffffff", kind: "canva" },
  blender: { id: "blender", name: "Blender", tile: "#1d2733", fg: "#e87d0d", icon: BlenderIcon, kind: "glyph" },
  davinci: { id: "davinci", name: "DaVinci Resolve", tile: "#1b1b1f", fg: "#e8e8ea", letters: "DR", kind: "letters" },
  photoshop: { id: "photoshop", name: "Adobe Photoshop", tile: "#001e36", fg: "#31a8ff", letters: "Ps", kind: "adobe" },
  illustrator: { id: "illustrator", name: "Adobe Illustrator", tile: "#330000", fg: "#ff9a00", letters: "Ai", kind: "adobe" },
  premiere: { id: "premiere", name: "Adobe Premiere", tile: "#00005b", fg: "#9999ff", letters: "Pr", kind: "adobe" },
  aftereffects: { id: "aftereffects", name: "Adobe After Effects", tile: "#00005b", fg: "#9999ff", letters: "Ae", kind: "adobe" },
  // official marks, slide 16 (2026-11-24): see the comment inside each file for its source
  pinterest: { id: "pinterest", name: "Pinterest", logo: "/deck/logos/platforms/pinterest.svg", tile: "#e60023", fg: "#ffffff", icon: PinterestIcon, kind: "glyph" },
  dribbble: { id: "dribbble", name: "Dribbble", tile: "#ea4c89", fg: "#ffffff", icon: DribbbleIcon, kind: "glyph" },
  behance: { id: "behance", name: "Behance", tile: "#1769ff", fg: "#ffffff", icon: BehanceIcon, kind: "glyph" },
  // owner, 2026-11-24: the black official mark on a white tile
  mobbin: { id: "mobbin", name: "Mobbin", logo: "/deck/logos/platforms/mobbin.svg", logoTile: "#FFFFFF", tile: "#f4f4f5", fg: "#0b0b0c", letters: "M", kind: "letters" },
};

/** A product's mark at a given size. Uses the official file when one is configured. */
export function BrandMark({ id, size = 120, radius }: { id: string; size?: number; radius?: number }) {
  const b = BRANDS[id];
  const r = radius ?? size * 0.24;
  if (b.logo && b.logoTile)
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size, borderRadius: r, background: b.logoTile }} role="img" aria-label={b.name}>
        <img src={b.logo} alt="" width={size * 0.62} height={size * 0.62} style={{ width: size * 0.62, height: size * 0.62, objectFit: "contain" }} draggable={false} />
      </div>
    );
  if (b.logo) return <img src={b.logo} alt={b.name} width={size} height={size} style={{ width: size, height: size, objectFit: "contain" }} draggable={false} />;
  const box = { width: size, height: size, borderRadius: r, background: b.tile } as const;
  if (b.kind === "figma")
    return (
      <div className="flex items-center justify-center" style={box} role="img" aria-label={b.name}>
        <svg width={size * 0.42} height={size * 0.63} viewBox="0 0 38 57" aria-hidden>
          <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1abcfe" />
          <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0acf83" />
          <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#ff7262" />
          <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#f24e1e" />
          <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#a259ff" />
        </svg>
      </div>
    );
  if (b.kind === "canva")
    return (
      <div className="flex items-center justify-center" style={{ ...box, background: "linear-gradient(135deg,#00c4cc 0%,#6420ff 55%,#7d2ae8 100%)", borderRadius: "50%" }} role="img" aria-label={b.name}>
        <span dir="ltr" className="font-black italic leading-none" style={{ color: b.fg, fontSize: size * 0.28, fontFamily: "Georgia, 'Times New Roman', serif" }}>
          Canva
        </span>
      </div>
    );
  if (b.kind === "adobe")
    return (
      <div className="flex items-center justify-center" style={{ ...box, boxShadow: `inset 0 0 0 ${Math.max(2, size * 0.035)}px ${b.fg}` }} role="img" aria-label={b.name}>
        <span dir="ltr" className="font-bold leading-none" style={{ color: b.fg, fontSize: size * 0.44, fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", letterSpacing: "-0.02em" }}>
          {b.letters}
        </span>
      </div>
    );
  if (b.kind === "glyph" && b.icon)
    return (
      <div className="flex items-center justify-center" style={box} role="img" aria-label={b.name}>
        <Icon icon={b.icon} size={size * 0.56} color={b.fg} stroke={1.8} />
      </div>
    );
  return (
    <div className="flex items-center justify-center" style={box} role="img" aria-label={b.name}>
      <span dir="ltr" className="font-black leading-none" style={{ color: b.fg, fontSize: size * (b.letters && b.letters.length > 1 ? 0.36 : 0.5), fontFamily: "system-ui, -apple-system, sans-serif" }}>
        {b.letters}
      </span>
    </div>
  );
}
