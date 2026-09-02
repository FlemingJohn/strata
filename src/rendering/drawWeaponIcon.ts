import type { WeaponSprite } from "../constants/weaponSpriteRegions";
import {
  WEAPON_ICON_BOX_SIZE,
  WEAPON_ICON_DISPLAY_SCALE,
  WEAPON_SHEET_PATHS,
  WEAPON_SPRITES
} from "../constants/weaponSpriteRegions";

const loadedSheets: Record<string, Promise<HTMLImageElement>> = {};

function loadWeaponSheet(sheetName: string): Promise<HTMLImageElement> {
  if (!loadedSheets[sheetName]) {
    loadedSheets[sheetName] = new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", () => {
        reject(new Error(`The weapon sheet ${sheetName} could not be loaded`));
      });
      image.src = WEAPON_SHEET_PATHS[sheetName];
    });
  }

  return loadedSheets[sheetName];
}

function paintCentred(
  canvas: HTMLCanvasElement,
  sheet: HTMLImageElement,
  sprite: WeaponSprite
): void {
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, canvas.width, canvas.height);

  const horizontalOffset = Math.floor((WEAPON_ICON_BOX_SIZE - sprite.region.width) / 2);
  const verticalOffset = Math.floor((WEAPON_ICON_BOX_SIZE - sprite.region.height) / 2);

  context.drawImage(
    sheet,
    sprite.region.left,
    sprite.region.top,
    sprite.region.width,
    sprite.region.height,
    horizontalOffset,
    verticalOffset,
    sprite.region.width,
    sprite.region.height
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

  const sprite = WEAPON_SPRITES[weaponSpriteIndex % WEAPON_SPRITES.length];

  loadWeaponSheet(sprite.sheetName)
    .then((sheet) => paintCentred(canvas, sheet, sprite))
    .catch(() => canvas.remove());

  return canvas;
}
