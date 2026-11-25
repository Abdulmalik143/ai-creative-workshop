import Image from "next/image";
import { coverContent } from "../content";

export function Brand({ className }: { className?: string }) {
  return <Image className={className} src="/brand/rakaya.svg" width={456} height={189} alt="ركايا" unoptimized />;
}

export function CoverTitle({ className = "" }: { className?: string }) {
  return (
    <h2 className={`cover-title ${className}`}>
      <span>{coverContent.title[0]}</span>{" "}
      <span>{coverContent.title[1]}</span>
    </h2>
  );
}

export function CoverByline({ className = "" }: { className?: string }) {
  return (
    <div className={`cover-byline ${className}`}>
      <p>{coverContent.subtitle}</p>
      <strong>{coverContent.presenter}</strong>
    </div>
  );
}
