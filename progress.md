# Session Progress Log

Newest entry on top. Keep each entry short: state, evidence, next step.

## 2026-11-25: Slides 27–31, the session behind the intro video (ai-covers)

- Owner's pick: the five-slide structure without the versions slide, the chat direction for the dialogue/confirm slides, approved («اعتمد»). New: 27 `S27SessionJourney` (six-stage FlowRail, one click per stage, the stage's idea in a card), 28 `S28Decisions` (six cards staggered; effects as LTR chips), 29 `S29Dialogue` (Claude's way ↔ your answer as chat bubbles, two pairs per click), 30 `S30Confirm` (a Claude chat window showing the session moment for each of five reasons; owner's words in «»; number ranges wrapped in LRI/PDI so «13–15» reads right), 31 `S31Checkpoints` (six ✓ points on one line, then the takeaway). Copy in `copy.ts` (JOURNEY, DECISIONS, DIALOGUE, CONFIRM, CHECKS), notes s27–s31.
- Renumbered: data entry 32, 3D 33, closing 34 (registry ids s32–s34, files keep their names; notes keys moved; resources slide 27→32, 28→33; TRACKS; refs.ts now derives its slide list from RESOURCES). README counts updated. Links PDF re-rendered (pages for 32/33).
- Evidence: tsc clean; build passed; production :3200 in DevTools Chrome at 1920×1080: 27 at stage 3 (chain with arrows), 28 all cards (content inside every card after the chips fix), 29 all six pairs, 30 reasons 1, 3 and 5 (strikethrough history, ranges read correctly), 31 points + takeaway; 32/33/34 open with their titles. Screenshots looked at.

**Next:** owner's look at 26–31 on the projector; GitHub link for the deck and the prompt (DECK_URL / PROMPT_URL in output/slides-pdf/build.mjs).

## 2026-11-25: Slide 26 rebuilt around the intro video + light links PDF (ai-covers, output/slides-pdf)

- Slide 26 (owner picked option 2 of 4 original layouts; no library fitted a slide composition): the presenter's intro video v4 (`public/deck/media/s26/intro-v4.mp4`, re-encoded 8 MB from `~/Desktop/my website/v2/abdulmalik-intro/out/final.mp4`, original untouched; `MEDIA.s26Intro`) plays and loops; under it «البرومبت: جدول لقطات بالثواني» with the five PROMPT-v4 shots as a left-to-right bar whose fill and current shot follow the video. Click 2: five tool chips with roles (Remotion البناء، React Bits التأثيرات، Playwright التصوير، FFmpeg الفحص، HyperFrames المعاينة). Sub «كيف سوّيت فيديو تعريفي بالوكيل؟»; registry title updated, status ready; notes rewritten (stages and versions stay in the notes). New resources `react-bits`, `playwright` (slide 26). The presenter window's previews now mute any video (the audience screen carries the sound).
- Evidence: tsc clean; build passed; production :3200 in DevTools Chrome at 1920×1080: slide 26 video plays (t 5.5 s after 6 s, readyState 4), bar fill and orange current shot track it (الأعمال المختارة at ~13 s), click 2 shows the five chips, nothing past the stage edge. Screenshots looked at.
- Links PDF: owner will share the deck itself as a GitHub link, so the PDF is references only and light for WhatsApp: `output/slides-pdf/workshop-links.pdf` (12 pages, 1.1 MB, 41 links): a cover + one page per slide 11, 15, 16, 17, 19, 22, 24, 25, 26, 27, 28 (data from refs.ts/resources.ts via `build.mjs`; `./render.sh` rebuilds it and `preview/`). Slide 24's page carries the download card for the AI Video Editor prompt. `DECK_URL` and `PROMPT_URL` at the top of `build.mjs` are to fill once the GitHub link exists (the prompt link is relative until then, so it breaks if the PDF travels alone).

**Next:** owner sends the GitHub link(s) → set DECK_URL / PROMPT_URL, `./render.sh`. Slide 26's links page still lists ElevenLabs and HUMAIN Voice (the old slide's voice tools); ask whether to keep them.

## 2026-11-25: Presenter window shows live previews instead of notes/refs (in ai-covers)

- `/deck/notes` (`app/deck/notes/NotesWindow.tsx`): «ملاحظات الإلقاء» and «المراجع» are no longer shown (data kept in `content/notes.ts` / `refs.ts`). In their place, two view-only previews built from the real slide components + `DeckBackground` + `Stage` (16:9, no crop, pointer-events none, inert): right «السلايد الحالي» at the audience's current step (with n / total and the step list under it), left «السلايد التالي» a little smaller, from its first step. On the last slide the second preview is hidden. Header buttons (رجوع / إعادة السلايد / التالي) and keys unchanged. The deck's state message now also carries the slide's replay counter (`epoch`, optional) so «إعادة السلايد» restarts the preview; the audience screen is otherwise unchanged.
- Evidence: tsc clean; build passed; production :3200 with the deck and /deck/notes in two tabs of the same browser: on open 01 «الغلاف» right / 02 «الافتتاحية» left; التالي → 02/03, → 03 (1/4)/04; a step inside 03 → current 2/4 with next still 04; رجوع back to 02/03; at 1024 px wide current 533×300 (x 459–992), next 395×222, both ratio 1.778, no horizontal overflow; reaching 29 hides the next preview, back to 28 (5/5) shows 29 again; no console errors. Screenshot looked at.

**Next:** owner's look at the presenter window on the laptop.

## 2026-11-25: Slide 29, the closing (in ai-covers)

- New last slide `deck/slides/S29Closing.tsx` (one click-stage), registered after 28 as «الختام والأسئلة»; copy `S29` in `copy.ts`, empty `s29` notes. No other slide touched. «شكرًا لحسن استماعكم» centred (120 px black, mist, deck face) → Malik (the deck's WamdaActor, orange, idle, scale 6, glow) rises from the bottom edge and settles → his SpeechBubble (Unixel, orange, typed, tail toward him) on his right: «اللي عنده سؤال لا يستحي يسأل عبدالملك». Everything then stays; nothing exits or advances.
- Evidence: tsc clean; build passed; production :3201 at 1920×1080 in DevTools Chrome, real time: title 0.33 → 0.92 s, Malik moves from 1.57 s and settles at 2.55 s (top 554), bubble from 3.18 s, title still at opacity 1 at 6 s; final screenshot looked at (bubble clear of the title and his face, RTL text); no console errors.

- Revised (owner, same day): two clicks. On entry only «شكرًا لحسن استماعكم» (top 210, on screen from the start); second click → Malik (now scale 5, centred, x 780–1140, y 650–1030) rises 0.18 → 1.15 s, then the bubble (same size: font 40, max 640) at 1.8 s sits above his head (881–1521 × 458–634) with its tail coming down onto the top of the hood (tip ≈ x 960). Production :3201 measured and screenshot looked at (`reports/s29-closing.jpeg`): title box ends at 360, nothing overlaps the title or his face. tsc clean; build passed.

**Next:** owner's look at slide 29.

## 2026-11-25: Slide 25 simplified, official logos (in ai-covers)

- Each card now shows: the site's own logo, the name, the library's line, and the prompt excerpt right under it. The example label, name, line and example links are gone (copy `S25`, resources' `example` field, refs and notes updated). Title and sub unchanged.
- Logos: saved unchanged from each official site to `public/deck/logos/tracks/` (prompt-motion.com/icon.svg; kineprompt.com/favicon.svg, the header mark on its tile; promptreels.vercel.app/brand/mark.svg, the header logo). All are square SVG app icons, shown as `logoKind: "icon"` at 136 px (slide 24's tile size): no crop or stretch.
- `AppCard` size `col` is now top-aligned (46 px padding) so logos and names line up; cards 540×500. Sizes `lg`/`md` (slides 19, 24) unchanged.
- Evidence: tsc clean; `npm run build` passed; production restarted on :3200. On #25: three logos load from local files, three hidden links (library URLs), no «المثال» text; logo top 48 px in every card; Shift+arrows 25 → 26 → 25 → 24 → 25.

## 2026-11-25: New slide 25 «مكتبات برومبت جاهزة» (in ai-covers)

- Inserted after slide 24: title «مكتبات برومبت جاهزة», sub «برومبتات الأنيميشن». Three cards on slide 24's `AppCard` (new size `col`): prompt glyph, site name (English, LTR), the library's line in the deck blue, then an example block (name, one line, prompt excerpt in mono). One click shows them, staggered like 24.
- Owner asked for links on this slide: the name opens the library and the example block opens the example, through hidden links (`HiddenLink` in `kit/AppCard.tsx`: new tab, no underline/arrow/focus ring). No address on screen. URLs live in `content/resources.ts` (`example` field), and refs/notes list them.
- Renumbered: old 25–27 → 26–28 (files `S26InfographicWorkflow`, `S27DataEntry`, `S28Watch3D`; copy `S26–S28`; ids/notes `s26–s28`; resource `slide` numbers; TRACKS; README). Media keys kept as they were (`MEDIA.s25Example`, `MEDIA.s27`, folders `media/s25`, `media/s27`).
- Evidence: tsc clean. Dev server :3310 (stopped afterwards): slide 25 at 1600×900, all six links have the right targets and each URL returned 200; clicking a link leaves the deck on #25; ←/→ and Shift+arrows walk 23 ↔ 24 ↔ 25 ↔ 26 ↔ 27 ↔ 28 with the right titles; overview and notes show slide 25. Then (owner's go-ahead) `npm run build` passed and production restarted on :3200; slide 25 checked there (title, three cards, six links). Pre-change copies in the session scratchpad.

**Next:** the owner's look at slide 25 on the big screen.

## 2026-11-24: Slide 20 UX Planning opens with the raw notes (in ai-covers)

- New click «notes» before the Figma canvas (slide 20 now has 6 clicks; Visual Research, Creative Direction and the board click unchanged). The two source cards head two columns, and under each the raw notes appear one by one, every 0.5 s, as tilted paper scraps: under «نتائج البحث» four interview excerpts, under «الاستبيان» three replies, topics mixed. They use the Affinity Map's own texts. No canvas, no agent, no sorting yet.
- Next click: the canvas opens, the same seven note elements fly into the Affinity Map frame and land scattered, the cards move aside to their old place on the right, and the agent arrives (0.85 s). The notes then gather under إعادة الطلب / وضوح السعر / الاستلام, turning each cluster's colour as the agent clicks it (3.0 / 3.8 / 4.6 s). Then «الأكثر تكرارًا», then the Persona, timed as before. The notes are one layer above the canvas: it is clipped to the canvas and pans −630 px with it on the board click.
- Files: `deck/slides/S20UIUXWorkflow.tsx` (step, notes layer, named analyze beats `AB`), `deck/content/notes.ts` (s20 clicks 3–5). `copy.ts` was not changed. Pre-change copies are in the session scratchpad.
- Evidence: tsc clean; build passed; production :3200 at 1920×1080 in a DevTools Chrome, measured in real time. Cards appear at 0.43 s and the scraps at 0.93 → 4.13 s. On the next click: 0 frames of card/note contact; note overlaps ≤10.5 % of a box (corners only) in flight and when landed. Final note and card rects are identical to the old layout, and on the board click every note and head moves exactly −630 px, clipped at the canvas. Frozen frames at 1.0 / 2.8 / 3.2 / 4.15 s and the notes click were looked at; every text was readable. Forward and back walk direction ↔ notes ↔ analyze ↔ board, then 20 → 21 → 20: all states correct. No console errors. Screenshot: `reports/s20-raw-notes.jpeg`.

**Next:** owner's look at slide 20 clicks 3–4 on the big screen.

## 2026-11-24: Slide 24 OpenMontage card shows the official README mark (in ai-covers)

- Checked github.com/OpenMontageInc/OpenMontage in the browser: «The first open-source, agentic video production system» (turns an AI coding assistant into a video studio), the project the card means. Its README header shows `assets/monty-dark.svg` / `monty-light.svg` («Monty the Clapper — the official mascot of OpenMontage»); openmontage.video uses the same character as its header logo (`/monty-mark.svg`) and favicon. The repo's `assets/logo.png` (a raster JPEG, a glowing play button) is byte-identical to the icon the card had.
- `public/deck/logos/tracks/openmontage-monty-dark.svg` = the repo file, unchanged (sha256 9dc12175…0e49; the dark-mode variant, as the README shows on dark). Only slide 24's card uses it (`CARD_LOGO` in `S24VideoTools.tsx`: shown as a mark, fit 0.86, object-fit contain); `resources.ts` keeps logo.png, so slide 25's chip and /deck/refs are unchanged. The file carries its own idle animation (gentle float, clapper opens every ~5 s); left as is (original file).
- Evidence: tsc clean; build passed; headless Chrome 1920×1080 on the production build: OpenMontage card src = the SVG (200×200), contain, 117 px in the 136 px tile, centre offset 0.01 px; the drawing stays inside its 200×200 frame across its animation (measured bbox 22–182 × 15–182); other five cards unchanged (same src/sizes); name and line unchanged; slide 25 chip still openmontage.png; screenshots looked at.

**Next:** owner's look; if the mark's own idle animation is unwanted, a still frame can be used instead (would change the file).

## 2026-11-24: Slide 17 Higgsfield box shows the channel screenshot, with a hidden link (in ai-covers)

- Owner's screenshot of youtube.com/@HiggsfieldAI/videos saved as `public/deck/media/s17/higgsfield-youtube-channel.webp` (2000×1250, as supplied). `MEDIA.s17Higgsfield` got `poster` + `link`; `deck/kit/VideoSlot.tsx` shows a still when there is no video file (object-cover, anchored at the top), and wraps it in a link when `link` is set: new tab, the deck's own cursor (overrides the pointer rule), no underline, outline, title or hover; the title chip ignores clicks.
- Owner's exception recorded in both CLAUDE.md «Presentation Rules» (hidden link on one named element only).
- Evidence: tsc clean; build passed; headless Chrome at 1920×1080 on the production build (:3206): link present only on the Higgsfield step (hidden on intro/azzam), href https://www.youtube.com/@HiggsfieldAI/videos, target _blank; with the mouse active the cursor over the still = the deck cursor (same value as the stage), text-decoration none, outline none, no title, no URL text on screen; still loaded 2000×1250; a real mouse click in its middle reached the link (navigation blocked in-page for the test) and the deck stayed on the Higgsfield step (closing line still hidden). Screenshot looked at.
- Open: the box's «Higgsfield AI» title chip now sits over YouTube's logo in the screenshot; left as is (owner only asked to swap the image).

**Next:** owner decides whether the title chip stays over the screenshot.

## 2026-11-24: Slide 06 step 3: clear strike, then a straight rise (in ai-covers)

- `deck/slides/S06Motion.tsx` only. «Image» stays still facing the room while an orange (`D.agent`), 6px strike draws across the middle of the word only (0–250 ms, linear); the struck word holds ~0.5 s; then word + strike rise straight up (translateY only, ease-in-out, 750–1200 ms), fully opaque until the last third of the rise, then gone; «Video» enters from below with the same motion as before (1200–1680 ms). No rotation, flip or perspective on «Image». Steps 2 and 4–7 unchanged.
- Evidence: tsc clean; build passed; real-time check at 1920×1080 in a headless Chrome (CDP script in the session scratchpad, no deps; the built-in pane was hidden and the DevTools MCP Chrome was busy with another session): 103 frames sampled over 2 s from the key press: strike complete at 260 ms, rise starts at 810 ms (held struck 550 ms), no 3D transform in any frame, opacity ≥ 0.95 while rising, Image gone at 1254 ms, Video appears at 1254 ms and settles at 1610 ms, «Generation» x = 1565.8 in every frame; screenshots at 196/525/981/1344/1528/2148 ms looked at (strike drawing, struck hold, rising readable, Video settled); step 2 = «Image Generation», steps 4–7 «Video Generation», next click → #07.

**Next:** owner's look on the big screen.

## 2026-11-24: Cover (slide 01): first title line lifted (in ai-covers)

- `S01Cover.tsx` only: `LINE1_LIFT = 42`, applied as `translateY(-42px)` to the first line's span in every depth layer, so «الذكاء الاصطناعي» moves up as one solid; «في المجالات الإبداعية» stays where it was. Text, font, size, weight, colours, depth, perspective, camera motion, box, logo, subtitle and presenter line unchanged.
- Why 42: measured on 1920×1080 renders (Chrome via devtools, reduced motion = the resting angle rx 18.7 / ry 7.8, each line isolated by hiding the other). Only one spot touched: the two dots under the final «ي» and their depth sat on «الإبداعية» (elsewhere already ~10px apart). They clear at ~34px; above ~45px the dot of «ذ» reaches the box's front top edge. 42 balances both.
- Evidence: tsc clean; build passed (after another session's build finished); production :3201. Resting angle: 9px between line 1 (with depth) and line 2, 6.3px from line 1 to the box's top edge. Sway ends (rx 21, ry 13 / −3): 4.0 / 5.4px below, 6.0px above. Line 2's screen rect identical (376–577 × 243–1608); background, box, logo and subtitle pixel-identical except the gizmo and agent pointer, which move on their own. The box's thin back edge now passes behind the tops of line 1 (depth-correct). No console errors.
- Note: with the presenter's mouse near the top of the screen (camera tilt up to 27°), the «ي» dots' depth can still reach line 2. That is outside the resting sway and was not changed.

## 2026-11-24: Slide 06 gets a title-only step (in ai-covers)

- New step 3 «retitle» between the question and the frames: on the right card, a quick strike draws over «Image» (0–260 ms), «Image» rolls up and out (300–720 ms), «Video» rolls in from below and settles (580–1060 ms); «Generation» never moves (the word sits in a slot anchored to it, the heading is anchored on the right of its row). Plays once on every entry to the step (forward or back); back to step 2 shows «Image Generation»; steps 4–7 are the old 3–6 unchanged, with «Video Generation». 7 steps now (was 6).
- Files: `deck/slides/S06Motion.tsx` (step + `ImageHeading` + keyframes, reduced-motion = instant), `deck/slides/compare/parts.tsx` (`PanelHead` optional `title`; only slide 06 uses it), `deck/content/copy.ts` (`S06.heading`).
- Evidence: tsc clean; build passed; production build on :3206: heading Image at steps 1–2, Video from step 3 on; animations seeked frame by frame (strike scale 0→1 by 260 ms, Image opacity 1→0 and y 0→−37.8, Video opacity 0→1 and y 37.8→0 by 1060 ms), «Generation» x identical at every sample and in every state; three frames looked at (struck / rolling / settled); steps 4–7 forward (frames, code, result, edit question) and one more click → slide 07; back to step 3 replays, back to step 2 restores Image; no console errors. Real-time playback not watched (the pane was hidden, so Chrome paused animations; checked by seeking).

**Next:** owner's look at slide 06 on the big screen.

## 2026-11-24: Slide 02: bigger opening question (in ai-covers)

- `S02Opening.tsx` only. Question 104 → 124 px (black weight, mist; «ذكاء اصطناعي» still in sky, same word-by-word entrance). Text box widened (side padding 180 → 90 px). The words are now separated by real spaces instead of margins (the font's space is 0.25 em, the old margin 0.26 em), so `text-wrap: balance` can even the lines and each line centres on its own ink; «ذكاء اصطناعي» is held together (nowrap) so the accent never splits.
- One line is impossible at any bigger size: the whole question is ≈23 em (2395 px at the old 104 px), wider than the 1920 stage. The stage scales as one piece, so it is two lines on every screen. 124 px is the largest size whose longer line fits with about 100 px on each side (projector title-safe width). The break stays after «اصطناعي», the only split that keeps the term whole and is not top-light.
- Text unchanged: «لو بنهديك…واحد،إيش…» as in copy.ts. The owner's new message wrote «لو بهديك… واحد، إيش» (no ن, a space after the comma) but also said to keep the wording, so this is asked, not applied.
- Evidence: tsc clean; build passed; production :3201. At 1920×1080: 124 px, block y 373–707 (centre 540), line 1 «لو بنهديك اشتراك ذكاء اصطناعي» 1720 px with 100 px each side, line 2 1104 px with 408 px each side. At 1440×900: 93 px rendered, 75 px each side, clear of the toolbar. At 1024×768: 66 px rendered, 53 px each side. No console errors.

## 2026-11-24: Slide 17: Azzam poster upright, full height, no frame (in ai-covers)

- Supersedes the entry below. On the «azzam» click, while `MEDIA.s17Azzam.src` is empty, `S17AISlop.tsx` shows the poster on its own: centred under the question in a box from y 252 (40 px under it) to 48 px above the bottom; `height: 100%`, `width: auto`, `object-fit: contain`; no frame, no title pill, no rounded corners (they would clip it), only a soft shadow. The 16:9 frame now carries only Higgsfield (and Azzam again if a video file is ever set). The `VideoSlot` poster fallback added earlier today is removed (back to its original code).
- Evidence: tsc clean; build passed; production :3201. At 1920×1080 the poster is 582×780 at (669, 252), centre x 960, ratio 0.7462 = the file's, 40 px under the question, 48 px above the bottom, clear of the toolbar. At 1440×900 the stage is letterboxed (45–855) and the poster is 437×585, bottom at 819, inside both stage and screen. Higgsfield, closing and back all OK; no console errors.

## 2026-11-24: Slide 17: the Azzam poster in the film's frame (in ai-covers)

- The owner's poster of «أثر الفراشة: عزام» (1194×1600 JPEG, from the chat) → `public/deck/media/s17/azzam-poster.jpg`; `MEDIA.s17Azzam.poster` points to it (`src` still empty).
- `VideoSlot` (used only by slide 17): with no video file but a poster, it shows the poster whole (`object-contain`, 470×630 in the 1120×630 frame) on a dark, blurred copy of itself. A video file, once set, still takes over. The frame, the title pill, the clicks and the Higgsfield slot are unchanged.
- Evidence: tsc clean; build passed; production :3201: the Azzam click shows the full poster centred, pill clear of it; Higgsfield still the placeholder; closing unchanged; no console errors.

## 2026-11-24: Mobbin logo on a white tile (slides 16 and 19) (in ai-covers)

- Slide 16: `BRANDS.mobbin.logoTile = "#FFFFFF"`. `BrandMark` draws a logo file on a tile of that colour (same 170 px / r 42 as the Behance and Dribbble tiles, logo at 62 %). `platforms/mobbin.svg` fill white → black (#000000, Mobbin's light-theme colour; path unchanged).
- Slide 19: Mobbin MCP's logo (the same black file, `tracks/mobbin.svg`) is no longer an edge-to-edge «icon». It sits on its tile like Figma's (62 %), on a new optional `Resource.tile` = `#FFFFFF` that `ResourceMark` uses instead of the dark tile; no other resource sets it. Cards, slide and other tiles unchanged.
- Evidence: tsc clean; build passed; production :3201. Slide 16: Mobbin tile rgb(255,255,255), 170², r 42, same top as the others, card bg unchanged. Slide 19: Mobbin MCP tile rgb(255,255,255), 196², r 47 like Figma and Figwright (still panel3), logo 122²; no console errors.

## 2026-11-24: Slide 02: the opening question (in ai-covers)

- `S02Opening.tsx` shows only `S02.question` «لو بنهديك اشتراك ذكاء اصطناعي واحد،إيش راح تختار؟», exactly as the owner wrote it (no space after the comma). It uses the deck's question treatment from slide 13: centred, 104 px black weight in mist, words arriving one by one (`lab-word`), «ذكاء اصطناعي» in sky. No answers and no other text. Registry status pending → ready; notes s02 updated; one step («السؤال الافتتاحي للقاعة»).
- Evidence: tsc clean; build passed; production :3201 at 1920×1080. h1 centred (960, 540), 104 px, two lines (break after «اصطناعي»), all words at opacity 1 after the entrance, sky only on ذكاء / اصطناعي, no other text in the stage.
- Open: the owner's text has «واحد،إيش» without a space after the comma; kept as written.

## 2026-11-24: Slide 23: bigger idea card with a note, icon reference tiles (in ai-covers)

- Only the «فكرة الفيديو» section (`S23IdeaToAnimation.tsx`, `S23.ideaNote` / `S23.refKinds` in copy.ts). The card is wider (300 → 340, growing left; right edge unchanged) and 30 px lower (y 430). Under its title is the note «نناقش فكرة الفيديو مع شات بوت، وفي نهاية المحادثة نطلب منه يكتب برومبت للوكيل.» (22 px, mist), with a no-break space keeping «شات بوت» on one line.
- The three gradient squares are now three equal tiles (100×84, panel bg, sky border) with Hugeicons `TextIcon` (T), `Image01Icon`, `Link01Icon` in sky, right to left, as wide together as the card. They have no visible labels (aria-labels نص / صورة / رابط only). «المراجع» stays under them.
- The arrow now leaves the card's middle (`IDEA.mid` 100) for the agent's middle (`AGENT.y + 100`). The beats and the rest of the slide are unchanged.
- Evidence: tsc clean; build passed; production :3201 at 1920×1080, the click to its final state. Card 1486–1806 × 460–657 (centre y 558, agent centre 566), note 3 lines, tiles 94 px each across 1486–1806, label 777–814, closing at 864, 77 px from card to agent. Back clears the flow; no console errors.

## 2026-11-24: Slide 27: Blender intro like slide 26; bare Blender logo on the MCP node (in ai-covers)

- First click («ref»): the «Claude + Blender MCP» video card is replaced by slide 26's tool block, same sizes and gaps (`TOOL` logo 210 / name 58 / note 28, mt 26 / 14, beats 100 / 380 / 640). It shows the Blender logo (`logos/mcp/blender.png`, already used on this slide), «Blender MCP» in black weight, and the note «راح نشارككم فيديو يوضّح طريقة الربط خطوة بخطوة.» (`S27.tool`). It is centred under the path (top 430, where the card was) and leaves on the next click as the card did. The video link stays in resources.ts (refs page and presenter window). Notes s27 line 1 updated. Slide 26 untouched.
- Second request: the Blender MCP node (after Claude) lost its tile, orange frame, background, glow and plug badge. Only the Blender logo is left (112 px) in the old tile's 120 px box, so its centre, the label, the arrows and the pop-in are unchanged; the `Plug01Icon` and `Icon` imports were removed.
- Evidence: tsc clean; build passed; production :3201 at 1920×1080. Intro settled: logo 197 / name 60 / note 37, gaps 24 / 13, centre 960, the same as slide 26 (197 / 60 / 37, 25 / 13). Every click forward: the intro reaches opacity 0, then sheet, Claude, Blender, final. Node box: transparent, no border or shadow, one child, centre (1180, 573). Back to the first click restores the intro; no console errors.
- Note: ai-covers now shows as a git repo (`main`, staged changes), set up outside this session; nothing committed from here.

## 2026-11-24: Deck toolbar: compact navigation pinned bottom-right, tools unfold to the left on hover (in ai-covers)

- `deck/engine/Deck.tsx` `Toolbar` only (plus one class on `NotesDrawer`). Same pill, colours, buttons and icons. The navigation group is `fixed`, 32 px from the screen's right edge and 64 px from its bottom (`BAR`), the same in both states. Compact: previous arrow, number, title, a small down caret (Hugeicons ArrowDown01Icon), next arrow. While the pointer is anywhere on the bar (or focus is inside it), a `motion` width animation (0 → auto, 0.32 s) opens the rest to the LEFT in the original order: step dots, divider, replay, notes, presenter window, refs, overview, dev, full screen. Leaving the whole bar folds it back; hidden tools are `inert`.
- The step dots moved from the compact group into the unfolding part, because the owner's compact spec lists only arrows + name + number + caret.
- An earlier draft in this session anchored the bar bottom-left of the stage (the first spec); the owner corrected it mid-turn to bottom-right of the screen. Only the final version is in the code.
- `NotesDrawer`: `bottom-24` → `bottom-[138px]`. With the bar moved to the bottom-right, the open drawer covered its top 26 px; it now ends 16 px above the bar.
- Evidence: tsc clean; build passed; production :3201 at 1920×1080. Compact: bar right 32 / bottom 64, tools width 0 and inert. Open: bar grows left (1510 → 1073), navigation stays at x 1517.4–1881 in both states, items right to left in the original order. Pointer out: back to width 0, navigation unmoved. Notes open: 16 px clearance. Space still advances (step 2/5); Tab focuses the bar and opens it. At 2400×1080 the bar stays 32 px from the screen edge. Stage rect unchanged. The pane was hidden, so the width animation was judged on its end states.

## 2026-11-24: Slide 26: Chrome logo + «Chrome DevTools MCP» instead of the two cards (in ai-covers)

- First click («refs»): the two ResourceReference cards are gone. In order on entry (beats 100 / 380 / 640 ms): the official Google Chrome logo (210 px, centred right under the title), «Chrome DevTools MCP» in black weight, then the small note «تقدر تضيفه بسرعة في Codex وغيره من قسم Client configurations.» (`S26.tool`). The flow then fades in at its usual place (1.25 s). No setup steps and no links on the slide.
- The «run» click is unchanged: the Chrome block leaves the way the cards did, the flow lifts, and the simulation plays to review. Flow steps, order and motion are untouched.
- Logo: `public/deck/logos/tools/chrome.svg` = google.com/chrome/static/images/chrome-logo-m100.svg (Google's own Chrome site), copied byte for byte. The two s26 entries in resources.ts stay (the /deck/refs page and the presenter window). Notes s26 line 2 now says the setup is explained aloud.
- Evidence: tsc clean; build passed; production :3201 at 1920×1080. Measured on entry: title 64–147, logo 214–411 (centre 960, loaded), name 436–496, note 509–546 (text exact, full stop on the correct side), flow about 620. Run: Chrome block opacity 0, simulation to «بانتظار مراجعتك» with the subtitle shown. Back restores the intro. The only anchors are the deck toolbar's /deck/notes and /deck/refs; no console errors.

## 2026-11-24: Slide 16: official Pinterest and Mobbin logos (in ai-covers)

- New files in `public/deck/logos/platforms/`, each with its source in a comment inside:
  - `pinterest.svg`: the badge from pinterest.com's own header logo (aria-label «Pinterest logo»). Its first two paths are copied unchanged (white circle + badge in `#E60023`), so it is the red circle with a white P; the wordmark is left out because the card prints the name.
  - `mobbin.svg`: the logo in mobbin.com's header (home link, `<title>Mobbin</title>`, 139:64), path unchanged; the site's `currentColor` set to white for the dark card.
  - Mobbin's own `favicon.svg` (and `tracks/mobbin.svg`, used by slide 19) is a PNG wrapped in SVG, so it was not used here.
- `deck/media/brands.tsx`: `logo` set for `pinterest` and `mobbin`. Only slide 16 uses these two entries; slide 19's Mobbin card has its own file. `BrandMark` already draws a logo file `object-fit: contain` in the same 170 px box, so proportions are kept and the mark is centred. Texts, layout, Behance and Dribbble unchanged.
- Evidence: tsc clean; build passed; production :3201 at 1920×1080, the platforms click. Both files loaded (natural 18×18 and 139×64); the mark box is 170×170 on all four cards, centre offset 0, same top (94 px) and same name top (298 px); no console errors.

## 2026-11-24: Slide 7: Malik stands still, waves with his hand only, then introduces himself (in ai-covers)

- The «reveal» click now plays: the reveal (250 ms + 2 s) on one still standing frame with the hand raised (no bob, no frame cycling) → two waves (2 s) where only the hand turns about the wrist → the orange pixel-font bubble above him on the right, tail at its bottom-left toward him, typing `S07.greeting`: «أهلًا، أنا مالك. توّي متخرّج، فتحمّلوني على كثرة أسئلتي. علّموني طريقتكم، والباقي عليّ.» (no «» quote marks, like the other bubbles). The «question» click is unchanged; he stays still and the bubble stays. The silhouette step is unchanged.
- Why new clips: the sprite's `wave` clip alternates walking frames (0, 2) with hand-up frames (1, 3), so the whole body moved; idle frames differ by 19–29 % of body pixels from the hand-up frame. Added to `components/lab/wamda/Wamda.tsx` (additions only, existing clips untouched): `stand` = wave frame 1 held still, `greet` = that frame with only the hand (x 48–59, y 28–38) turned on the sprite grid about the wrist (48.5, 38), angles 0/8/14/8/0/−8/−12/−8 at 8 fps. `deck/character/Wamda.tsx`: acts `standing` and `greeting`. S07 uses `useBeats` (greet at 2.35 s, speak at 4.35 s); the look turns orange as the wave starts, so the reveal never replays.
- Evidence: tsc clean; build passed; production :3201 at 1920×1080: silhouette, the reveal at 1 s / 2.8 s / 5.8 s / 10.8 s, then the question. Frames checked with the same logic as the TS: each greet frame differs from the still frame only in x 46–58, y 27–39 (≤ 59 px), and frames 0 and 4 are identical to it. Bubble 1090–1790 × 96–330, tail 1160–1190 × 330–356, text matches exactly; `deck-bob` none; no console errors. The pane was hidden, so the wave itself was checked on the frames, not seen moving in the browser.

## 2026-11-24: Slide 6: new edit question, no MP4 + Audio bars, new result badges (in ai-covers)

- copy.ts `S06`: `edit` → «طيب، لو بغينا نعدّل شيء في منتصف الفيديو؟» (was «…في نص الفيديو؟»). Image flow ends in «مجموعة من الصور المولّدة تكوّن فيديو», code flow in «فيديو مسجّل» (both were «فيديو مع الصوت»); «عناصر بالكود» and the middle steps unchanged. `S06.result` removed.
- `S06Motion.tsx`: the `Player` (pill, waveform, play button, «MP4 + Audio») is deleted on both sides. The «result» click stays (it lights the last step on both paths), so the click count and motion are unchanged; its label was updated. The panels end 56 px under the steps row (`PANEL_H` 675, was 720) through a new optional `h` on `PanelBox` (compare/parts.tsx; slide 5 keeps the default, checked: 180 / 720).
- Evidence: tsc clean; build passed; production :3201 at 1920×1080, every click. The long badge is 360 px with nothing cut (scrollWidth = clientWidth), 34 px inside the panel edge, 10 px from its arrow like the others. The steps row ends 53 px above the panel bottom; the regenerate block (532–765) fits above it. Back from the last click restores the first question. 0 «MP4 + Audio»; no console errors. Speaker notes s06 untouched (line 2 still says the result can be video with sound on both paths).

## 2026-11-23: Slide 23 storyboard labels, even frames, centred play button (in ai-covers)

- Only slide 23 changed (`S23IdeaToAnimation.tsx`, plus `S23.storyboard` and `S23.scenes` in copy.ts). Same two steps and the same beats inside the one click.
- Storyboard: «Storyboard» centred over the group and «مشهد 1/2/3» centred over each frame, right to left; they appear with the frames. The frames are one size (160×100, was 150×96) on one row, centred between the video and the agent, on a lighter ground (`D.panel3`). Each scene is drawn relative to its frame with a 16 px inset. Before motion each frame shows its layout: a faint path, bar stubs, placeholder lines. Fixed: scene 1's ball used to end on the frame's edge and get cut.
- Video: the frame now composes the three scenes' parts around its edges (title top right, chart bottom right, ball bottom left), so the 76 px play button sits in the exact middle without covering anything. Fixed: the old first mini-scene showed nothing, because its ball was outside its box, and the button sat at 62 % height. The play glyph keeps a 2 px optical nudge toward its point.
- The storyboard frames, the video and both arrows share one centre line (`MID`).
- Evidence: tsc clean; build passed; production :3201 at 1920×1080: title stage, then the click at ~2.6 s (storyboard), ~3.8 s (motion and sound) and the final state. Measured in the final state: frames identical (150.4×94 on screen after TrackBody ×0.94) with the same top, centre y = the video's centre; labels and «Storyboard» centred (offset 0); details ≥ 15 px inside each frame; circle centred in the video (0, 0), 73 px from every edge; icon centred vertically, +1.9 px horizontally (the nudge). 12 flow elements: no overlaps, none off stage, all opacity 1. Back to the title stage clears the flow; no new console errors. Screenshots: `reports/slide23/` (before/after).

## 2026-11-23: Slide 22 reveal order, Premiere in black and white, «Soon…» above (in ai-covers)

- Only slide 22's opening composition changed (agent + «MCPs» in the middle, DaVinci right, Premiere left, same size; the editing simulation untouched). Reveal: DaVinci Resolve first, in its colours (200 ms); Premiere next (1250 ms): it arrives blurred, the blur clears once (crossfade of a blurred and a sharp face texture) and it settles sharp in black and white (grayscale face, neutral grey slab). «Soon» sits above the Premiere slab with a clear gap, outside the icon, in the slab's own plane; the word is static and its three dots come in one by one, fade out together and loop every 2.5 s. No blur after the reveal. `deck/kit/LogoSlabs3D.tsx` now takes per-slab `enterAt`, `gray`, `blurIn`, `caption`.
- Evidence: tsc clean; build passed; :3200 screenshots of the blur moment, the sharp black-and-white settle, and «Soon» → «Soon.» as the dots cycle; console errors seen are the stale chunk from an earlier build (not in the current build).

## 2026-11-23: Card background back to the plain panel (slides 19 and 24)

- Owner didn't like the Halo look: "رجع الباكروند زي ما كان" (the card's background). `deck/kit/AppCard.tsx` is now the deck's plain card again: `D.panel` fill, 2px `D.lineStrong` border (amber for the community tool), soft shadow; no glow, no moving rim light. Layout kept: large logo, name, one line; slide 19 one card per click, slide 24 six cards in 2×3.
- Halo Card unused, so `components/cultui/` moved to `~/.Trash/ai-covers-cultui-halo-card-2026-11-23` (recoverable); README lines removed.
- Evidence: tsc clean; build passed; production build on :3206: slide 19 all three cards and slide 24 all six cards shown with background rgb(10,16,24), 0 Halo elements, 0 anchors; no console errors.

**Next:** owner's review of 19/24.

## 2026-11-23: Slide 22 opens on one 3D composition (in ai-covers)

- Owner picked option 4 of the visual-component-scout shortlist (three.js slabs, MIT, already installed). Title and subtitle kept. The reference cards are gone; step 1 is now one composition on one axis: the thinking agent (same `WamdaActor act="thinking"` asset and motion as slide 23, which is untouched) with «MCPs» under it; DaVinci Resolve on the right and Adobe Premiere on the left as real 3D slabs in one shared camera (`deck/kit/LogoSlabs3D.tsx`: bevelled extruded rounded squares matched to the icon outline, icon faces unlit so their colours stay exact, slabs open slightly outward so their thickness faces the agent, entrance then a slow mirrored sway, reduced-motion still, disposed on unmount). Premiere: slight blur on its face and a crisp «Soon» plane in front of it, in the same group (same perspective and depth). Step 2 is the existing editing simulation.
- Assets: DaVinci icon re-taken from Blackmagic's press kit at its original 852 px (`public/deck/logos/tracks/davinci-resolve.png`). Premiere uses the deck's «Pr» stand-in (as slide 15) because Adobe's product icons aren't cleared for third-party use; `MEDIA.s22.premiere` takes an official file when the owner provides one.
- Evidence: tsc clean; build passed; :3200 screenshots of the composition (entrance, «Soon» centred under a still-readable «Pr», thickness visible), step to the simulation and back, keyboard walk 21→24 and back; the canvas unmounts off the slide; console errors seen were a stale chunk from the previous build (not in the current build).
- Open: the owner wrote «slide 27» for the thinking pose; slide 27 has no agent, so slide 23's pose was used.

## 2026-11-23: Slides 19 and 24 on Halo cards (owner's pick, in ai-covers)

- Owner picked option 2 of 4: Cult UI Halo Card. Copied to `components/cultui/HaloCard.tsx` (+ `LICENSE.md`, MIT) with a header listing the deck changes: no hover/focus states, the rim light travels on its own (`ambient`), colours/sizes/rim width as props, `seed` phase offsets, shadcn tokens replaced, header/footer parts and the Base UI button left out (no new dependency). Shared deck card `deck/kit/AppCard.tsx`: Halo in the deck palette (blues + agent orange, like the cover glow), logo tile, name, one line in the kind colour; not a link.
- Slide 19: same three cards and clicks (Figma MCP, Figwright, Mobbin MCP), now on Halo cards. Slide 24 rebuilt: title on entry, one click shows the six tools (Remotion, HyperFrames, FFmpeg / FFprobe, Whisper, yt-dlp, OpenMontage) as two rows of three Halo cards, logo 136px, name, one line; examples, the «نظام متكامل» badge and `S24.example/system` removed; roles cut to one line each in `copy.ts`.
- Spotlight Card NOT deleted: another session's slide 21 uses it for a card-look comparison (`/deck?s21=b#21`). README updated for both components.
- Evidence: tsc clean; build passed; production build on :3206: slide 19 stages forward/back, 3 Halo cards with 6 rim-light layers; slide 24 entry = title only, click = 6 cards in reading order right to left, every name and line on one row (widest FFmpeg line 428 ≤ 460px), no «مثال», 0 anchors; no console errors. Reduced motion follows the original's code path (not toggled in the browser).

**Next:** owner's review of 19/24 on the big screen.

## 2026-11-23: Slide 21 option cards: owner kept A (in ai-covers)

- The owner picked A (flat panel, 2 px border in the option's colour). B (Spotlight Card) and the `?s21` switch are removed from `S21DesignSystem.tsx`; the slide no longer imports SpotlightCard. The layout described in the entry below stays as is.
- `components/reactbits/SpotlightCard.tsx` is now unused anywhere (slides 19/24 moved to Halo). It was left in place because it was vendored by the other session; remove it together with its README line when convenient.
- Evidence: tsc clean; build passed (the first two tries collided with another session's build of the same `.next`; a clean run passed). Production :3201 at 1920×1080: options, Skill and result stages, back to the first stage; `?s21=b` now shows A; `/deck` 200. The console errors seen were from a load before the server restart (that chunk exists in the current build).

## 2026-11-23: Slide 21 option cards: two looks to compare, A (default) and B (in ai-covers)

- Only `deck/slides/S21DesignSystem.tsx` changed. The two option cards at the «options» click are now wider (760 px, x 1000 / 160, y 366, h 284) with a 44 px inset on every side. Both use one layout, `OptionBody`: question 40 px, answer 32 px, then the three term chips at 24 px (were 34 / 28 / 20). Question and chips align to the same right edge. The header's left corner holds the Figma logo (card 1) or the «radius = 18» rule (card 2, still set by the designer's click; `D_ROUTE` moved to it). Steps, beats, the Skill and result stages are unchanged.
- A = the same card re-laid out (flat panel, 2 px border in the option's colour). B = React Bits Spotlight Card (reactbits.dev/components/spotlight-card, already vendored in `components/reactbits/` for slide 19, no new dependency). B runs in `ambient` mode: a slow light in each option's colour (blue / orange) drifts on its own, with no hover; it is on only while the cards are shown, with flare off and proximity 0. It respects reduced motion and pauses off-screen. Switch: `/deck?s21=b#21` shows B; anything else shows A.
- The user asked for exactly two options (A re-layout, B one React Bits component). This differs from the new CLAUDE.md rule of 4 options before building; it was flagged to the user.
- Evidence: tsc clean; build passed; production :3201 at 1920×1080: A and B at options, Skill and result stages; measured insets 46 px top/left/right and 58 px bottom on both cards, question and chips both 46 px from the right edge; no console errors. The pane was hidden, so B's light drift was checked in code (periods ~10–15 s), not seen moving. Screenshots: `reports/slide21-cards/`.

**Next:** the user picks A or B; then delete the other look and the `s21` switch.

## 2026-11-23: No external links in the deck + 4-option rule (in ai-covers)

- Owner rules added to `ai-agent-course/CLAUDE.md` and a new `ai-covers/CLAUDE.md` («Presentation Rules»): no external links, URL text or "open" hints anywhere; nothing that depends on hover; visual redesigns go through visual-component-scout with exactly 4 options and wait for the owner's pick. The skill (`~/.claude/skills/visual-component-scout`) now says exactly 4 options (SKILL.md, references/index.md, two eval cases), stops even when asked to "pick and apply", and has a «Slides and presentations» constraint block plus a presentation step in phase 2.
- Links removed: `ResourceReference` is a card, not a link, and prints no URL (slides 22, 26, 27); slide 16 platform cards lose their addresses; slide 19 cards lose the link, the arrow and the new-tab hint; slide 24 cards lose link + URL; slide 25 tool chips are labels; `/deck/refs` lists names only (internal «العرض» link kept); the presenter window lists reference labels without links; the lab drops its external «المرجع» link; `shortUrl` removed. URLs stay as data in `resources.ts` / `refs.ts`, and inside the presenter's notes text (owner asked earlier for sources there). Deck navigation (toolbar, /deck/notes, /deck/refs) unchanged.
- Kept on purpose: slide 26's simulated browser still types `example.com/form` (a fictional demo address, opens nothing).
- Evidence: tsc clean; build passed (43 pages; it first failed only in S20 while another session was mid-edit on slide 20, then passed once that session finished). Every slide 01–27 stepped on :3100: 0 anchors in the stage, URL-like text only on slide 26's demo; /deck/refs and /deck/notes: no external anchors, no URL text on screen.
- Waiting on the owner: pick 1 of 4 card options for slides 19 and 24 (Cult UI Halo Card, React Bits Glass Icons, Magic UI Animated Beam, Magic UI Border Beam), then redesign 19's cards and 24 in full (six tools, big logos, name, one line, no examples).

**Next:** owner's pick → implement on 19 and 24.

## 2026-11-23: Slide 16 libraries: smaller, tighter, daisyUI replaces HyperUI (in ai-covers)

- Same three clicks and two levels. Logos −20 % (React Bits 320 → 256 px, the other four 220 → 176), names a little smaller (64 → 58, 46 → 42). The group is closer together and laid out from constants in `S16Inspiration.tsx` (`GROUP_TOP`, `LEVEL_1/2`, `SIDE_DX`, `LOW_DX`). It sits centred on the stage's axis, 100 px under the sub-line, ending 143 px above the bottom.
- HyperUI → daisyUI on the left: the official colour mark `mark-static.svg` from img.daisyui.com, which the brand page (github saadeghi/daisyui, docs `brand/+page.md`) shows on both white and black. It is now `public/deck/logos/libraries/daisyui.svg`; `hyperui.png` was deleted. copy.ts, REFS s16 (daisyui.com), notes s16 stage 6 and the step label updated.
- Evidence: tsc clean (after another session finished its slide 20 edit; that file had 30 errors mid-edit, none from this change); build passed; production :3201 at 1920×1080: stages 5→7, measured boxes (group 344–937 px, edges 476 / 1441, no overlaps), back to 4, past 7 → 17 and back to 16; no console errors.

## 2026-11-23: Slide 16 libraries → five logos in three clicks (in ai-covers)

- Only the last stage changed (user confirmed): question, idea, the four platforms and «هل كذا اكتفينا؟» are untouched. The 10-card grid is now five libraries, each just its name above its official logo, with no description, link or card frame. Click 5 shows React Bits in the centre, largest (with the sub-line). Click 6 adds Magic UI on its right and HyperUI on its left, a bit smaller. Click 7 adds shadcn/ui (right) and Aceternity UI (left) a level lower. Slide 16 is now 7 stages (was 5).
- Logos: `ai-covers/public/deck/logos/libraries/`: React Bits `src/assets/logos/react-bits-logo-small.svg`, Magic UI `apps/www/app/icon.svg`, shadcn/ui `logo` from `apps/v4/components/icons.tsx` (stroke set to white), Aceternity UI the header mark from ui.aceternity.com (fill white), HyperUI `public/favicon.ico` (a 200 px PNG). HyperUI's site header has no logo, only text, so the favicon is its only mark. Its black tile gets a thin ring so it reads on the dark ground.
- `S16.libraries` in copy.ts is now 5 entries (id, name). Notes s16 cover stages 5–7. REFS s16 keeps the four platforms + these five (the other five sites were dropped). The site links live only in the notes window now; the slide itself has no clickable links.
- Evidence: tsc clean; build passed; production :3201 (3200 belonged to another session's server and was left alone) at 1920×1080: every stage forward, back from 7 to 4, past 7 → 17 and back to 16; spacing re-tuned once (bottom pair moved out and down, React Bits 300 → 320); no console errors.

**Next:** unchanged from the entry below (slide 25 example from the user; review 19–27 live).

## 2026-11-23: Slide 19 redesigned as three app cards (in ai-covers)

- Removed from the slide and from `deck/content/resources.ts` (so also from /deck/refs and the notes window): the «Figma MCP Server» card/link and the «للكتابة داخل ملفات Figma» panel (plan, seat, remote server, cost) with its «Write to canvas» link. Notes s19 rewritten for the new clicks.
- Now: title «تصميم UI/UX» + «خلّ الوكيل يشتغل داخل Figma», then one card per click, right to left: Figma MCP «الربط الرسمي» (figma.com/mcp-catalog), Figwright «بديل مجتمعي مجاني ومفتوح المصدر» (github.com/awdr74100/figwright), Mobbin MCP «مرجع بصري» (mobbin.com/mcp). Each card is one link (new tab), no URL text; large logo on a shared tile size, name, one line in the kind colour (official sky, community amber).
- Pattern picked with the visual-component-scout skill: React Bits Spotlight Card (no deps, reduced motion, keyboard focus, off-screen pause, direction-neutral) over Magic UI Magic Card (no reduced-motion handling) and Aceternity Glowing Effect (closed source, needs lucide-react). Vendored as `components/reactbits/SpotlightCard.tsx` with a header notice + `components/reactbits/LICENSE.md` (MIT + Commons Clause); one change: pointer/focus positions converted to the card's own pixels inside the scaled stage. `ResourceMark` got an optional `fit` (default unchanged) so Figwright's padded SVG reads at the same weight. README updated.
- Evidence: tsc clean; build passed; production build on :3201: 4 stages forward and back (aria-hidden + tabIndex −1 on hidden cards), order right to left, row centred (50.0%), names aligned and every line on one row, hrefs + target _blank, no URL text, a card click doesn't advance the deck, spotlight lands under the pointer on the scaled stage, Tab focuses Figma MCP first with a visible ring; /deck/refs 200 without the two removed links; no console errors.

**Next:** slides 20–27 unchanged; open items as before.

## 2026-11-23: Slide 20 UX Planning as four UX outputs on a Figma canvas (in ai-covers)

- Only UX Planning changed (Visual Research and Creative Direction untouched). The themes/problems/priorities board is gone. Research findings + survey (right) feed a simulated Figma canvas (`ux-planning.fig`) with four outputs, all tied to re-ordering: click 3 = Affinity Map (replies clustered, «إعادة الطلب» marked most frequent) + Persona (سارة، ٢٩: quote, goals, pains); click 4 = the camera pans to row two: User Journey Map (five stages, feeling curve, low point «تعيد نفس الخطوات كل مرة» → «فرصة: زر إعادة الطلب») + User Flow (start pill, decision diamond «عنده طلب سابق؟», yes → one-tap re-order (highlighted path) → final price → pay; no → browse menu); the designer comments and marks it reviewed; closing line. Empathy Map left out (the persona and journey cover it).
- Concept titles in English only; every other label Arabic. Example data made up (said in the notes).
- Evidence: tsc clean; build passed; :3200 screenshots of both UX Planning clicks; slide 20 forward/back state walk correct; no console errors.

## 2026-11-23: Slides 20–21 split: research/UX planning, then design system → new screens (in ai-covers)

- 20 «من الفكرة إلى التصميم» now covers only 01 Visual Research, 02 Creative Direction, 03 UX Planning (rail of three). UX Planning is the worked example over two clicks: research findings + a 48-reply survey go to the agent → replies sorted into three topics (sticky notes) → the recurring problem per topic with its count → priorities + a first user flow laid out on a simulated Figma board (`ux-planning.fig`), the designer comments and marks it reviewed; closing line. The Figma Design System / UI simulation is gone from 20. Example data is made up (coffee-ordering app).
- 21 «من نظام التصميم إلى واجهات جديدة» carries 04 Design System and 05 UI Design (rail numbered from 4, new `startAt` on FlowRail): click 1 two options (you have a full system → give it to the agent · you don't → build it with the agent and set the rules; the designer sets «radius = 18»), click 2 components, tokens and usage rules fly into one Skill switched on in the project, click 3 a current screen and the agent's new screen with the same tokens tagged on the same parts (color/primary, radius/lg, button/bg) + closing line.
- Notes s20/s21 rewritten; admin titles in registry updated; README track line updated.
- Evidence: tsc clean; build passed; :3200 every stage of 20 and 21 screenshotted; keyboard walk 18→27 and back = 30 states in order (20: 5, 21: 4); no console errors; dev view left off.

## 2026-11-23: Track names as titles; slides 19, 21, 26 reworked (in ai-covers)

- Every track slide (19–27) now has the track's name from slide 18 as its main heading (`TRACK` in copy.ts: «تصميم UI/UX»، «المونتاج»، «الإنفوجرافيك والأنيميشن»، «إدخال البيانات»، «3D») and its old line as the sub-heading. Content under the two-line heading sits in `TrackBody` (kit/Sim.tsx: +56 px, ×0.94, uniform, so pointer routes still land). Slide 18's card spelling aligned to «الإنفوجرافيك والأنيميشن» (the user's spelling in this request); /deck/refs track names match too.
- 19: no Figma ↔ MCP ↔ agent diagram any more. Click 1 «الربط الرسمي» (Figma MCP catalog + setup), click 2 the note beside it (developers.figma.com write-to-canvas + MCP intro, checked today: Professional/Organization/Enterprise/Education plan, Full seat to write outside drafts, remote server + edit access, free in beta then usage-based), click 3 Figwright (free, open source, community caveat) with Mobbin as a small separate «مرجع بصري». New resource `figma-write`.
- 21: one idea in 2 clicks: the design system (tokens, components, rules) packs into a Skill switched on in the project → next to a current screen the agent adds a new one with the same header, card and button, tagged «من الـSkill»; closing line kept. The old 4-step rail is gone.
- 26: «إدخال البيانات» shows from the start; «خلّ الوكيل يعبّي البيانات عنك» fades in under it only when the last flow step (review) is reached.
- Evidence: tsc clean; build passed; :3200 keyboard walk 18→27 and back = 29 states in order (19: 4, 21: 3); screenshots of 19 (all stages), 21, 22, 26 (title alone, then the sub at review), 20; no console errors; dev view left off.

## 2026-11-23: Slides 19–27, the five practical tracks; slide 18 in one click (in ai-covers)

- Slide 18: entry = title + question; one click = the 14 cards arrive (45 ms stagger), then the five tracks light up by themselves (UI/UX, المونتاج, الانفوجرافيك والأنيميشن, إدخال البيانات, 3D); the strike on «البرمجة» is gone (said aloud). Card names kept as the user last approved them (not the long names in the pasted brief).
- New: 19 Figma connect (Figma MCP official + Figwright community with caveat + Mobbin, then agent ↔ MCP ↔ Figma) · 20 UI/UX workflow (6-stage rail, 4 clicks, Figma simulation with a separate «UX Planning» page) · 21 Design System (exactly 4 steps) · 22 montage (refs, then a simulated NLE: reorder, trim, dissolves, preview, done) · 23 idea → animation (1 click) · 24 six tools (Remotion, HyperFrames, FFmpeg, Whisper, yt-dlp, OpenMontage) · 25 infographic workflow + `InfographicExamplePlaceholder` (empty until `MEDIA.s25Example` is filled) · 26 Codex + browser simulation, stops before «إرسال» · 27 Loon Watch V4: Product Sheet, Claude + Blender MCP, simulated Blender with the real model forming in 4 phases, final turntable next to the project's Cycles render.
- Shared: `deck/content/resources.ts` (every link, its type رسمي/مجتمعي/شرح فيديو and caveat; checked live today), `kit/ResourceReference.tsx`, `kit/Sim.tsx` (AppWindow, FlowRail, chat lines), `kit/InfographicExample.tsx`, `kit/WatchModel.tsx` (three.js, GLTFLoader + RoomEnvironment, renders only while shown, disposes on unmount). Page `/deck/refs` lists all track links; a link button in the deck toolbar opens it; REFS for 19–27 come from the same list.
- Watch assets: exported from `~/Desktop/Blender/mcp/Loon-Watch-v4/reference_rebuild/Loon_Watch_V4_Reference_Rebuild.blend` with Blender 5.2.1 in background without saving it (mtime unchanged): the packed Product Sheet (byte for byte), exterior parts as GLB (2.8 MB, frame 900), and qa/cycles_hd_0900.png as JPEG → `ai-covers/public/deck/media/s27/`.
- Logos: official files from each project's repo/site → `public/deck/logos/tracks/` (sources listed in resources.ts). Whisper, yt-dlp, Chrome DevTools MCP show a neutral icon.
- Evidence: tsc clean; build passed (43 pages); production :3200: keyboard walk 18→27 forward (31 states, extra press stays on 27) and back to 17 with every stage in order; link click on a card does not advance, a stage click does, R rewinds; screenshots of every stage checked (bidi fixes for mixed Arabic/Latin names, slide 27 model stood upright and lit like the render); no console errors. The browser pane was hidden, so timers were throttled: timings were judged with long waits.
- Found, not used: `~/Downloads/ai_video_editor_skill_addon.md` (read: setup + 8-step editing workflow for Remotion/HyperFrames/FFmpeg/Whisper/yt-dlp; nothing installed).

**Risks:** Mobbin MCP needs Pro/Team; Figma canvas writes need a Full seat; Resolve's assistant integration is Studio 21.1+ (feature table, as verified for slide 11; the press release itself doesn't say Studio). Background: the deck uses the plain ground on 19–27 like 08–18 (Gradient ASCII stays slide 07 only, per the user's 2026-11-22 rule), although the pasted brief mentioned it.

**Next:** the user supplies slide 25's example (MP4 ≥1080p + references + build steps + sources) → `MEDIA.s25Example`; review 19–27 live with the pane visible; OpenMontage folder (~800 MB) still waiting for keep/delete.

## 2026-11-23: Slide 18 reordered: three clicks, five focus cards, no numbers (in ai-covers)

- Grid: «إدخال البيانات (Data Entry)» and «تصميم الجرافيك» swapped places (no duplicate card); «الموشن جرافيك والأنيميشن» renamed «الانفوجرافيك والأنيميشن» (the user's spelling, icon kept). Icons now keyed by card name in `S18Domains.tsx`, so a reorder can't mismatch them.
- Stages: entry = 14 equal cards, «البرمجة» plain → click 1 = the five focus cards (UI/UX, المونتاج, الانفوجرافيك والأنيميشن, إدخال البيانات, 3D) light orange right to left; they are the grid's first row, columns 2–6, so one centred row; secondaries fade; «البرمجة» stays fully visible → click 2 = «البرمجة» struck (same strike line), the five stay lit. The old separate pulse click on «البرمجة» is gone (4 stages → 3). No number badges anywhere. `S18.focus/coding` in copy.ts; notes s18 rewritten for three stages.
- Evidence: tsc clean; build passed; production build on :3201: every card's state/opacity/border/glow at all three stages forward and back, card positions identical in every stage, 0 badges, strike only on «البرمجة», focus row centre at 50.0% width / 50.5% height of the stage, order right to left as requested; extra Space at the end stays on #18; no console errors.

**Next:** the domain workflows the user will explain are now UI/UX, montage, infographic/animation, data entry, 3D; slide 19+ content.

## 2026-11-23: Slide 18 focus group is now four (in ai-covers)

- Card «المونتاج وتعديلات الفيديوهات» renamed «المونتاج» (same icon and place). «تصميم الجرافيك» stays in place but is out of the focus group: no number, glow or orange frame; it fades like the other unselected tiles (name not struck).
- Same four clicks: entry 14 equal tiles → «البرمجة» + the four lit, numbered 1–5 → pulse on «البرمجة» → «البرمجة» struck, the four renumber in place: 1 UI/UX, 2 المونتاج, 3 الموشن والأنيميشن, 4 3D. Indexes in `S18.lit/coding/four` (`deck/content/copy.ts`, was `six/five`); step labels and notes s18 now say five → four.
- Evidence: tsc clean; build passed; production build on :3201 (:3200 was held by another process, left alone): DOM state of every tile at all four stages forward and back, tile positions identical in every stage, «(مشطوبة)» only on «البرمجة»; no console errors.

**Next:** the domain workflows the user will explain are now UI/UX, montage, motion, 3D (graphic dropped from the focus group); slide 19+ content.

## 2026-11-23: Workflow demos removed (in ai-covers)

- User verdict: the five `/lab/workflow-*` demos were too long, too complex and not professional. Removed from the project; the user will explain each domain's workflow and it gets rebuilt as simply as the earlier slides.
- Moved to `~/.Trash/ai-covers-workflow-demos-2026-11-23/` (recoverable): `components/lab/workflows/`, `public/lab/workflows/`, `scripts/make-bun-montage.mjs`, `scripts/render-bun-cup.py`, `scripts/openmontage-bun-run.py` (written, never run), `.work/bun/`.
- References removed: `components/lab/meta.ts` (import, `group` field, entries 18–22), `components/lab/registry.tsx`, `app/lab/page.tsx` (back to one list of 17), the demo-routes line in `deck/content/notes.ts` s18, the README subsection. Slide 18 itself is unchanged.
- OpenMontage was cloned and `make setup` run in `~/Desktop/RKY/OpenMontage` (~800 MB) after a misread «شغل» (the user meant: open the project in the browser). Never run on project data. Delete or keep: waiting on the user.
- Evidence: tsc clean; build passed (42 static pages, was 47); production build :3200: `/deck` and `/lab` 200, `/lab/workflow-uiux|3d` and the old videos 404, /lab lists 17 components, slide 18 click 1 shows the six numbered tiles; no console errors.

**Next:** user explains each domain's workflow (UI/UX, montage, motion, graphic, 3D); build each at the simplicity of the earlier slides. Slide 19+ content.

## 2026-11-23: Slide 18 in four stages + five workflow demos + open-montage skill (in ai-covers)

- Slide 18: entry = 14 equal tiles; click 1 = six orange, numbered 1–6 right to left, rest fade; click 2 = pulse + frame on «البرمجة»; click 3 = «البرمجة» struck (number and colour gone), the five renumber 1–5 in place one by one. No tile moves. Indexes in `S18.six/coding/five` (`deck/content/copy.ts`); notes s18 updated with the stages and the demo routes.
- Lab: `/lab/workflow-uiux|montage|motion|graphic|3d` (5 stages each, fictional brand «بُن»), listed in their own section of `/lab`. Code in `components/lab/workflows/` (statuses in `tools.ts`). Real outputs: FFmpeg ad `public/lab/workflows/montage/after.mp4` (17.6 s) vs raw `before.mp4` (35.5 s) via `scripts/make-bun-montage.mjs`; Blender 5.2.1 Cycles still via `scripts/render-bun-cup.py`; beat timing from rakaya-motion's `beat_timing.py`.
- New skill `~/.claude/skills/open-montage/SKILL.md` (six gated stages). The tool OpenMontage (github.com/OpenMontageInc/OpenMontage, AGPL-3.0) is **not installed**: install needs a clone + `make setup` (downloads), so it waits for the user's OK. Its local path was run end to end on dummy data.
- MCP read checks: Figma (whoami) ok, Canva (help) ok, DaVinci Resolve (knowledge, runtime_mode; Resolve not launched) ok; Mobbin needs a paid plan; Chrome DevTools MCP failed (its Chrome profile was already in use).
- Evidence: tsc clean, build passed; production build (:3200) checked: slide 18 states forward/back with identical tile positions; every demo stepped forward and back, R/restart, output→input text equal on every handoff, UI flow (empty→loading→error→success) clicked through, 3D drag rotates without advancing, both videos load (35.50 s / 17.60 s); no console errors.

**Risks:** the dev server on :3100 still serves stale CSS (new Tailwind classes missing there); use a production build to present the demos, or restart it. The Blender Lab page (projects.blender.org) is behind a Cloudflare check; its repo API answers.

**Next:** user decides whether to install OpenMontage (then run its `make demo` and update `tools.ts` statuses); slide 19+ content.

## 2026-11-23: Slide 11 — Magnific replaces Unreal Engine (in ai-covers)

- Bottom-left tool is now «Magnific» (official mark, `public/deck/logos/mcp/magnific.svg`); «Freepik سابقًا» and the MCP capability line are in the speaker notes with both magnific.com sources (also in `REFS.s11`).
- Note: slide 11's ten-tool grid (`deck/media/mcpTools.ts`) was built in another session; this change only swaps its last entry.

## 2026-11-23: Slide 11 shows ten MCP-connected creative tools (in ai-covers)

- Tools (all checked today against vendor docs or the server repo; all official): Figma, Canva, Framer, Affinity (local, in-app), DaVinci Resolve (Studio 21.1 only; community server samuelgursky/davinci-resolve-mcp also works), Rive (desktop editor), Blender (Blender Lab add-on, Blender 5.1+), Cinema 4D (2026.4+), Spline, Unreal Engine (5.8+, Experimental). Type, example and doc link for each are in `deck/content/notes.ts` s11.
- Left out: Adobe apps (official local MCP is a private beta for early 2027; Adobe doesn't allow third-party use of its product icons), CapCut (ChatGPT-only plugin), Kdenlive (no maintained live server). Also verified but not used: Sketch, Penpot, Webflow, Unity (public beta), Houdini and Godot (community), Maya/3ds Max (tech preview), Rhino, Jitter (beta), LottieFiles, GIMP/Inkscape (community).
- Layout: one panel with a 2×5 grid (logo tile + name under it, RTL order), one orange path from the panel into MCP on the connect click, tiles light up in turn. Agent right, MCP centre unchanged. Step count unchanged.
- Logos: official files in `ai-covers/public/deck/logos/mcp/`, sources listed in `deck/media/mcpTools.ts` (slide 11 only; `brands.tsx` untouched so slides 12/15/16 keep their marks).
- Evidence: tsc clean, build passed; production build (:3200, stopped) at 1920×1080: every stage stepped, 10/10 logos loaded, no console errors.

## 2026-11-23: Slide 16 opens on its question (in ai-covers)

- Stage 1: «في عصر الذكاء الاصطناعي، من وين نستلهم أفكارنا؟» alone in the middle. Click 1: it rises to the title's place, then the answer appears. The rest (platforms, audience question, libraries) follows unchanged.

## 2026-11-23: Slide 16 in four stages (in ai-covers)

- Idea → platforms (with «وين نلقى أعمالهم؟») → audience question → 10 component libraries (name, short use, clickable link). Libraries and their links live in `S16.libraries` (`deck/content/copy.ts`) and `REFS.s16`.
- Evidence: links checked live; all four stages checked on a production build; tsc clean; build passed.

## 2026-11-23: Slide 14 simplified (in ai-covers)

- Removed the «عند الحاجة» tag and the Component Tokens ≠ Components box; the diagram is Primitives → Semantic Tokens → Component Tokens with its examples and arrows. Checked all stages: neither returns.

## 2026-11-23: Slide 10 made generic (in ai-covers)

- «Rakaya Skill» → «Company Skill»; the reel illustration shows a «Company» mark instead of the Rakaya logo. Checked every stage for any Rakaya/ركايا text or image: none.

## 2026-11-23: Slide 10 — company skill as the entry point (in ai-covers)

- Replaced the Brand + Video merge with: «Rakaya Skill» in the middle (SKILL.md + the identity cards) → SKILL.md routes to separate Video Skill / Image Skill → example request lights the Video route only and shows «ريل بهوية الشركة». The company name is `S10.company` in `deck/content/copy.ts`.
- Evidence: tsc clean, build passed, all three stages checked forward and back on a production build.

## 2026-11-23: Slide 07 without its headline (in ai-covers)

- No visible title on 07 (kept as a screen-reader-only heading; the nav bar keeps «عندك موظف جديد!»). Entry shows the silhouette, centred on the slide; next click reveals Wamda with the orange field; then the question.
- Evidence: tsc clean, build passed, checked forward and back on a production build.

## 2026-11-23: Pixel font for Wamda's speech bubbles (in ai-covers)

- Bubble text (shared `SpeechBubble`, so slides 04, 08, 11 and the Lab demo) is now set in **Unixel** 1.0 by Mohammad Darvishi (github.com/MDarvishi5124/Unixel, OFL 1.1), approved by the user. Upstream WOFF2 unmodified + `OFL.txt` + source note in `ai-covers/public/fonts/unixel/`; loaded by `components/lab/wamda/bubbleFont.ts` (`next/font/local`, weight 400, `size-adjust: 117%` so the existing fontSize props keep the same reading size, fallback ثمانية Sans). Synthetic bold off. Titles, slide copy, global font settings and the "!" badge are unchanged.
- Compared on the real bubble texts at 46/50px on orange and light: Handjet (pixel, OFL, but its "!" reads as an alef in Arabic), GNU Unifont (monospace gaps), Erfan (Arabic ي breaks joins), Qahiri (dotless kufi, hard to read), Noto Kufi Arabic (readable, not pixel). Itch.io Arabic pixel fonts (Arabixel, Pixel AE, Seven Fifteen) could not be fetched by script.
- Typing effect left as is: it renders one growing text node, so Arabic stays joined while typing (sampled every 150 ms on slide 11).
- Evidence: tsc clean, build passed; production build (:3200, stopped afterwards) checked on slides 04, 08, 11: font loaded, no overflow, no console errors.

## 2026-11-23: Pointers (in ai-covers)

- Presenter's real mouse inside the slides: Figma-style arrowhead (`public/deck/cursor.svg`) as a CSS cursor, hotspot on the tip, normal arrow as fallback; links/buttons/fields keep their cursors; scoped to `.deck-stage` in `deck/engine/Deck.tsx`.
- Cover: the drawn blue «العقل» cursor is gone; the agent's pointer stays. All drawn pointers (agent, designer) share the arrowhead in `deck/kit/CursorArrow.tsx`.
- Evidence: tsc clean, build passed, computed cursor styles and idle hiding checked on a production build.

## 2026-11-23: Slides 03 and 05 reveal one side per click (in ai-covers)

- 03 and 05: entry shows both sides' tools with official logos; click 1 reveals the right side (its tools give way to its explanation/format and demo in the same place); click 2 the left side; the right stays. Demos belong to their side's click and do not replay. 03's title is now «AI Agents vs Chatbots».
- Official logos: `ai-covers/public/deck/logos/tools/` (ChatGPT, Claude, Gemini, Codex, Cursor, FLUX); sources and brand rules in `deck/media/tools.ts`. Stable Diffusion shows a neutral initial (Stability's "s." may only appear with the name Stability AI).
- Evidence: tsc clean, build passed; stage states checked forward and back on a production build.

**Open:** slide 04 has no tool examples or two sides of its own; waiting for the user to say what its sides should show.

## 2026-11-23: Slide 07 reveal sequence (in ai-covers)

- Order now: title on entry (dark, still) → silhouette fades in where it stays → reveal, and the orange ASCII field starts with it. The field only exists from the reveal stage (`background()` in `deck/slides/S07NewHire.tsx`; `SlideDef.bg` can be a function of the step).
- Evidence: tsc clean, build passed, sequence checked frame by frame on a production build (`next start -p 3200`, stopped afterwards).

**Risks:** the dev server on :3100 (running since 2026-11-22 00:56) serves an old `globals.css` without the `deck-*` keyframes, so in dev the reveal ring stays visible and taps/bobs don't animate. Restart it (`npm run dev -- -p 3100`) to fix; production builds are fine.

## 2026-11-23: Slide 15 with the official keynote photo (in ai-covers)

- Slide 15 now: small centred title, a large official photo from the Adobe MAX 2026 opening keynote (Claude with Illustrator on screen, Anil Chakravarthy announcing the local MCP integrations), one row of the four apps, one context line.
- Photo: AP Content Services for Adobe, credit Jesus Aranguren, AP key 26315106185147; saved at `ai-covers/public/deck/media/adobe-max-2026-keynote-mcp.jpg`. Source page, credit and capture time are in the speaker notes (`deck/content/notes.ts`, s15) and `deck/media/media.ts`.
- Evidence: `npx tsc --noEmit` clean, `npm run build` passed, slide viewed in the browser.

**Risks:** AP's terms for "IMAGE DISTRIBUTED FOR ADOBE" photos were not stated on the page; the credit line is on the photo.

## 2026-11-22: Backgrounds, cover, titles, slides 03 and 05 (in ai-covers)

**Active feature:** feat-003 (in-progress)

- Backgrounds: Gradient ASCII removed from the whole deck except slide 07, which keeps it in the deck's oranges. Cover: dark ground, faint edge glow, all-white Rakaya lockup centred at the top (`public/brand/rakaya-white.svg`).
- Titles: one centred heading (`SlideTitle`, `TITLE` in `deck/kit/ui.tsx`); content under it RTL. Slide 07 centred on one axis.
- Slides 03 and 05: tools under each column title from the moment the slide opens; explanation and demo on the next click; nothing visible moves on reveal. Tool lists live in `deck/content/copy.ts`.
- Evidence: `npx tsc --noEmit` clean, `npm run build` passed; every slide stepped in the browser pane.

**Risks:** slide 06 was left as it was (user said slide 03/05 only), so 05 → 06 is no longer pixel-identical (06 keeps the older panel header and demo 44px higher). The browser pane was hidden during checks, which throttles animation frames: Refine Frame's resolve on 05 could not be watched to the end there.

**Next:** decide whether 06 should follow 05's new header; then the pending media and slide 19+.

## 2026-11-22: Slides 01–18 built (in ai-covers)

**Active feature:** feat-003 (in-progress)

- The deck lives in `~/Desktop/RKY/ai-covers`, not here: route `/deck` (presenter) and `/deck/notes` (presenter window). Code in `ai-covers/deck/`; how to run and where things live is in the ai-covers README («العرض»).
- Reused and adapted the ai-covers lab: approved cover «مجسّم» for slide 01, pixel-art Wamda (silhouette → reveal on 07 → orange), SpeechBubble (new `tone` prop so the silhouette's bubble is not orange), React Bits Gradient ASCII (original Atmosphere colours), Refine Frame (05), Folder (08–10).
- Evidence: `npx tsc --noEmit` clean, `npm run build` passed in ai-covers; every stage of 01–18 stepped through in the browser.

**Risks:** placeholders are visible in the audience view until real files arrive (05/06 sample, 17 videos); product logos are stand-ins (Hugeicons glyphs / lettered tiles).

**Next:** user supplies slide 02 content, the 05/06 example, the two licensed clips with cut points, and official logos; then slide 19+ content.

## 2026-11-22: Harness set up

**Active feature:** none (feat-001 done)

- Added `CLAUDE.md`, `feature_list.json`, `progress.md`, `session-handoff.md`, `init.sh`.
- Evidence: `./init.sh` passed. Typecheck is clean, and the build prerenders `/`, `/lab`, `/studio`.
- Existing app: 3 galleries (10 original, 10 lab with 3 Wamda covers, 15 studio). Theme adoption
  and the "ابدأ بناء السلايدات" handoff note already exist in `presentation/player/Gallery.tsx`.

**Risks:** there are no automated UI tests, so motion and layout regressions show up only in the
manual visual check (see CLAUDE.md, Definition of Done).

**Next:** user adopts a theme (feat-002), then scope feat-003 with the slide content.
