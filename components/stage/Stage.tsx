"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type MutableRefObject,
} from "react";

export const STAGE_W = 1920;
export const STAGE_H = 1080;

export type PointerState = { x: number; y: number; inside: boolean };

type StageValue = {
  /** CSS pixels per authored pixel (authored size is 1920x1080) */
  scale: number;
  /** false in gallery thumbnails: covers render one poster frame and stop */
  active: boolean;
  /** bump to replay a cover from t = 0 */
  replay: number;
  /** pointer in authored 1920x1080 coordinates */
  pointer: MutableRefObject<PointerState>;
  reducedMotion: boolean;
};

const StageContext = createContext<StageValue | null>(null);

export function useStage() {
  const v = useContext(StageContext);
  if (!v) throw new Error("useStage must be used inside <Stage>");
  return v;
}

/**
 * A 16:9 stage authored at 1920x1080 and scaled to fit its container.
 * Pointer position is reported in authored coordinates.
 */
export function Stage({
  children,
  active = true,
  replay = 0,
  className = "",
  background = "#000",
}: {
  children: ReactNode;
  active?: boolean;
  replay?: number;
  className?: string;
  background?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pointer = useRef<PointerState>({ x: STAGE_W / 2, y: STAGE_H / 2, inside: false });

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / STAGE_W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const r = hostRef.current!.getBoundingClientRect();
    pointer.current = {
      x: ((e.clientX - r.left) / r.width) * STAGE_W,
      y: ((e.clientY - r.top) / r.height) * STAGE_H,
      inside: true,
    };
  };
  const onLeave = () => {
    pointer.current = { ...pointer.current, inside: false };
  };

  return (
    <StageContext.Provider value={{ scale, active, replay, pointer, reducedMotion }}>
      <div
        ref={hostRef}
        dir="ltr"
        className={`relative aspect-video w-full overflow-hidden ${className}`}
        style={{ background }}
        onPointerMove={active ? onMove : undefined}
        onPointerLeave={active ? onLeave : undefined}
      >
        <div
          dir="rtl"
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transform: `scale(${scale || 0.0001})`,
            visibility: scale ? "visible" : "hidden",
            fontFamily: "var(--font-thmanyah), system-ui, sans-serif",
          }}
        >
          {/* replay key remounts DOM-driven covers so their animations restart */}
          <div key={replay} className="absolute inset-0">
            {children}
          </div>
        </div>
      </div>
    </StageContext.Provider>
  );
}
