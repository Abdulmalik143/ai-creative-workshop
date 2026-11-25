import { asset } from "@/lib/asset";
/* eslint-disable @next/next/no-img-element */
/**
 * The original Rakaya lockup (icon + name): white wordmark + sage ornament, authored for dark grounds.
 * `white` uses the same lockup with every part in white (public/brand/rakaya-white.svg).
 */
export function RakayaLogo({ height = 64, className = "", style, white = false }: { height?: number; className?: string; style?: React.CSSProperties; white?: boolean }) {
  return (
    <img
      src={white ? asset("/brand/rakaya-white.svg") : asset("/brand/rakaya.svg")}
      alt="ركايا"
      height={height}
      style={{ height, width: "auto", ...style }}
      className={className}
      draggable={false}
    />
  );
}
