export type PlayerPosition = { index: number; step: number; replay: number };
export type PlayerCommand = "forward" | "back" | "next" | "previous" | "replay";

export function navigate(position: PlayerPosition, command: PlayerCommand, themes: readonly { steps: number }[]): PlayerPosition {
  const { index, step, replay } = position;
  if (command === "replay") return { index, step: 0, replay: replay + 1 };
  if (command === "forward" && step + 1 < themes[index].steps) return { index, step: step + 1, replay };
  if (command === "back" && step > 0) return { index, step: step - 1, replay };
  const delta = command === "forward" || command === "next" ? 1 : -1;
  const target = (index + delta + themes.length) % themes.length;
  return { index: target, step: command === "back" ? themes[target].steps - 1 : 0, replay };
}
