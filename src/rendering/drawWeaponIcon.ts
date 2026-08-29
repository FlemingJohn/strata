import type { SpriteCropRegion } from "../types/spriteSheet";
import {
  WEAPON_ICON_BOX_SIZE,
  WEAPON_ICON_DISPLAY_SCALE,
  WEAPON_SPRITE_REGIONS,
  WOOD_WEAPON_SHEET_PATH
} from "../constants/weaponSpriteRegions";

let sharedWeaponSheet: HTMLImageElement | null = null;
let sharedWeaponSheetRequest: Promise<HTMLImageElement> | null = null;

function loadWeaponSheet(): Promise<HTMLImageElement> {
  if (sharedWeaponSheet) {
    return Promise.resolve(sharedWeaponSheet);
  }

  if (!sharedWeaponSheetRequest) {
    sharedWeaponSheetRequest = new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => {
        sharedWeaponSheet = image;
        resolve(image);
      });
      image.addEventListener("error", () => {
        reject(new Error("The weapon sheet could not be loaded"));
      });
      image.src = WOOD_WEAPON_SHEET_PATH;
    });
  }

  return sharedWeaponSheetRequest;
}

function paintCentred(
  canvas: HTMLCanvasElement,
  sheet: HTMLImageElement,
  region: SpriteCropRegion
): void {
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, canvas.width, canvas.height);

  const horizontalOffset = Math.floor((WEAPON_ICON_BOX_SIZE - region.width) / 2);
  const verticalOffset = Math.floor((WEAPON_ICON_BOX_SIZE - region.height) / 2);

  context.drawImage(
    sheet,
    region.left,
    region.top,
    region.width,
    region.height,
    horizontalOffset,
    verticalOffset,
    region.width,
    region.height
  );
}

export function createWeaponIconCanvas(weaponSpriteIndex: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.className = "weapon-icon";
  canvas.width = WEAPON_ICON_BOX_SIZE;
  canvas.height = WEAPON_ICON_BOX_SIZE;
  canvas.style.width = `${WEAPON_ICON_BOX_SIZE * WEAPON_ICON_DISPLAY_SCALE}px`;
  canvas.style.height = `${WEAPON_ICON_BOX_SIZE * WEAPON_ICON_DISPLAY_SCALE}px`;
  canvas.setAttribute("aria-hidden", "true");

  const region = WEAPON_SPRITE_REGIONS[weaponSpriteIndex % WEAPON_SPRITE_REGIONS.length];

  loadWeaponSheet()
    .then((sheet) => paintCentred(canvas, sheet, region))
    .catch(() => canvas.remove());

  return canvas;
}
