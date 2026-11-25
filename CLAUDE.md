# CLAUDE.md

Workshop presentation app ("الذكاء الاصطناعي في المجالات الإبداعية"): animated cover
galleries in Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4. Arabic, RTL.
Stack-first: use what `package.json` already has (lucide-react for icons, Tailwind/CSS for
styling). Add no test runner, state manager, or animation library without asking.

## Startup Workflow

1. Read this file, then `README.md` (Arabic; explains routes, controls, file layout).
2. Run `./init.sh`. If it fails, fix the baseline before any new work.
3. Read `feature_list.json` and pick the single `in-progress` feature, or the first
   `not-started` one whose dependencies are `done`.
4. Read the top entry of `progress.md`, especially its **Next** line (and `session-handoff.md` if filled in).

## Map

- `app/page.tsx`, `app/lab/page.tsx`, `app/studio/page.tsx`: the three galleries (`/`, `/lab`, `/studio`)
- `presentation/covers/themes.ts`: every theme's id, names, and `steps` count (source of truth)
- `presentation/covers/`: cover layouts + CSS; `lab/` and `studio/` hold their collections
- `presentation/player/`: gallery, overlay, keyboard navigation, theme adoption (localStorage)
- `presentation/content.ts`: shared title/subtitle/presenter text
- `presentation/background/vendor/`: React Bits Gradient ASCII. Vendored, licensed: don't edit
- `presentation/character/Wamda.tsx` + `public/wamda/`: character states. `source-assets/` stays out of `public/`

## Working Rules

- One feature at a time; touch only files that feature needs.
- If you change a theme's animation stages, update its `steps` in `themes.ts` in the same change.
- When you add or remove a theme, update the README counts.
- User-facing copy is Arabic. Keep the existing voice and don't machine-translate it.

## Presentation Rules (owner decision 2026-11-23)

- This is a live presentation, not a website. No external links anywhere in the deck: slides, pages,
  mock frames, cards and logos. No `<a href>` to outside sites, no URL text on screen, and no "click to
  open" hints (arrows, external-link icons, underlined link text, "opens in a new tab"). The owner hands
  the audience a separate references file. URLs live only as data or comments in code
  (`deck/content/resources.ts`, `refs.ts`) and in the presenter's notes. The deck's own navigation (keys,
  toolbar, overview, presenter window) stays.
- Exception, only when the owner asks for it by name: a hidden link on one element. It shows nothing (the
  deck's own cursor, no underline, arrow, hover or focus ring) and opens in a new tab. Current: slide 17's
  Higgsfield still opens the channel's Videos page (`MEDIA.s17Higgsfield.link`, owner 2026-11-24).
- The audience sees a projected screen: a design must not depend on hover or pointer effects, and every
  visual is judged by how it reads from the back of the room.
- Aesthetic quality comes first. For any new or redesigned visual element (cards, compositions,
  backgrounds, text effects), use the `visual-component-scout` skill: shortlist exactly 4 options from the
  libraries in its catalog, check that each one suits a presentation (look, readability from afar, the
  deck's identity, licence, no competing dependency), show them, and wait for the owner's pick before
  building. If the skill lacks a rule or source this needs, update the skill first, then continue.

## Definition of Done

- [ ] Behavior is implemented in scope
- [ ] `./init.sh` passes (typecheck + production build)
- [ ] **Visual check** for any cover, motion, or player change: run `npm run dev`, open the
      affected route, step through every stage (click / Space / ↓), and check ←/→ theme
      switching. There are no automated UI tests, so this check is required.
- [ ] Evidence (commands run plus what you saw) recorded in `feature_list.json` → `evidence`

## End of Session

Update `progress.md` (state, next step, risks) and the feature's `status`/`evidence`.
This folder is **not a git repo**, so `progress.md` is the only history. Don't run `git init` or commit unless the user asks.

## Escalation

Ask the user before: choosing or approving a theme (that's their decision), changing
`content.ts` text, adding a dependency, or editing vendored code.
