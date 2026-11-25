import dynamic from "next/dynamic";

/**
 * The two three.js scenes (slide 22's logo slabs, slide 33's watch) load in their own chunk, so three.js stays out
 * of the first load. preload3D() fetches that chunk once the deck is idle, so the slides open without a wait.
 */
const loadSlabs = () => import("./LogoSlabs3D");
const loadWatch = () => import("./WatchModel");

export const LogoSlabs3D = dynamic(() => loadSlabs().then((m) => m.LogoSlabs3D), { ssr: false });
export const WatchModel = dynamic(() => loadWatch().then((m) => m.WatchModel), { ssr: false });

export function preload3D() {
  void loadSlabs();
  void loadWatch();
}
