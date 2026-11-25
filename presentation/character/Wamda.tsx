import Image from "next/image";

type Pose = "idle" | "dash" | "look";
type Appearance =
  | { state?: "hidden" | "silhouette"; colorAsset?: never }
  | { state: "reveal" | "revealed"; colorAsset: string };

type WamdaProps = Appearance & { pose?: Pose; className?: string };

export function Wamda({ state = "silhouette", pose = "idle", colorAsset, className }: WamdaProps) {
  if (state === "hidden") return null;

  return (
    <span className={`wamda ${className ?? ""}`} data-state={state} aria-hidden="true">
      {state !== "revealed" && (
        <Image className="wamda-shadow" src={`/wamda/${pose}.png`} alt="" fill sizes="(max-width: 600px) 35vw, 25vw" unoptimized />
      )}
      {colorAsset && (state === "reveal" || state === "revealed") && (
        <Image className="wamda-color" src={colorAsset} alt="" fill sizes="25vw" />
      )}
    </span>
  );
}
