/** Resolve the hashed family name next/font generated, and make sure a weight is loaded for canvas use. */
export async function loadCanvasFont(weight: number, sample: string) {
  const family = getComputedStyle(document.body).fontFamily;
  try {
    await document.fonts.load(`${weight} 100px ${family}`, sample);
  } catch {
    /* fall through: canvas will use whatever is available */
  }
  return family;
}
