const paths = {
  underline: "M4 34C58 15 203 10 314 18M127 33c63-8 133-12 175-9",
  orbit: "M286 20C192 1 76 24 31 78c-44 52 2 95 100 106 87 10 201-27 216-82 7-27-19-55-74-66M45 124c35 39 139 47 217 24",
  arrow: "M16 15c18 70 63 96 129 94m-35-18c16 5 30 12 35 18-9 10-21 16-29 24",
  spark: "M30 4l4 20 21 6-21 4-6 21-5-21L4 28l20-5zM65 4l2 7 8 2-8 2-2 8-3-7-7-3 8-2z",
  bracket: "M32 4C16 5 9 11 8 31L6 76c-1 21 6 28 25 30M89 5c16 2 24 6 25 24l2 54c0 15-7 21-27 23",
  sweep: "M6 82C79 72 156 22 236 20c46-1 72 14 65 31-12 25-97 41-138 33m7-11-11 12 15 7",
} as const;

const boxes = {
  underline: "0 0 320 45",
  orbit: "0 0 355 195",
  arrow: "0 0 156 146",
  spark: "0 0 80 60",
  bracket: "0 0 122 112",
  sweep: "0 0 312 106",
} as const;

export function Sketch({ mark, className = "" }: { mark: keyof typeof paths; className?: string }) {
  return (
    <svg className={`sketch-mark ${className}`} viewBox={boxes[mark]} fill="none" aria-hidden="true">
      <path d={paths[mark]} pathLength="1" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
