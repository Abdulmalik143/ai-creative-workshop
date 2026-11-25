"use client";

/* eslint-disable @next/next/no-img-element */
import { Fragment } from "react";
import { S15 } from "../content/copy";
import { MEDIA } from "../media/media";
import { BRANDS, BrandMark } from "../media/brands";
import { D, MONO } from "../theme";
import { SlideTitle } from "../kit/ui";
import type { SlideProps, StepDef } from "../types";

export const steps: StepDef[] = [{ key: "news", label: "الخبر" }];

/** The photo, 16:9, cropped from the 3:2 original: a little stage lighting off the top, a little audience off the bottom. */
const PHOTO = { w: 1328, h: 747, top: 148, focus: "50% 37.5%" };

/** Latin runs inside Arabic text, each isolated left-to-right so numbers and names never reorder. */
function Mixed({ text }: { text: string }) {
  return (
    <>
      {text.split(/([A-Za-z][A-Za-z0-9 .\-+×]*[A-Za-z0-9])/).map((part, i) =>
        i % 2 ? (
          <bdi key={i} dir="ltr">
            {part}
          </bdi>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/**
 * A quick news slide. Reading order: the small title, the large keynote photo, then the four apps
 * Adobe's announcement names for the local MCP integrations, then one line of context. Everything shows at once.
 */
export default function S15AdobeNews(_: SlideProps) {
  return (
    <div className="absolute inset-0">
      <SlideTitle latin size={54}>
        {S15.title}
      </SlideTitle>

      {/* the official keynote photo */}
      <figure className="absolute left-1/2 m-0 -translate-x-1/2 overflow-hidden rounded-[24px]" style={{ top: PHOTO.top, width: PHOTO.w, height: PHOTO.h, border: `1.5px solid ${D.lineStrong}`, boxShadow: "0 30px 90px rgba(0,0,0,.55)" }}>
        <img src={MEDIA.s15Photo.src} alt={S15.photoLabel} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: PHOTO.focus }} draggable={false} />
        <div className="absolute inset-x-0 bottom-0 h-[120px]" style={{ background: "linear-gradient(transparent, rgba(5,8,13,.7))" }} />
        <figcaption className="absolute bottom-[20px] right-[22px] rounded-full px-[22px] py-[10px] text-[26px] font-bold leading-none" style={{ background: "rgba(5,8,13,.78)", color: D.mist, border: `1px solid ${D.line}` }}>
          <Mixed text={S15.photoLabel} />
        </figcaption>
        <span dir="ltr" className="absolute bottom-[24px] left-[24px] text-[15px] font-medium" style={{ color: "rgba(242,245,245,.72)", fontFamily: MONO }}>
          Photo: {MEDIA.s15PhotoCredit}
        </span>
      </figure>

      {/* the apps named in the announcement */}
      <ul className="absolute inset-x-0 m-0 flex list-none justify-center gap-[56px] p-0" style={{ top: PHOTO.top + PHOTO.h + 28 }}>
        {S15.apps.map((id) => (
          <li key={id} className="flex items-center gap-[16px]">
            <BrandMark id={id} size={62} radius={15} />
            <span dir="ltr" className="whitespace-nowrap text-[32px] font-bold leading-none" style={{ color: D.mist }}>
              {BRANDS[id].name}
            </span>
          </li>
        ))}
      </ul>

      {/* one line of context: announced, not available yet */}
      <p className="absolute m-0 text-right text-[28px] font-medium leading-none" style={{ top: PHOTO.top + PHOTO.h + 118, right: (1920 - PHOTO.w) / 2, color: D.dim }}>
        <Mixed text={S15.context} />
      </p>
    </div>
  );
}
