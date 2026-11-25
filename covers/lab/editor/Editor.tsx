"use client";

import { useRef } from "react";
import { Stage, useStage } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import { useStageLoop } from "@/lib/useStageLoop";
import { Cursor, place } from "../../kit/Cursor";
import { DARK as C } from "../../kit/theme";
import { ease, lerp, seg, type V } from "../../kit/math";
import { newFollow, stepFollow } from "../../kit/follow";

/**
 * DARK. A markdown file open next to its preview, two collaborators in it.
 * "عقل" types the heading; "وكيل" suggests the next lines in grey and accepts them.
 * Move over a line: the mind selects it, the preview lights the matching block, and the agent moves to the next line.
 */

const A = "الذكاء الاصطناعي";
const B = "في المجالات الإبداعية";
const HEAD = `${A} ${B}`;
const Q = "عقل يبدع، ووكيل ينفّذ";
const P = "تقديم: عبدالملك الهندي";
const LINE_Y = [212, 290, 368, 446, 524]; // source lines (1,3,5 hold text)
const TEXT_LINES = [0, 2, 4];

function Scene() {
  const { scale, pointer, active } = useStage();
  const rootRef = useRef<HTMLDivElement>(null);
  const solid = useRef<(HTMLSpanElement | null)[]>([]);
  const ghost = useRef<(HTMLSpanElement | null)[]>([]);
  const rowRef = useRef<(HTMLDivElement | null)[]>([]);
  const pv1 = useRef<HTMLSpanElement>(null);
  const pv2 = useRef<HTMLSpanElement>(null);
  const pvH = useRef<HTMLDivElement>(null);
  const pvQ = useRef<HTMLDivElement>(null);
  const pvP = useRef<HTMLDivElement>(null);
  const tabChip = useRef<HTMLSpanElement>(null);
  const mindCaret = useRef<HTMLDivElement>(null);
  const agentCaret = useRef<HTMLDivElement>(null);
  const mindRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const follow = useRef(newFollow());
  const sel = useRef({ mind: 0, agent: 2 });

  useStageLoop(
    (t) => {
      const p = pointer.current;
      const n = Math.floor(seg(t, 0.7, 2.7) * HEAD.length);
      const headTxt = HEAD.slice(0, n);
      // the agent's two suggestions: grey first, then accepted
      const qGhost = t > 3.0 && t < 3.9;
      const qDone = t >= 3.9;
      const pGhost = t > 4.3 && t < 5.1;
      const pDone = t >= 5.1;
      const qTxt = qGhost ? Q.slice(0, Math.floor(seg(t, 3.0, 3.7) * Q.length)) : Q;
      const pTxt = pGhost ? P.slice(0, Math.floor(seg(t, 4.3, 4.95) * P.length)) : P;

      const set = (i: number, s: string, g: string) => {
        if (solid.current[i]) solid.current[i]!.textContent = s;
        if (ghost.current[i]) ghost.current[i]!.textContent = g;
      };
      set(0, headTxt, "");
      set(1, qDone ? qTxt : "", qGhost ? qTxt : "");
      set(2, pDone ? pTxt : "", pGhost ? pTxt : "");

      // the preview follows the source
      const cut = A.length + 1;
      if (pv1.current) pv1.current.textContent = headTxt.slice(0, A.length);
      if (pv2.current) pv2.current.textContent = headTxt.length > cut ? headTxt.slice(cut) : "";
      pvQ.current!.style.opacity = String(qDone ? seg(t, 3.9, 4.3) : 0);
      pvP.current!.style.opacity = String(pDone ? seg(t, 5.1, 5.5) : 0);
      if (tabChip.current) tabChip.current.style.opacity = String(seg(t, 0.7, 1) * (1 - seg(t, 5.1, 5.4)));

      // who is where
      const live = active && t > 5.6 && p.inside;
      if (live) {
        let best = 0;
        let bd = 1e9;
        LINE_Y.forEach((y, i) => {
          if (!TEXT_LINES.includes(i)) return;
          const d = Math.abs(p.y - (y + 34));
          if (d < bd) {
            bd = d;
            best = TEXT_LINES.indexOf(i);
          }
        });
        sel.current.mind = best;
        sel.current.agent = (best + 1) % 3;
      } else {
        sel.current.mind = 0;
        sel.current.agent = t < 4.2 ? 1 : 2;
      }
      const root = rootRef.current!;
      const rr = root.getBoundingClientRect();
      const caret = (el: HTMLDivElement | null, line: number, vis: number) => {
        const s = solid.current[line]!;
        const g = ghost.current[line]!;
        const r = s.getBoundingClientRect();
        const gr = g.textContent ? g.getBoundingClientRect() : r;
        const left = Math.min(r.left, gr.left);
        const x = (left - rr.left) / scale - 6;
        const y = LINE_Y[TEXT_LINES[line]] + 8;
        if (el) {
          el.style.transform = `translate(${x}px, ${y}px)`;
          el.style.opacity = String(vis);
        }
        return { x, y };
      };
      const mCaret = caret(mindCaret.current, sel.current.mind, seg(t, 0.5, 0.8));
      const aCaret = caret(agentCaret.current, sel.current.agent, seg(t, 2.8, 3.1));

      // cross-highlight
      rowRef.current.forEach((el, i) => {
        if (!el) return;
        const lineIdx = TEXT_LINES.indexOf(i);
        el.style.background = live && lineIdx === sel.current.mind ? `${C.mind}1f` : "transparent";
      });
      const hl = (el: HTMLDivElement | null, on: boolean) => {
        if (el) el.style.outline = on ? `2px dashed ${C.mind}` : "2px dashed transparent";
      };
      hl(pvH.current, live && sel.current.mind === 0);
      hl(pvQ.current, live && sel.current.mind === 1);
      hl(pvP.current, live && sel.current.mind === 2);

      const scripted: { mind: V; agent: V } = {
        mind: { x: lerp(1500, mCaret.x - 20, ease(seg(t, 0.3, 1.6))), y: lerp(170, mCaret.y + 36, ease(seg(t, 0.3, 1.6))) },
        agent: { x: lerp(120, aCaret.x - 20, ease(seg(t, 2.2, 3.2))), y: lerp(980, aCaret.y + 40, ease(seg(t, 2.2, 3.2))) },
      };
      const cur = stepFollow(follow.current, {
        t,
        liveFrom: 5.6,
        active,
        pointer: p,
        scripted,
        agentTarget: { x: aCaret.x - 24, y: aCaret.y + 46 },
        agentK: 0.12,
      });
      place(mindRef.current, cur.mind, seg(t, 0.3, 0.6));
      place(agentRef.current, cur.agent, seg(t, 2.2, 2.6));
    },
    { poster: 5.9 },
  );

  const code = "text-[31px] leading-none";
  return (
    <div ref={rootRef} className="absolute inset-0" style={{ background: C.bg }}>
      <div className="absolute left-[56px] top-[96px] h-[936px] w-[1808px] overflow-hidden rounded-[18px]" style={{ background: "#0f1117", border: `1px solid ${C.line}` }}>
        {/* title bar */}
        <div className="absolute inset-x-0 top-0 h-[64px]" style={{ background: C.bar, borderBottom: `1px solid ${C.line}` }} />
      </div>
      <div className="absolute left-[56px] right-[56px] top-[96px] flex h-[64px] items-center justify-between px-[28px]">
        <div className="flex items-center gap-[10px]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-[14px] w-[14px] rounded-full" style={{ background: "#2a2e3b" }} />
          ))}
        </div>
        <span dir="ltr" className="rounded-[8px] px-[18px] py-[6px] text-[24px] font-medium leading-none" style={{ background: C.panel2, color: C.text }}>
          غلاف.md
        </span>
        <div className="flex items-center gap-[18px]">
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-[18px] font-bold text-white" style={{ background: C.mind }}>ع</span>
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-[18px] font-bold text-white" style={{ background: C.agent }}>و</span>
          <RakayaLogo height={34} />
        </div>
      </div>

      {/* source pane */}
      <div className="absolute left-[56px] top-[160px] h-[872px] w-[640px]" style={{ background: "#0f1117", borderRight: `1px solid ${C.line}` }} />
      <div className="absolute top-[160px] h-[872px]" style={{ left: 56 + 640, width: 1808 - 640, background: "#0a0b10", borderBottomRightRadius: 18 }} />

      {[0, 1, 2, 3, 4].map((i) => {
        const ti = TEXT_LINES.indexOf(i);
        return (
          <div
            key={i}
            ref={(el) => {
              if (ti >= 0) rowRef.current[i] = el;
            }}
            className="absolute flex items-center transition-colors duration-150"
            style={{ left: 56, width: 640, top: LINE_Y[i] - 10, height: 68 }}
          >
            <span className="absolute right-[24px] text-[26px] tabular-nums leading-none" dir="ltr" style={{ color: "#4b5163" }}>
              {i + 1}
            </span>
            {ti >= 0 && (
              <span className={`absolute right-[78px] whitespace-nowrap ${code}`} style={{ direction: "rtl" }}>
                <span style={{ color: ti === 0 ? C.mind : ti === 1 ? C.agent : "transparent" }}>{ti === 0 ? "# " : ti === 1 ? "> " : ""}</span>
                <span
                  ref={(el) => {
                    solid.current[ti] = el;
                  }}
                  style={{ color: ti === 1 ? "#cfd5ff" : C.text }}
                />
                <span
                  ref={(el) => {
                    ghost.current[ti] = el;
                  }}
                  style={{ color: "#5b6176", fontStyle: "italic" }}
                />
              </span>
            )}
          </div>
        );
      })}

      {/* carets */}
      <div ref={mindCaret} className="absolute left-0 top-0 h-[48px] w-[3px]" style={{ background: C.mind, opacity: 0 }}>
        <span className="absolute -top-[26px] right-0 whitespace-nowrap rounded-[6px] px-[10px] py-[4px] text-[18px] font-bold leading-none text-white" style={{ background: C.mind }}>عقل</span>
      </div>
      <div ref={agentCaret} className="absolute left-0 top-0 h-[48px] w-[3px]" style={{ background: C.agent, opacity: 0 }}>
        <span className="absolute -top-[26px] right-0 whitespace-nowrap rounded-[6px] px-[10px] py-[4px] text-[18px] font-bold leading-none text-white" style={{ background: C.agent }}>وكيل</span>
      </div>
      <span ref={tabChip} className="absolute left-[400px] top-[640px] rounded-[8px] px-[14px] py-[6px] text-[20px] leading-none" style={{ background: C.panel2, color: C.dim, opacity: 0 }} dir="ltr">
        Tab ↹
      </span>

      {/* preview */}
      <div ref={pvH} className="absolute right-[96px] top-[210px] rounded-[10px] px-[14px] py-[6px] text-[120px] font-black leading-[1.04]" style={{ color: C.text, outline: "2px dashed transparent", outlineOffset: 6 }}>
        <h1 className="m-0 text-[inherit] font-[inherit] leading-[inherit]">
          <span ref={pv1} className="block whitespace-nowrap" />
          <span ref={pv2} className="block whitespace-nowrap" />
        </h1>
      </div>
      <div ref={pvQ} className="absolute right-[96px] top-[560px] rounded-[10px] px-[14px] py-[6px] text-[60px] font-medium leading-none" style={{ opacity: 0, outline: "2px dashed transparent", outlineOffset: 6 }}>
        <span style={{ color: C.mind }}>عقل يبدع</span>
        <span style={{ color: C.dim }}>، </span>
        <span style={{ color: C.agent }}>ووكيل ينفّذ</span>
      </div>
      <div ref={pvP} className="absolute right-[96px] top-[700px] rounded-[10px] px-[14px] py-[6px] text-[34px] leading-none" style={{ opacity: 0, color: C.dim, outline: "2px dashed transparent", outlineOffset: 6 }}>
        {P}
      </div>

      <Cursor color={C.agent} label="وكيل" refEl={agentRef} />
      <Cursor color={C.mind} label="عقل" refEl={mindRef} />
    </div>
  );
}

export default function Editor({ active = true, replay = 0 }: { active?: boolean; replay?: number }) {
  return (
    <Stage active={active} replay={replay} background={C.bg}>
      <Scene />
    </Stage>
  );
}
