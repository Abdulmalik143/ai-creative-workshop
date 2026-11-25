/**
 * The site is served under a sub-path on GitHub Pages (/ai-creative-workshop/). Next adds that base path to its own
 * bundles, fonts and links, but not to plain strings such as <img src="/deck/..."> or CSS url(), so every file
 * from public/ goes through here. NEXT_PUBLIC_BASE_PATH comes from next.config.ts.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${BASE_PATH}${path}`;
