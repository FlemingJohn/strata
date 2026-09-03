import { PIXEL_FONTS_TO_WAIT_FOR } from "../constants/fontSettings";

let pendingWait: Promise<void> | null = null;

export function waitForPixelFonts(): Promise<void> {
  if (pendingWait) {
    return pendingWait;
  }

  if (!document.fonts) {
    pendingWait = Promise.resolve();
    return pendingWait;
  }

  pendingWait = Promise.all(
    PIXEL_FONTS_TO_WAIT_FOR.map((font) => document.fonts.load(font).catch(() => undefined))
  )
    .then(() => document.fonts.ready)
    .then(() => undefined)
    .catch(() => undefined);

  return pendingWait;
}
