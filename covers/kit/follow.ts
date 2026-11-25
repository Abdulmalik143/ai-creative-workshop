import type { V } from "./math";

export type Follow = { mind: V; agent: V; on: boolean };
export const newFollow = (): Follow => ({ mind: { x: 0, y: 0 }, agent: { x: 0, y: 0 }, on: false });

/**
 * The shared behaviour of the series: two cursors that play a scripted intro,
 * then the mind follows your pointer and the agent chases it (or snaps to a target the cover provides).
 * Leave the stage and both glide home to wherever the script parks them.
 */
export function stepFollow(
  f: Follow,
  o: {
    t: number;
    liveFrom: number;
    active: boolean;
    pointer: { x: number; y: number; inside: boolean };
    scripted: { mind: V; agent: V };
    agentTarget?: V | null;
    agentOffset?: V;
    mindK?: number;
    agentK?: number;
  },
) {
  const { t, liveFrom, active, pointer, scripted } = o;
  const live = active && t > liveFrom && pointer.inside;
  const off = o.agentOffset ?? { x: -70, y: 78 };
  if (live) {
    if (!f.on) {
      f.mind = { ...scripted.mind };
      f.agent = { ...scripted.agent };
      f.on = true;
    }
    f.mind.x += (pointer.x - f.mind.x) * (o.mindK ?? 0.35);
    f.mind.y += (pointer.y - f.mind.y) * (o.mindK ?? 0.35);
    const tg = o.agentTarget ?? { x: f.mind.x + off.x, y: f.mind.y + off.y };
    f.agent.x += (tg.x - f.agent.x) * (o.agentK ?? 0.09);
    f.agent.y += (tg.y - f.agent.y) * (o.agentK ?? 0.09);
    return { mind: f.mind, agent: f.agent, live: true };
  }
  if (f.on) {
    f.mind.x += (scripted.mind.x - f.mind.x) * 0.06;
    f.mind.y += (scripted.mind.y - f.mind.y) * 0.06;
    f.agent.x += (scripted.agent.x - f.agent.x) * 0.06;
    f.agent.y += (scripted.agent.y - f.agent.y) * 0.06;
    if (Math.hypot(f.mind.x - scripted.mind.x, f.mind.y - scripted.mind.y) < 2) f.on = false;
    return { mind: f.mind, agent: f.agent, live: false };
  }
  return { mind: scripted.mind, agent: scripted.agent, live: false };
}
