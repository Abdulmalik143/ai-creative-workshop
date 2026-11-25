import { asset } from "@/lib/asset";
/**
 * Media slots. Every deferred file has one entry here; slides read from these entries and never hard-code
 * a path, so replacing a stand-in is a one-line change and the animation stays as it is.
 *
 * Put the files under public/deck/media/ and set `src`. While `src` is undefined the slide shows its
 * stand-in, and the development view (D) labels it PLACEHOLDER.
 */

export type ImageSlot = {
  id: string;
  /** public path of the real file, once it exists */
  src?: string;
  note: string;
};

export type VideoClip = {
  id: string;
  /** the small title shown on the clip */
  title: string;
  /** public path of the licensed file you provide (do not fetch from YouTube) */
  src?: string;
  /** a still shown in the frame while there is no file */
  poster?: string;
  /**
   * Owner's exception to the no-links rule: clicking the still opens this page in a new tab. Nothing on screen may
   * show it is clickable (no cursor change, underline, arrow or hover).
   */
  link?: string;
  /** cut points in seconds. Leave undefined until the cut is decided. */
  start?: number;
  end?: number;
  /** target length of the montage, for the record */
  target?: string;
  reference: string[];
  note: string;
};

/**
 * Slide 26 (key kept as s25Example): the infographic production example. Deferred: the presenter supplies the finished example later.
 * Until `video` is set the slide shows an empty, clearly unfinished frame (and PLACEHOLDER in the D view).
 * Nothing here is invented: no topic, numbers or frames are assumed.
 */
export type InfographicExample = {
  id: string;
  /** the exported MP4 (public path), once it exists */
  video?: string;
  poster?: string;
  /** visual references used for the piece (public image paths) */
  references: string[];
  /** a few short lines on how it was built, in order */
  steps: string[];
  /** editable sources (project folder, composition files), for the record */
  sources: { label: string; url: string }[];
  note: string;
};

export const MEDIA = {
  /** S05/S06: the generated image. Square works best. Undefined = drawn stand-in of the shared sample. */
  s05Image: { id: "s05-image", src: undefined, note: "صورة مولّدة بالذكاء الاصطناعي للطرف الأول (مؤجلة)." } as ImageSlot,

  /**
   * S15: official keynote photo. AP Content Services for Adobe ("IMAGE DISTRIBUTED FOR ADOBE"), AP key 26315106185147.
   * Original 5000x3335 from the page below; stored at 2880 px wide. The slide shows it 16:9 (object-position 37.5%).
   */
  s15Photo: {
    id: "s15-photo",
    src: asset("/deck/media/adobe-max-2026-keynote-mcp.jpg"),
    note: "Anil Chakravarthy announces local MCP integrations (Photoshop, Illustrator, Premiere, After Effects); on screen: Claude with Illustrator. Opening keynote, Adobe MAX 2026, Nov 10, 2026.",
  } as ImageSlot,
  s15PhotoCredit: "Jesus Aranguren / AP Content Services for Adobe",
  s15PhotoPage: "https://www.daytondailynews.com/nation-world/adobe-max-miami-2026/image_bee16a41-fa94-5fa1-af2c-33127d05e2c6.html",

  /** S17: two clips that play one after the other in the same frame. */
  s17Azzam: {
    id: "s17-azzam",
    title: "أثر الفراشة: عزام",
    src: undefined,
    /** the film's poster, supplied by the owner (2026-11-24); slide 17 shows it upright and unframed while there is no video file */
    poster: asset("/deck/media/s17/azzam-poster.jpg"),
    start: undefined,
    end: undefined,
    reference: ["https://azzamfilm.com/ar/", "https://blog.thmanyah.com/post/1nacpxbm4h_1jhggnmybp"],
    note: "مقتطف من الإعلان الرسمي للفيلم. الملف المرخّص يوفّره المقدّم.",
  } as VideoClip,
  s17Higgsfield: {
    id: "s17-higgsfield",
    title: "Higgsfield AI",
    src: undefined,
    /** the channel's Videos page, screenshot supplied by the owner (2026-11-24) */
    poster: asset("/deck/media/s17/higgsfield-youtube-channel.webp"),
    link: "https://www.youtube.com/@HiggsfieldAI/videos",
    start: undefined,
    end: undefined,
    target: "10–15 ثانية",
    reference: ["https://www.youtube.com/watch?v=bY8RDKoBwU0&t=396s", "https://higgsfield.ai/"],
    note: "مونتاج قصير من لقطات مولّدة. الملف المرخّص يوفّره المقدّم.",
  } as VideoClip,

  /**
   * Slide 26: the presenter's intro video, v4 (21.3 s, 1920×1080). Source: ~/Desktop/my website/v2/abdulmalik-intro/out/final.mp4
   * (render_report.json, 2026-11-24). Re-encoded for the deck on 2026-11-25 (x264 CRF 23, AAC 160k, faststart: 8 MB); the poster is
   * the frame at 9.5 s. The original is untouched.
   */
  s26Intro: { src: asset("/deck/media/s26/intro-v4.mp4"), poster: asset("/deck/media/s26/intro-v4-poster.jpg"), duration: 21.312 },

  s25Example: {
    id: "s25-example",
    video: undefined,
    poster: undefined,
    references: [],
    steps: [],
    sources: [],
    note: "مثال إنتاج إنفوجرافيك متحرك كامل، يوفّره المقدّم لاحقًا (MP4 1080p أو أعلى + ملفات المصدر + المراجع). ضع الملفات في public/deck/media/s25/.",
  } as InfographicExample,

  /**
   * Slide 28 (key kept as s27): the presenter's own project, Loon Watch V4 (~/Desktop/Blender/mcp/Loon-Watch-v4/reference_rebuild).
   * Exported on 2026-11-23 without saving or changing the .blend:
   *   sheet   the Product Sheet packed inside the .blend (the image the model was built from), byte for byte
   *   model   exterior assemblies at the final assembled frame (900), glTF binary, modifiers applied, text baked
   *           to mesh; internal parts (PCB, battery…) left out because they are not visible when assembled
   *   render  qa/cycles_hd_0900.png from the same project (Cycles, 1080x1920), saved as JPEG
   */
  /**
   * S22: the two app logos on 3D slabs (deck/kit/LogoSlabs3D.tsx).
   *   davinci   Blackmagic Design press image "DaVinci Resolve Logo Square" (downloads.blackmagicdesign.com,
   *             press-images/davinci-resolve-logo-square, TIFF 852 px → PNG, unaltered)
   *   premiere  undefined: Adobe's product icons are not cleared for third-party use (see slide 11 notes), so the
   *             slab paints the deck's own «Pr» stand-in (same as slide 15). Put an official file at a public
   *             path and set it here to replace the stand-in.
   */
  s22: {
    davinci: asset("/deck/logos/tracks/davinci-resolve.png"),
    premiere: undefined as string | undefined,
  },

  s27: {
    sheet: asset("/deck/media/s27/loon-product-sheet.png"),
    model: asset("/deck/media/s27/loon-watch.glb"),
    render: asset("/deck/media/s27/loon-render-cycles.jpg"),
  },
} as const;
