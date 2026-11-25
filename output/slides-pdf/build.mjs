// Builds links.html: a cover, then one page of clickable cards for each slide we explained tools on (owner 2026-11-25:
// the slides themselves are shared as a link, this light PDF carries only the references, for WhatsApp).
// Data comes straight from the deck (deck/content/refs.ts, resources.ts). Run ./render.sh.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const DECK = "/Users/maloke10/Desktop/RKY/ai-covers";
const require = createRequire(path.join(DECK, "package.json"));
const ts = require("typescript");

function load(file, deps = {}) {
  const src = fs.readFileSync(path.join(DECK, file), "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const mod = { exports: {} };
  new Function("require", "module", "exports", js)((p) => deps[p], mod, mod.exports);
  return mod.exports;
}
const res = load("deck/content/resources.ts");
const { REFS } = load("deck/content/refs.ts", { "./resources": res });

// slide titles from the registry (regex: the registry imports React components)
const reg = fs.readFileSync(path.join(DECK, "deck/registry.ts"), "utf8");
const TITLES = Object.fromEntries([...reg.matchAll(/no: (\d+), title: "([^"]+)"/g)].map((m) => [Number(m[1]), m[2]]));

// slides whose links we explained in the workshop (01/05/08 are only the credits of the components the deck is built with)
const LINK_SLIDES = [11, 15, 16, 17, 19, 22, 24, 25, 26, 32, 33];

// Fill these in when they exist, then run ./render.sh again:
const DECK_URL = ""; // the published deck (GitHub), shown on the cover
const PROMPT_URL = "ai_video_editor_skill_addon.md"; // the prompt file; a full URL once it is hosted (a relative one breaks on WhatsApp)

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pad = (n) => String(n).padStart(2, "0");
const host = (u) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const GLYPH = {
  mic: '<path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  download: '<path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14"/>',
  browser: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  news: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M8 9h8M8 13h8M8 17h5"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
};
const svg = (g, size = 34) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${GLYPH[g]}</svg>`;

// marks the deck already shows for links that are not in RESOURCES (slide 16)
const LABEL_LOGO = {
  Pinterest: "pinterest.svg", Mobbin: "mobbin-platform.svg", "React Bits": "react-bits.svg", "Magic UI": "magic-ui.svg",
  daisyUI: "daisyui.svg", "shadcn/ui": "shadcn-ui.svg", "Aceternity UI": "aceternity-ui.svg",
};

function card(item) {
  const r = item.r;
  const logo = r?.logo ? path.basename(r.logo) : LABEL_LOGO[item.label];
  const mark = logo
    ? `<img src="assets/logos/${logo}" alt="">`
    : svg(r?.glyph ?? (/youtube\.com/.test(item.url) ? "play" : "link"));
  const bg = r?.tile ?? (item.label === "Mobbin" ? "#FFFFFF" : null); // the deck shows Mobbin's black mark on white
  const tile = bg ? ` style="background:${bg}"` : "";
  const kind = r ? `<span class="kind k-${r.kind}">${esc(res.KIND_LABEL[r.kind])}</span>` : "";
  return `<a class="card" href="${esc(item.url)}">
    <span class="tile"${tile}>${mark}</span>
    <span class="body">
      <span class="name"><bdi>${esc(item.label)}</bdi>${kind}</span>
      ${r?.what ? `<span class="what">${esc(r.what)}</span>` : ""}
      ${r?.note ? `<span class="note">${esc(r.note)}</span>` : ""}
      <span class="url" dir="ltr">${esc(host(item.url))}</span>
    </span>
  </a>`;
}

const PROMPT_CARD = `<a class="prompt" href="${esc(PROMPT_URL)}" download>
  <span class="ptile">${svg("download", 46)}</span>
  <span class="pbody">
    <span class="peyebrow">برومبت جاهز · حمّله وأعطه لـClaude</span>
    <span class="ptitle">AI Video Editor: محرّر فيديو بالوكيل</span>
    <span class="pwhat">ملف واحد يجهّز Claude كمحرّر فيديو: يثبّت أدوات هذا السلايد ويتحقق منها (Remotion، HyperFrames، FFmpeg، Whisper، yt-dlp)،
      يرتّب مجلدات Raw وReferences وExports، ويمشي معك من المراجع إلى التصدير.</span>
    <span class="pfile" dir="ltr">ai_video_editor_skill_addon.md</span>
  </span>
</a>`;

function linksPage(no) {
  const byUrl = Object.fromEntries(res.RESOURCES.map((r) => [r.url, r]));
  const items = (REFS[`s${no}`] ?? []).map((x) => ({ ...x, r: byUrl[x.url] }));
  const extra = no === 24 ? PROMPT_CARD : "";
  const cols = items.length <= 2 ? 2 : items.length <= 4 && !extra ? 2 : 3;
  return `<section class="page links${extra ? " dense" : ""}" id="l${no}">
    <header>
      <span class="eyebrow">روابط السلايد ${pad(no)}</span>
      <h1>${esc(TITLES[no])}</h1>
    </header>
    ${extra}
    <div class="grid c${cols}">${items.map(card).join("")}</div>
    <footer>الذكاء الاصطناعي في المجالات الإبداعية · ركايا</footer>
  </section>`;
}

const cover = `<section class="page cover">
  <img class="logo" src="assets/logos/rakaya-white.svg" alt="">
  <span class="eyebrow">روابط الورشة</span>
  <h1 class="ctitle">الذكاء الاصطناعي في المجالات الإبداعية</h1>
  <p class="csub">كل الأدوات والمصادر اللي شرحناها، مرتبة حسب السلايد. اضغط على أي بطاقة وتفتح.</p>
  ${DECK_URL ? `<a class="deck" href="${esc(DECK_URL)}"><span>العرض كامل</span><span class="url" dir="ltr">${esc(host(DECK_URL))}</span></a>` : ""}
  <footer>تقديم: عبدالملك الهندي · ركايا</footer>
</section>`;
const pages = [cover, ...LINK_SLIDES.map(linksPage)];

const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<title>روابط الورشة · الذكاء الاصطناعي في المجالات الإبداعية</title>
<style>
@font-face { font-family: Thmanyah; src: url(assets/fonts/thmanyahsans-Regular.woff2); font-weight: 400; }
@font-face { font-family: Thmanyah; src: url(assets/fonts/thmanyahsans-Medium.woff2); font-weight: 500; }
@font-face { font-family: Thmanyah; src: url(assets/fonts/thmanyahsans-Bold.woff2); font-weight: 700; }
@font-face { font-family: Thmanyah; src: url(assets/fonts/thmanyahsans-Black.woff2); font-weight: 900; }
@page { size: 1920px 1080px; margin: 0; }
* { box-sizing: border-box; margin: 0; }
html, body { background: #05080d; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: Thmanyah, system-ui, sans-serif; color: #e8eef6; }
.page { width: 1920px; height: 1080px; position: relative; overflow: hidden; break-after: page; }
.slide img { display: block; width: 1920px; height: 1080px; }
.links { padding: 96px 120px 80px; background:
  radial-gradient(1200px 600px at 85% -10%, rgba(56,189,248,.10), transparent 60%),
  radial-gradient(900px 500px at 0% 110%, rgba(255,122,0,.08), transparent 60%), #05080d; display: flex; flex-direction: column; }
header { margin-bottom: 48px; }
.eyebrow { display: inline-block; font-size: 26px; font-weight: 700; color: #ff7a00; letter-spacing: .02em; }
h1 { font-size: 64px; font-weight: 900; color: #f2f5f5; margin-top: 10px; line-height: 1.2; }
.grid { display: grid; gap: 28px; }
.grid.c2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid.c3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
a { color: inherit; text-decoration: none; }
.card { display: flex; gap: 26px; align-items: flex-start; padding: 30px 32px; border-radius: 22px;
  background: #0a1018; border: 1.5px solid rgba(165,216,255,.16); }
.tile { flex: none; width: 84px; height: 84px; border-radius: 20px; background: #16212e; display: grid; place-items: center; color: #a5d8ff; overflow: hidden; }
.tile img { width: 62%; height: 62%; object-fit: contain; }
.body { display: flex; flex-direction: column; gap: 8px; min-width: 0; flex: 1; }
.name { font-size: 32px; font-weight: 700; color: #f2f5f5; display: flex; align-items: center; gap: 14px; flex-wrap: wrap; line-height: 1.25; }
.kind { font-size: 18px; font-weight: 700; padding: 4px 12px; border-radius: 999px; border: 1.5px solid currentColor; }
.k-official { color: #a5d8ff; } .k-community { color: #ffc94d; } .k-video { color: #d6dee8; }
.what { font-size: 24px; color: #b3c4c6; line-height: 1.45; }
.note { font-size: 20px; color: #ffb25e; line-height: 1.4; }
.url { font: 500 21px/1.3 ui-monospace, "SF Mono", Menlo, monospace; color: #38bdf8; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 4px; }
.links.dense header { margin-bottom: 30px; } .links.dense h1 { font-size: 56px; }
.links.dense .card { padding: 24px 28px; } .links.dense .grid { gap: 22px; }
.links.dense .prompt { padding: 26px 34px; margin-bottom: 24px; }
.prompt { display: flex; gap: 34px; align-items: center; padding: 34px 40px; margin-bottom: 32px; border-radius: 26px;
  background: linear-gradient(90deg, rgba(255,122,0,.16), rgba(255,122,0,.04)); border: 2px solid #ff7a00; }
.ptile { flex: none; width: 104px; height: 104px; border-radius: 24px; background: #ff7a00; color: #05080d; display: grid; place-items: center; }
.pbody { display: flex; flex-direction: column; gap: 8px; }
.peyebrow { font-size: 22px; font-weight: 700; color: #ffb25e; }
.ptitle { font-size: 40px; font-weight: 900; color: #f2f5f5; }
.pwhat { font-size: 24px; color: #e8eef6; line-height: 1.5; max-width: 1400px; }
.pfile { font: 600 22px/1.3 ui-monospace, "SF Mono", Menlo, monospace; color: #ff7a00; text-align: right; }
footer { margin-top: auto; font-size: 20px; color: #4a5b6c; }
.cover { padding: 140px 160px 80px; display: flex; flex-direction: column; background:
  radial-gradient(1200px 700px at 90% -10%, rgba(56,189,248,.14), transparent 60%),
  radial-gradient(1000px 600px at 0% 110%, rgba(255,122,0,.12), transparent 60%), #05080d; }
.cover .logo { height: 70px; align-self: flex-start; margin-bottom: 110px; }
.ctitle { font-size: 104px; font-weight: 900; color: #f2f5f5; line-height: 1.15; margin: 16px 0 28px; }
.csub { font-size: 38px; color: #a5d8ff; font-weight: 500; }
.deck { margin-top: 56px; align-self: flex-start; display: flex; gap: 26px; align-items: baseline; padding: 24px 36px; border-radius: 20px; border: 2px solid #ff7a00; background: rgba(255,122,0,.1); font-size: 34px; font-weight: 700; }
.deck .url { font-size: 28px; }
</style>
</head>
<body>
${pages.join("\n")}
</body>
</html>`;

fs.writeFileSync(new URL("./links.html", import.meta.url), html);
console.log(`pages: ${pages.length}`);
