# CLAUDE.md

@AGENTS.md

Workshop deck «الذكاء الاصطناعي في المجالات الإبداعية»: `/deck` (slides in `deck/`), Next.js 16 + React 19 +
Tailwind 4, Arabic, RTL. See `README.md` for the layout. Session state and the full working rules live in
`../ai-agent-course/CLAUDE.md` and `../ai-agent-course/progress.md`.

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
