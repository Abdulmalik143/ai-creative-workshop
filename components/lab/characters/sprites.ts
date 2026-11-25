/**
 * Character Lab: ten original male characters drawn as pixel art on one shared grid.
 *
 * Every character is painted on the same 40x56 grid and shown at the same scale, so pixel density
 * and display size are identical across the set. Shapes are painted with flat fills; a 1px dark
 * outline is added automatically around every silhouette (the Pinterest reference's look), and an
 * optional 1px sage rim (the same rim Wamda uses) keeps dark clothing readable on the ink slides.
 *
 * Colour rules, taken from the deck identity in ../tokens.ts:
 * - clothes live in the identity's neutrals: ink/charcoal, sage, mist, and the ASCII background's teal;
 * - orange is the identity's one accent, so each character carries exactly one small orange detail.
 */
import { T } from "../tokens";

export const CHAR_W = 40;
export const CHAR_H = 56;

/** World palette shared by every character. Single-letter keys; characters add skin/hair keys on top. */
const WORLD: Record<string, string> = {
  k: "#0b1114", // inner line
  i: "#0e1316", // iris / pupils
  W: T.mist, // white fabric, eye whites
  w: "#c8d3d3", // white fabric shade (sage-tinted)
  v: "#93a3a5", // deep fabric shade
  g: T.sage,
  G: "#8a9c9f",
  q: "#5b8b92", // teal from the sage ASCII palette
  T: "#35585e",
  t: "#4e6166", // slate
  c: "#2a3438", // charcoal
  C: "#3c494f",
  n: "#161d20", // near-black fabric
  L: "#6f8a8e", // lens / screen reflection
  o: T.orange,
  O: T.orangeSoft,
  d: T.orangeDeep,
  m: "#6a2f25", // mouth
};

export type Character = {
  id: string;
  name: string;
  /** a short line for the card */
  tagline: string;
  /** what makes him readable from across the room */
  look: string;
  /** the identity's orange, used once */
  accent: string;
  group: "saudi" | "free";
  /** the two Saudi options spell out how they differ */
  contrast?: { face: string; stance: string; clothes: string };
  rows: string[];
  palette: Record<string, string>;
};

/* ------------------------------------------------------------------ painter */

function painter() {
  const g: string[][] = Array.from({ length: CHAR_H }, () => Array<string>(CHAR_W).fill("."));
  let ox = 0;
  let oy = 0;
  const p = (x: number, y: number, c: string) => {
    x += ox;
    y += oy;
    if (x >= 0 && x < CHAR_W && y >= 0 && y < CHAR_H) g[y][x] = c;
  };
  const r = (x: number, y: number, w: number, h: number, c: string) => {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) p(x + i, y + j, c);
  };
  /** rect plus its mirror across the figure's centre line (between x=19 and x=20) */
  const m = (x: number, y: number, w: number, h: number, c: string) => {
    r(x, y, w, h, c);
    r(CHAR_W - x - w, y, w, h, c);
  };
  const pm = (x: number, y: number, c: string) => {
    p(x, y, c);
    p(CHAR_W - 1 - x, y, c);
  };
  /** centred row of half-width a */
  const row = (y: number, a: number, c: string) => r(20 - a, y, 2 * a, 1, c);
  /** centred rows, one half-width per row */
  const prof = (y: number, as: number[], c: string) => as.forEach((a, k) => row(y + k, a, c));
  /** stamp: ' ' and '.' are transparent */
  const s = (x: number, y: number, lines: string[]) =>
    lines.forEach((ln, j) => {
      for (let i = 0; i < ln.length; i++) if (ln[i] !== " " && ln[i] !== ".") p(x + i, y + j, ln[i]);
    });
  /** stamp plus its mirror */
  const sm = (x: number, y: number, lines: string[]) => {
    s(x, y, lines);
    lines.forEach((ln, j) => {
      for (let i = 0; i < ln.length; i++) if (ln[i] !== " " && ln[i] !== ".") p(CHAR_W - 1 - (x + i), y + j, ln[i]);
    });
  };
  const ell = (cx: number, cy: number, rx: number, ry: number, c: string) => {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
        if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) p(x, y, c);
  };
  /** recolour in absolute coordinates */
  const map = (fn: (x: number, y: number, ch: string) => string) => {
    for (let y = 0; y < CHAR_H; y++) for (let x = 0; x < CHAR_W; x++) g[y][x] = fn(x, y, g[y][x]);
  };
  const shift = (dx: number, dy: number) => {
    ox = dx;
    oy = dy;
  };
  const done = () => g.map((line) => line.join(""));
  return { p, r, m, pm, row, prof, s, sm, ell, map, shift, done };
}

/* --------------------------------------------------------------- characters */

/** 01 · Traditional Saudi: thobe, red shemagh, agal, bisht with a gold edge. Upright and still. */
function rashed() {
  const { p, r, m, row, prof, s, map, done } = painter();
  // bisht: wide, to the shins
  row(31, 11, "b");
  prof(32, Array(19).fill(12), "b");
  r(28, 32, 4, 19, "B");
  m(14, 34, 1, 6, "B");
  // thobe showing through the open front, gold edge on both sides of the opening
  for (let y = 31; y <= 50; y++) {
    const a = 3 + Math.floor((y - 31) / 8);
    row(y, a, "W");
    p(19 + a, y, "w");
    p(19 - a, y, "O");
    p(20 + a, y, "O");
  }
  row(51, 8, "W");
  r(24, 51, 4, 1, "w");
  m(15, 52, 4, 1, "s");
  m(15, 53, 4, 1, "l");
  // hands clasped in front, thobe cuffs
  m(16, 39, 1, 3, "W");
  r(17, 40, 6, 3, "s");
  r(19, 41, 2, 1, "S");
  m(15, 39, 1, 2, "B");
  // shemagh: the head mass
  prof(9, [5, 7, 8, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10], "M");
  // draped over the shoulders, one end hanging forward, the other thrown back
  for (let y = 30; y <= 33; y++) for (let x = 8; x <= 31; x++) if (Math.abs(x - 19.5) > 2.5 && Math.abs(x - 19.5) < 11.5) p(x, y, "M");
  r(9, 30, 5, 9, "M");
  for (let x = 9; x <= 13; x += 2) p(x, 39, "r");
  // neck and collar
  row(30, 3, "s");
  row(31, 3, "W");
  r(19, 32, 2, 1, "w");
  // face
  prof(15, [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 5, 4], "s");
  r(26, 16, 1, 9, "S");
  r(14, 20, 4, 1, "h");
  r(22, 20, 4, 1, "h");
  s(15, 21, ["iW", "ii"]);
  s(23, 21, ["iW", "ii"]);
  p(20, 24, "S");
  // full trimmed beard and moustache
  s(13, 23, ["h............h", "hh..........hh", "hhh.hhhhhh.hhh", "hhhhhmmmmhhhhh"]);
  prof(27, [6, 5, 4, 2], "h");
  // agal on top of the shemagh
  row(12, 9, "a");
  row(13, 9, "a");
  for (let x = 12; x <= 27; x += 3) p(x, 12, "C");
  // shemagh pattern: a small red diamond grid on white, shaded on the far side
  map((x, y, ch) => {
    if (ch !== "M") return ch;
    if ((x + y) % 2 === 0 && Math.floor(x / 2) % 2 === Math.floor(y / 2) % 2) return "r";
    return x >= 27 ? "w" : "W";
  });
  return done();
}

/** 02 · Contemporary Saudi: thobe under a bomber jacket, sneakers, skin fade, shades on his head, phone in hand. */
function nawaf() {
  const { p, r, m, row, prof, s, done } = painter();
  // thobe: centre strip under the open jacket, and the skirt below it
  for (let y = 31; y <= 43; y++) row(y, 3, "W");
  prof(44, [8, 8, 8, 8, 8, 8, 8], "W");
  r(25, 44, 3, 7, "w");
  r(16, 46, 1, 5, "w");
  // sneakers: wide stance, orange flash on the side
  r(12, 51, 6, 3, "W");
  r(22, 51, 6, 3, "W");
  r(12, 53, 6, 1, "G");
  r(22, 53, 6, 1, "G");
  r(13, 52, 3, 1, "o");
  r(24, 52, 3, 1, "o");
  // jacket body
  row(31, 8, "b");
  prof(32, Array(10).fill(8), "b");
  r(25, 32, 3, 10, "B");
  for (let y = 31; y <= 41; y++) row(y, 3, "W");
  r(16, 32, 1, 10, "B");
  r(23, 32, 1, 10, "B");
  row(42, 8, "c");
  row(43, 8, "c");
  for (let y = 42; y <= 43; y++) row(y, 3, "W");
  m(15, 31, 2, 1, "c");
  // left arm: elbow out, hand in the jacket pocket
  r(9, 32, 3, 2, "b");
  r(8, 34, 3, 2, "b");
  r(7, 36, 3, 2, "b");
  r(9, 36, 1, 2, "B");
  r(8, 38, 4, 1, "b");
  r(10, 39, 4, 1, "b");
  r(12, 40, 2, 1, "c");
  // right arm straight, phone in hand
  r(28, 32, 3, 10, "b");
  r(30, 32, 1, 10, "B");
  r(28, 42, 3, 1, "c");
  r(29, 44, 3, 4, "n");
  r(30, 45, 1, 2, "q");
  r(28, 43, 3, 2, "s");
  // neck, band collar
  row(30, 3, "s");
  r(17, 31, 6, 1, "W");
  // round face
  prof(15, [4, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 5, 3], "s");
  r(26, 18, 1, 8, "S");
  m(12, 21, 1, 3, "s");
  p(12, 22, "S");
  p(27, 22, "S");
  // textured crop on top, skin fade on the sides
  prof(8, [4, 6, 7, 8, 8, 8], "h");
  p(15, 7, "h");
  p(19, 7, "h");
  p(23, 7, "h");
  r(13, 14, 12, 1, "h");
  r(20, 15, 5, 1, "h");
  for (const [x, y] of [[14, 9], [17, 8], [21, 9], [24, 10], [16, 11], [22, 12], [19, 13]]) p(x, y, "j");
  r(12, 14, 2, 6, "H");
  r(26, 14, 2, 6, "H");
  // sunglasses pushed up
  r(13, 11, 14, 1, "n");
  r(14, 12, 4, 2, "q");
  r(22, 12, 4, 2, "q");
  p(14, 12, "W");
  p(22, 12, "W");
  // face: one brow up, a side glance, a smirk, a sharp beard line
  r(14, 19, 4, 1, "h");
  r(22, 20, 4, 1, "h");
  s(15, 21, ["Wi", "Wi"]);
  s(23, 21, ["Wi", "Wi"]);
  p(20, 24, "S");
  r(17, 25, 6, 1, "h");
  r(18, 27, 3, 1, "m");
  p(21, 26, "m");
  for (let y = 23; y <= 27; y++) {
    p(13, y, "z");
    p(26, y, "z");
  }
  row(28, 5, "z");
  row(29, 3, "z");
  return done();
}

/** 03 · The illustrator: tall and lanky, a big afro, round glasses, an oversized cardigan, sketchbook under his arm. */
function zain() {
  const { p, r, row, prof, s, ell, map, done } = painter();
  // afro
  ell(19.5, 10.5, 12, 8.5, "h");
  map((x, y, ch) => (ch === "h" && (x * 3 + y * 5) % 7 === 0 ? "j" : ch));
  // pencil tucked into the hair
  for (const [x, y, c] of [[27, 19, "O"], [28, 18, "o"], [29, 17, "o"], [30, 16, "o"], [31, 15, "d"]] as const) p(x, y, c);
  // long face
  prof(13, [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 5, 4, 3], "s");
  r(25, 15, 1, 12, "S");
  for (const x of [14, 15, 17, 18, 21, 22, 24, 25]) p(x, 14, "h");
  row(13, 6, "h");
  p(13, 21, "s");
  p(26, 21, "S");
  // round glasses
  s(14, 20, [" gg ", "g  g", "g  g", " gg "]);
  s(22, 20, [" gg ", "g  g", "g  g", " gg "]);
  r(18, 21, 4, 1, "g");
  s(15, 21, ["iW", "ii"]);
  s(23, 21, ["iW", "ii"]);
  r(15, 18, 3, 1, "h");
  r(22, 18, 3, 1, "h");
  p(20, 24, "S");
  p(19, 25, "S");
  p(17, 26, "S");
  r(18, 27, 4, 1, "S");
  p(22, 26, "S");
  // long neck
  r(18, 30, 4, 2, "s");
  p(21, 30, "S");
  // oversized cardigan over a white tee
  row(32, 8, "q");
  prof(33, Array(12).fill(7), "q");
  r(24, 33, 3, 12, "T");
  for (let y = 32; y <= 41; y++) row(y, 3, "W");
  r(18, 32, 4, 1, "w");
  r(16, 33, 1, 12, "T");
  r(23, 33, 1, 12, "T");
  // right arm hanging
  r(27, 33, 3, 9, "q");
  r(29, 33, 1, 9, "T");
  r(27, 42, 3, 1, "T");
  r(27, 43, 3, 2, "s");
  // sketchbook held against the left side
  r(8, 34, 6, 9, "g");
  r(8, 34, 1, 9, "G");
  r(13, 35, 1, 7, "W");
  r(11, 33, 3, 1, "q");
  r(11, 37, 3, 2, "s");
  // slim trousers, rolled cuffs
  r(15, 45, 10, 1, "c");
  r(15, 46, 4, 5, "c");
  r(21, 46, 4, 5, "c");
  r(18, 46, 1, 4, "n");
  r(24, 46, 1, 4, "n");
  r(15, 50, 4, 1, "C");
  r(21, 50, 4, 1, "C");
  r(14, 51, 5, 2, "l");
  r(21, 51, 5, 2, "l");
  r(14, 53, 5, 1, "w");
  r(21, 53, 5, 1, "w");
  return done();
}

/** 04 · The sound engineer: broad and stocky, beanie, big auburn beard, headphones round his neck, arms crossed. */
function jassar() {
  const { p, r, m, row, prof, s, map, done } = painter();
  // boots and jeans
  r(12, 50, 7, 3, "l");
  r(21, 50, 7, 3, "l");
  r(12, 53, 7, 1, "n");
  r(21, 53, 7, 1, "n");
  r(13, 44, 14, 1, "t");
  r(13, 45, 6, 5, "t");
  r(21, 45, 6, 5, "t");
  r(18, 45, 1, 5, "u");
  r(26, 45, 1, 5, "u");
  row(43, 7, "n");
  r(19, 43, 2, 1, "g");
  // torso and sleeves
  row(31, 10, "G");
  prof(32, Array(11).fill(8), "G");
  r(25, 32, 3, 11, "B");
  m(8, 32, 4, 4, "G");
  m(11, 32, 1, 4, "B");
  m(8, 36, 4, 3, "s");
  // crossed forearms
  r(10, 36, 20, 2, "s");
  r(10, 38, 20, 2, "s");
  r(10, 38, 20, 1, "S");
  r(27, 36, 2, 2, "S");
  r(10, 39, 2, 1, "S");
  // headphones resting on the collarbones
  r(9, 29, 3, 3, "o");
  r(28, 29, 3, 3, "o");
  r(9, 31, 3, 1, "d");
  r(28, 31, 3, 1, "d");
  r(12, 30, 2, 1, "n");
  r(26, 30, 2, 1, "n");
  // wide square face
  prof(15, [7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7, 6], "s");
  r(27, 17, 1, 8, "S");
  m(11, 20, 1, 3, "s");
  // beanie with a ribbed cuff
  prof(7, [4, 6, 7, 8, 8, 8, 9], "c");
  prof(14, [9, 9, 9], "C");
  map((x, y, ch) => (ch === "C" && y >= 14 && y <= 16 && x % 2 === 0 ? "c" : ch));
  p(15, 9, "C");
  p(16, 8, "C");
  // sideburns, brows, small smiling eyes, big nose
  m(12, 17, 1, 3, "h");
  r(13, 19, 5, 1, "h");
  r(22, 19, 5, 1, "h");
  r(14, 18, 3, 1, "h");
  r(23, 18, 3, 1, "h");
  r(15, 21, 2, 1, "i");
  r(23, 21, 2, 1, "i");
  r(15, 22, 2, 1, "S");
  r(23, 22, 2, 1, "S");
  r(19, 22, 2, 2, "S");
  p(19, 22, "x");
  // the beard, spilling over the chest
  s(12, 23, ["hh............hh", "hhh.hhhhhhhh.hhh", "hhhhhhhhhhhhhhhh", "hhhhhhHHHHhhhhhh"]);
  prof(27, [8, 8, 7, 7, 6, 5, 3], "h");
  map((x, y, ch) => (ch === "h" && y >= 25 && (x + y * 2) % 5 === 0 ? "j" : ch));
  return done();
}

/** 05 · The professor: white tufts and a big white moustache, half-moon glasses, cardigan, bow tie, cane and book. Slight stoop. */
function waleed() {
  const { p, r, m, pm, row, prof, s, sm, shift, done } = painter();
  // shoes and trousers
  r(14, 52, 5, 2, "l");
  r(21, 52, 5, 2, "l");
  p(15, 52, "C");
  p(22, 52, "C");
  row(45, 6, "c");
  r(14, 46, 5, 6, "c");
  r(21, 46, 5, 6, "c");
  r(18, 46, 1, 6, "n");
  // book under the left arm
  r(9, 35, 5, 8, "T");
  r(13, 36, 1, 6, "W");
  // cardigan
  row(31, 8, "g");
  prof(32, Array(13).fill(9), "g");
  r(26, 32, 3, 13, "G");
  [4, 3, 3, 2, 2, 1].forEach((a, k) => row(31 + k, a, "W"));
  r(20, 37, 1, 8, "G");
  for (const y of [37, 40, 43]) p(19, y, "n");
  m(12, 41, 4, 1, "G");
  // arms
  r(8, 32, 3, 10, "g");
  r(8, 42, 3, 2, "s");
  r(29, 32, 3, 9, "g");
  r(31, 32, 1, 9, "G");
  r(29, 41, 3, 1, "G");
  // cane
  r(28, 42, 4, 1, "L");
  r(31, 43, 1, 11, "L");
  r(29, 42, 3, 2, "s");
  // collar and bow tie
  m(16, 31, 2, 1, "W");
  s(17, 31, ["ooddoo", "o....o"]);
  // the head leans forward a little
  shift(-1, 1);
  row(29, 3, "s");
  prof(11, [4, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 5], "s");
  r(26, 13, 1, 13, "S");
  p(16, 12, "y");
  p(17, 12, "y");
  p(16, 13, "y");
  r(16, 15, 8, 1, "x");
  r(17, 17, 6, 1, "x");
  p(12, 21, "s");
  p(27, 21, "S");
  sm(11, 15, ["hh", "hhh", "hhh", "hh", "hh", "h"]);
  sm(13, 18, [" hhhh", "h    "]);
  r(15, 20, 2, 1, "i");
  r(23, 20, 2, 1, "i");
  sm(14, 21, ["G  G", " GG "]);
  r(18, 21, 4, 1, "G");
  p(13, 20, "x");
  p(26, 20, "x");
  s(19, 22, ["S ", "SS"]);
  r(15, 24, 10, 1, "h");
  sm(14, 25, ["hhh"]);
  r(17, 25, 6, 1, "H");
  pm(14, 26, "h");
  shift(0, 0);
  return done();
}

/** 06 · The skater: a teenager, shorter than the rest. Backwards cap, oversized tee, skateboard with orange wheels. */
function tim() {
  const { p, r, m, row, prof, s, done } = painter();
  // chunky sneakers, tall socks, bare shins
  r(13, 51, 6, 2, "n");
  r(21, 51, 6, 2, "n");
  r(13, 53, 6, 1, "W");
  r(21, 53, 6, 1, "W");
  p(15, 51, "C");
  p(23, 51, "C");
  r(14, 47, 4, 4, "W");
  r(22, 47, 4, 4, "W");
  r(14, 48, 4, 1, "q");
  r(22, 48, 4, 1, "q");
  r(14, 45, 4, 2, "s");
  r(22, 45, 4, 2, "s");
  // shorts
  row(41, 8, "G");
  r(12, 42, 7, 3, "G");
  r(21, 42, 7, 3, "G");
  r(25, 41, 3, 4, "B");
  // oversized tee with a wave on it
  row(31, 9, "W");
  prof(32, Array(9).fill(9), "W");
  m(8, 31, 3, 5, "W");
  r(26, 32, 3, 9, "w");
  r(29, 31, 3, 5, "w");
  s(16, 34, ["  TT    ", " T  T  T", "T    TT "]);
  // arms
  r(9, 36, 2, 4, "s");
  r(8, 40, 3, 2, "s");
  r(29, 36, 2, 3, "s");
  // skateboard on its tail
  r(31, 30, 3, 23, "c");
  r(33, 31, 1, 21, "n");
  p(31, 30, ".");
  p(33, 30, ".");
  p(31, 52, ".");
  p(33, 52, ".");
  r(34, 33, 1, 3, "g");
  r(34, 47, 1, 3, "g");
  r(35, 33, 1, 3, "o");
  r(35, 47, 1, 3, "o");
  r(29, 38, 3, 2, "s");
  // neck and round young face
  r(18, 30, 4, 1, "s");
  prof(17, [5, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 5], "s");
  r(26, 19, 1, 7, "S");
  m(12, 22, 1, 2, "s");
  // backwards cap, hair poking through the strap gap and out the sides
  prof(11, [4, 6, 7, 8, 8, 8], "q");
  row(17, 8, "T");
  r(17, 14, 6, 1, "T");
  r(18, 15, 4, 3, "h");
  r(19, 10, 2, 1, "T");
  s(11, 18, ["hh", "h"]);
  s(27, 18, ["hh", " h"]);
  for (const x of [14, 16, 23, 25]) p(x, 18, "h");
  // big eyes, freckles, open grin
  r(15, 19, 2, 1, "h");
  r(23, 19, 2, 1, "h");
  s(15, 21, ["iW", "ii", "ii"]);
  s(23, 21, ["iW", "ii", "ii"]);
  for (const x of [14, 16, 23, 25]) p(x, 25, "x");
  p(20, 24, "S");
  s(18, 26, ["mWWm", " mm "]);
  return done();
}

/** 07 · The photographer: bald, deep brown skin, thick square glasses, goatee, turtleneck, camera held at the chest. */
function malik() {
  const { p, r, m, pm, row, prof, s, done } = painter();
  // shoes and light chinos
  r(14, 52, 5, 2, "n");
  r(21, 52, 5, 2, "n");
  r(14, 53, 5, 1, "C");
  r(21, 53, 5, 1, "C");
  row(44, 6, "g");
  r(14, 45, 5, 7, "g");
  r(21, 45, 5, 7, "g");
  r(18, 45, 1, 7, "G");
  r(25, 45, 1, 7, "G");
  // turtleneck
  row(32, 9, "C");
  prof(33, Array(10).fill(8), "C");
  r(25, 33, 3, 10, "c");
  row(43, 6, "n");
  row(29, 4, "C");
  row(30, 4, "c");
  row(31, 4, "C");
  // shoulder bag on the right hip, strap across the chest
  for (let k = 0; k <= 13; k++) p(13 + k, 32 + Math.floor(k * 0.7), "n");
  r(27, 41, 7, 6, "T");
  r(27, 41, 7, 2, "q");
  r(30, 43, 1, 1, "g");
  // arms bent to hold the camera
  m(8, 33, 3, 6, "C");
  m(10, 38, 4, 2, "C");
  m(12, 36, 2, 3, "s");
  // camera and strap
  r(14, 35, 12, 5, "n");
  r(15, 34, 4, 1, "C");
  s(16, 35, [" CCCC ", "CkqqkC", "CkqWkC", " CCCC "]);
  p(23, 36, "o");
  for (const [x, y] of [[14, 34], [14, 33], [15, 32]]) pm(x, y, "n");
  // egg-shaped bald head
  prof(10, [3, 5, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 5, 4], "s");
  r(25, 13, 2, 13, "S");
  p(15, 12, "x");
  p(16, 12, "x");
  p(15, 13, "x");
  m(12, 20, 1, 3, "s");
  // brows and thick square frames
  r(14, 18, 4, 1, "h");
  r(22, 18, 4, 1, "h");
  s(13, 19, ["nnnnnn", "n    n", "n    n", "nnnnnn"]);
  s(21, 19, ["nnnnnn", "n    n", "n    n", "nnnnnn"]);
  r(19, 20, 2, 1, "n");
  s(14, 20, ["LWiL", "LiiL"]);
  s(22, 20, ["LWiL", "LiiL"]);
  r(19, 23, 2, 1, "S");
  r(18, 24, 4, 1, "S");
  // moustache and goatee
  r(17, 26, 6, 1, "h");
  r(18, 27, 4, 1, "m");
  r(18, 28, 4, 2, "h");
  return done();
}

/** 08 · The digital artist: man bun, long side strands, brown beard, teal denim jacket with a sherpa collar, tablet and stylus. */
function yousef() {
  const { p, r, m, pm, row, prof, s, sm, ell, done } = painter();
  // boots and jeans
  r(14, 50, 5, 3, "l");
  r(21, 50, 5, 3, "l");
  r(14, 53, 5, 1, "n");
  r(21, 53, 5, 1, "n");
  row(44, 5, "c");
  r(15, 45, 4, 5, "c");
  r(21, 45, 4, 5, "c");
  // denim jacket over a black tee
  row(31, 8, "q");
  prof(32, Array(11).fill(8), "q");
  r(25, 32, 3, 11, "T");
  row(43, 8, "T");
  r(17, 32, 6, 12, "n");
  sm(12, 31, ["WWWWW", "WWWw ", "WWw  ", "Ww   "]);
  m(13, 36, 3, 1, "T");
  pm(14, 37, "g");
  // arms
  r(8, 32, 3, 8, "q");
  r(29, 32, 3, 7, "q");
  r(31, 32, 1, 7, "T");
  // tablet in the left hand
  r(9, 38, 8, 6, "n");
  r(10, 39, 6, 4, "L");
  r(9, 40, 2, 3, "s");
  // stylus in the right hand
  r(28, 35, 1, 4, "o");
  p(28, 34, "W");
  r(28, 39, 3, 2, "s");
  // face
  prof(15, [6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 5, 4, 3], "s");
  r(26, 17, 1, 9, "S");
  // hair: tied up in a bun, long strands left loose
  prof(10, [5, 7, 8, 8, 8], "h");
  ell(19.5, 7.5, 3, 2.5, "h");
  p(18, 6, "j");
  p(19, 6, "j");
  row(10, 3, "H");
  r(19, 11, 1, 3, "H");
  r(11, 15, 2, 12, "h");
  r(27, 15, 2, 12, "h");
  p(11, 26, ".");
  p(28, 26, ".");
  r(13, 15, 4, 1, "h");
  r(23, 15, 4, 1, "h");
  p(13, 16, "h");
  p(26, 16, "h");
  // face details
  r(14, 19, 4, 1, "h");
  r(22, 19, 4, 1, "h");
  s(15, 21, ["iW"]);
  s(23, 21, ["iW"]);
  p(14, 21, "k");
  p(25, 21, "k");
  p(20, 23, "S");
  p(20, 24, "S");
  s(13, 24, ["h............h", "hh..hhhhhh..hh", "hhhhhmmmmhhhhh"]);
  prof(27, [6, 5, 3], "h");
  return done();
}

/** 09 · The maker: work cap, slate coverall with rolled sleeves and an orange name patch, wrench in hand, hand on hip. */
function fares() {
  const { p, r, row, prof, s, map, done } = painter();
  // boots and coverall legs, wide stance
  r(12, 51, 7, 2, "l");
  r(22, 51, 7, 2, "l");
  r(12, 53, 7, 1, "n");
  r(22, 53, 7, 1, "n");
  row(43, 8, "t");
  row(44, 8, "t");
  r(13, 45, 6, 6, "t");
  r(22, 45, 6, 6, "t");
  r(13, 47, 6, 1, "T");
  r(22, 47, 6, 1, "T");
  // coverall top
  row(31, 9, "t");
  prof(32, Array(11).fill(8), "t");
  r(26, 32, 2, 11, "T");
  r(19, 33, 1, 9, "T");
  s(17, 31, ["WWWWWW", " WWWW ", "  WW  "]);
  row(41, 8, "n");
  r(19, 41, 2, 1, "g");
  r(22, 34, 4, 2, "o");
  p(23, 34, "O");
  p(24, 35, "O");
  // left arm, wrench hanging from the hand
  r(9, 41, 1, 9, "g");
  s(8, 49, ["g g", "ggg"]);
  r(8, 32, 3, 5, "t");
  r(8, 37, 3, 1, "q");
  r(8, 38, 3, 4, "s");
  r(8, 42, 3, 2, "s");
  // right hand on the hip
  s(28, 32, ["ttt", "tttt", " tttt", "  ttt", "  qqq"]);
  s(28, 37, [" sss", "sss", "ss"]);
  r(26, 40, 3, 2, "s");
  // square face with stubble
  prof(16, [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6], "s");
  r(26, 18, 1, 9, "S");
  r(12, 21, 1, 3, "s");
  r(27, 21, 1, 3, "S");
  map((x, y, ch) => {
    if (ch !== "s" || y < 25 || y > 29) return ch;
    const outer = Math.abs(x - 19.5) > 3.5 || y >= 28;
    return outer && (x + y) % 2 === 0 ? "z" : ch;
  });
  // work cap, peak forward
  prof(9, [4, 6, 7, 8, 8, 8, 8], "c");
  r(15, 10, 6, 3, "C");
  p(19, 12, "g");
  p(20, 12, "g");
  row(16, 9, "n");
  row(17, 8, "n");
  r(12, 18, 1, 3, "h");
  r(27, 18, 1, 3, "h");
  // stern brows sitting low, steady eyes, flat mouth
  r(14, 21, 4, 1, "h");
  r(22, 21, 4, 1, "h");
  s(15, 22, ["iW"]);
  s(23, 22, ["iW"]);
  r(19, 24, 2, 1, "S");
  r(18, 27, 4, 1, "m");
  return done();
}

/** 10 · The director: long belted trench coat, orange scarf, slicked hair with a grey streak, pencil moustache, script in hand. */
function sami() {
  const { p, r, m, pm, row, prof, s, sm, done } = painter();
  // shoes and trousers under the coat
  r(14, 52, 5, 2, "n");
  r(21, 52, 5, 2, "n");
  p(15, 52, "C");
  p(22, 52, "C");
  r(15, 50, 4, 2, "n");
  r(21, 50, 4, 2, "n");
  // trench coat: cinched at the waist, flaring below
  row(31, 10, "g");
  prof(32, [10, 10, 9, 9, 9, 9, 9, 8, 8, 8, 9, 9, 10, 10, 10, 10, 11, 11], "g");
  for (let y = 32; y <= 49; y++) p(y < 41 ? 27 : 28, y, "G");
  for (let y = 32; y <= 49; y++) p(y < 41 ? 28 : 29, y, "v");
  for (let y = 42; y <= 49; y++) {
    const a = 1 + Math.floor((y - 42) / 3);
    row(y, a, y < 44 ? "v" : "n");
  }
  sm(15, 31, ["GGG", "GG", "G"]);
  m(10, 31, 3, 1, "G");
  pm(16, 34, "n");
  pm(16, 37, "n");
  row(40, 8, "G");
  r(18, 40, 4, 1, "v");
  // left hand in the pocket
  for (let y = 33; y <= 41; y++) p(12, y, "G");
  r(11, 42, 4, 1, "v");
  // right arm holding a rolled script
  r(30, 32, 3, 10, "g");
  r(32, 32, 1, 10, "G");
  r(30, 42, 3, 1, "G");
  r(32, 39, 2, 8, "W");
  r(33, 39, 1, 8, "w");
  r(30, 43, 3, 2, "s");
  // scarf: wrapped, one end hanging over the belt
  row(30, 5, "o");
  row(31, 5, "o");
  row(32, 4, "o");
  for (let x = 16; x <= 23; x += 2) p(x, 31, "d");
  r(21, 33, 3, 8, "o");
  r(23, 33, 1, 8, "d");
  p(21, 41, "d");
  p(23, 41, "d");
  // angular face
  prof(15, [6, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 5, 5, 4, 3], "s");
  r(26, 16, 1, 8, "S");
  m(12, 20, 1, 3, "s");
  // slicked-back hair with a grey streak
  prof(9, [5, 7, 8, 8, 8, 8], "h");
  r(12, 15, 2, 4, "h");
  r(26, 15, 2, 3, "h");
  r(19, 15, 2, 1, "h");
  for (const [x, y] of [[14, 11], [15, 11], [15, 12], [16, 12], [16, 13], [17, 13], [17, 14]]) p(x, y, "H");
  p(22, 10, "j");
  p(23, 11, "j");
  // sharp brows, narrowed eyes, long nose, pencil moustache
  sm(14, 19, ["hh  ", "  hh"]);
  s(15, 22, ["iW"]);
  s(23, 22, ["iW"]);
  s(20, 23, ["S ", "S ", "SS"]);
  p(14, 24, "S");
  p(25, 24, "S");
  r(17, 26, 6, 1, "h");
  p(16, 25, "h");
  p(23, 25, "h");
  r(19, 27, 2, 1, "S");
  return done();
}

/* ---------------------------------------------------------------- roster */

/** The presenter's approved companion (chosen in the Character Lab on 2026-11-22). Not yet placed in any slide. */
export const APPROVED_CHARACTER_ID = "nawaf";

export const CHARACTERS: Character[] = [
  {
    id: "rashed",
    name: "راشد",
    tagline: "إطلالة سعودية تقليدية",
    look: "ثوب أبيض، شماغ أحمر وعقال، بشت داكن بحاشية ذهبية، لحية مشذّبة، ووقفة ثابتة ويدان مضمومتان.",
    accent: "حاشية البشت",
    group: "saudi",
    contrast: { face: "وجه بيضاوي، لحية سوداء كاملة، نظرة مستقيمة", stance: "متناظرة وساكنة، يدان مضمومتان", clothes: "ثوب، شماغ وعقال، بشت، نعال" },
    rows: rashed(),
    palette: { s: "#c68b5f", S: "#a56f48", h: "#141719", r: "#b0402a", a: "#0d1012", b: "#3a2c22", B: "#2a1f17", l: "#6b4a32" },
  },
  {
    id: "nawaf",
    name: "نوّاف",
    tagline: "إطلالة سعودية معاصرة",
    look: "ثوب تحت جاكيت بومبر، سنيكرز، قصّة فيد ونظارة شمسية فوق رأسه، جوال في يده ويد في الجيب.",
    accent: "خط السنيكرز",
    group: "saudi",
    contrast: { face: "وجه مستدير، دقن خفيف، حاجب مرفوع ونظرة جانبية", stance: "غير متناظرة: يد في الجيب ورجلان متباعدتان", clothes: "ثوب بلا غترة، جاكيت بومبر، سنيكرز" },
    rows: nawaf(),
    palette: { s: "#e0ab80", S: "#c08a62", z: "#a77c5c", h: "#16181a", H: "#41474b", j: "#2e3438", b: "#7f9296", B: "#5f7276" },
  },
  {
    id: "zain",
    name: "زين",
    tagline: "الرسّام",
    look: "طويل ونحيل، شعر أفرو كبير، نظارة دائرية، كارديغان واسع، ودفتر رسم تحت ذراعه.",
    accent: "القلم في شعره",
    group: "free",
    rows: zain(),
    palette: { s: "#7a4a2d", S: "#5a341f", h: "#1b1412", j: "#33261f", l: "#6b4a32" },
  },
  {
    id: "jassar",
    name: "جسّار",
    tagline: "مهندس الصوت",
    look: "عريض وممتلئ، قبعة صوف، لحية حمراء كثيفة، سماعات على رقبته، وذراعان متقاطعتان.",
    accent: "السماعات",
    group: "free",
    rows: jassar(),
    palette: { s: "#f0c6a2", S: "#d39f7c", x: "#f7dcc2", h: "#9a5129", H: "#5e2c14", j: "#b86a3a", B: "#677a7e", u: "#3a4b50", l: "#5a3f2c" },
  },
  {
    id: "waleed",
    name: "وليد",
    tagline: "الأستاذ",
    look: "رجل كبير بانحناءة خفيفة، شعر أبيض على الجانبين، شنب أبيض كبير، نظارة نصفية، عصا وكتاب.",
    accent: "البابيون",
    group: "free",
    rows: waleed(),
    palette: { s: "#d9ad86", S: "#b88b66", x: "#b3825d", y: "#ecc9a6", h: "#eef0ee", H: "#b9c2c2", l: "#3b2a20", L: "#6b4a32" },
  },
  {
    id: "tim",
    name: "تيم",
    tagline: "المتزلّج",
    look: "مراهق أقصر من البقية، كاب مقلوب، تيشيرت واسع، شورت وجوارب طويلة، ولوح تزلج بجانبه.",
    accent: "عجلات اللوح",
    group: "free",
    rows: tim(),
    palette: { s: "#e8b88f", S: "#c9956e", x: "#b97e57", h: "#6b4a32", B: "#677a7e" },
  },
  {
    id: "malik",
    name: "مالك",
    tagline: "المصوّر",
    look: "رأس أصلع لامع، نظارة مربعة سميكة، سكسوكة، كنزة برقبة عالية، وكاميرا يمسكها بيديه.",
    accent: "علامة الكاميرا",
    group: "free",
    rows: malik(),
    palette: { s: "#5c3623", S: "#44271a", x: "#86553a", h: "#0f1214" },
  },
  {
    id: "yousef",
    name: "يوسف",
    tagline: "الفنان الرقمي",
    look: "شعر طويل مربوط كعكة مع خصلات منسدلة، لحية بنية، جاكيت جينز بياقة صوف، وتابلت بيده.",
    accent: "القلم الرقمي",
    group: "free",
    rows: yousef(),
    palette: { s: "#b57a4f", S: "#94603b", h: "#3b2a20", H: "#24180f", j: "#5a4030", l: "#8a5f3c" },
  },
  {
    id: "fares",
    name: "فارس",
    tagline: "الصانع",
    look: "فك عريض ولحية خفيفة، كاب عمل، أفرهول بأكمام مرفوعة، مفتاح ربط في يد والأخرى على خصره.",
    accent: "بطاقة الاسم",
    group: "free",
    rows: fares(),
    palette: { s: "#cf9a70", S: "#ad7a52", z: "#9a6f4f", h: "#2b211b", l: "#5a3f2c" },
  },
  {
    id: "sami",
    name: "سامي",
    tagline: "المخرج",
    look: "معطف ترنش طويل بحزام، وشاح، شعر مسرّح للخلف بخصلة رمادية، شنب رفيع، ونص ملفوف في يده.",
    accent: "الوشاح",
    group: "free",
    rows: sami(),
    palette: { s: "#f3d2b6", S: "#d8ac8d", h: "#1c1a1a", H: "#a3acae", j: "#3a3636" },
  },
];

/* --------------------------------------------------------------- composing */

export type CharacterMode = "color" | "silhouette";

const OUTLINE = "#05080a";
const SILHOUETTE = "#030405";

const rgb = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

/**
 * RGBA pixels for a character (CHAR_W x CHAR_H). A 1px outline is added around the silhouette;
 * `rim` adds a second 1px ring outside it, in the identity's sage.
 */
export function composeCharacter(c: Character, { mode = "color", rim = true }: { mode?: CharacterMode; rim?: boolean } = {}) {
  const pal = { ...WORLD, ...c.palette };
  const W = CHAR_W;
  const H = CHAR_H;
  const inside = (x: number, y: number) => x >= 0 && x < W && y >= 0 && y < H;
  const fill = (x: number, y: number) => inside(x, y) && c.rows[y][x] !== ".";
  const near = (x: number, y: number, f: (x: number, y: number) => boolean) => f(x - 1, y) || f(x + 1, y) || f(x, y - 1) || f(x, y + 1);
  // empty pixels reachable from the border are "outside"; enclosed gaps (between legs, under an arm) are not
  const outside = new Uint8Array(W * H);
  const stack: number[] = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) {
    const i = stack.pop()!;
    const x = i % W;
    const y = (i / W) | 0;
    if (outside[i] || fill(x, y)) continue;
    outside[i] = 1;
    if (x > 0) stack.push(i - 1);
    if (x < W - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - W);
    if (y < H - 1) stack.push(i + W);
  }
  const line = (x: number, y: number) => inside(x, y) && !fill(x, y) && near(x, y, fill);
  const edge = (x: number, y: number) => line(x, y) && outside[y * W + x] === 1;
  const out = new Uint8ClampedArray(W * H * 4);
  const sil = rgb(SILHOUETTE);
  const ol = rgb(OUTLINE);
  const rimRgb = rgb(T.sage);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const o = (y * W + x) * 4;
      let col: number[] | null = null;
      if (fill(x, y)) col = mode === "silhouette" ? sil : rgb(pal[c.rows[y][x]] ?? "#ff00ff");
      else if (mode === "silhouette") {
        // one solid shape with Wamda's 1px sage rim, the way the deck shows a hidden character
        if (edge(x, y)) col = rimRgb;
        else if (!outside[y * W + x]) col = sil;
      } else if (line(x, y)) col = ol;
      else if (rim && outside[y * W + x] && near(x, y, edge)) col = rimRgb;
      if (!col) continue;
      out[o] = col[0];
      out[o + 1] = col[1];
      out[o + 2] = col[2];
      out[o + 3] = 255;
    }
  return out;
}
