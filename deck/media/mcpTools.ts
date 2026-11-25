/**
 * The ten creative tools on slide 11 (MCP). Slide 11 only: other slides keep their marks in brands.tsx.
 * Each tool was checked on 2026-11-23 against its vendor's docs or its MCP server's own repo; the integration type,
 * an example and the doc link for each are in the speaker notes (deck/content/notes.ts, s11).
 *
 * Logos are official files saved in public/deck/logos/mcp/, unaltered except where noted:
 *   figma.svg            static.figma.com/app/icon/2/favicon.svg — the full-colour mark Figma serves, framed tight
 *                        (same mark and colours as "Figma Icon (Full-color).svg" in figma.com/using-the-figma-brand)
 *   canva.svg            Canva logo pack (canva.dev brand guidelines, Canva-logos.zip) → "Canva Icon logo.svg"
 *   affinity.png         affinity.studio app icon (static.canva.com/domain-assets/affinity, 192px, the largest served)
 *   framer.svg           Framer brand pack (framer.com/brand) → "Framer Icon White.svg"; viewBox added so it scales
 *   davinci-resolve.png  Blackmagic Design press image "DaVinci Resolve Logo Square" (TIFF → PNG, 384px)
 *   rive.svg             rive.app/docs/logo/rive_top_logo_white.svg (Rive's own docs); viewBox added so it scales
 *   blender.png          blender.org logo kit (download.blender.org/branding) → square/blender_icon_1024x1024.png, 384px
 *   cinema4d.svg         Maxon branding (maxon.net/en/about-maxon/branding) → Maxon_Cinema_4D_Mark_Primary.svg
 *   spline.png           spline.design/images/spline_logo.png (the logo the site declares; no SVG is published)
 *   magnific.svg         magnific.com/blog/assets/favicon.svg — the Magnific mark (Freepik's new name); white, the
 *                        variant the site itself shows in dark mode, path unchanged
 *
 * kind "mark" = a symbol drawn inside the deck's tile; kind "icon" = an app icon or badge with its own shape.
 */
export type McpTool = {
  id: string;
  name: string;
  logo: string;
  kind: "mark" | "icon";
};

const L = "/deck/logos/mcp";

/** Order reads right to left, top to bottom: design, images, video, animation, 3D. */
export const MCP_TOOLS: McpTool[] = [
  { id: "figma", name: "Figma", logo: `${L}/figma.svg`, kind: "mark" },
  { id: "canva", name: "Canva", logo: `${L}/canva.svg`, kind: "icon" },
  { id: "framer", name: "Framer", logo: `${L}/framer.svg`, kind: "mark" },
  { id: "affinity", name: "Affinity", logo: `${L}/affinity.png`, kind: "icon" },
  { id: "davinci", name: "DaVinci Resolve", logo: `${L}/davinci-resolve.png`, kind: "icon" },
  { id: "rive", name: "Rive", logo: `${L}/rive.svg`, kind: "mark" },
  { id: "blender", name: "Blender", logo: `${L}/blender.png`, kind: "icon" },
  { id: "cinema4d", name: "Cinema 4D", logo: `${L}/cinema4d.svg`, kind: "icon" },
  { id: "spline", name: "Spline", logo: `${L}/spline.png`, kind: "icon" },
  { id: "magnific", name: "Magnific", logo: `${L}/magnific.svg`, kind: "mark" },
];
