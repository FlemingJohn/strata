import type { SpriteCropRegion } from "../types/spriteSheet";

export const WEAPON_SHEET_PATHS: Record<string, string> = {
  wood: "/assets/pixelCrawler/Weapons/Wood/Wood.png",
  bone: "/assets/pixelCrawler/Weapons/Bone/Bone.png"
};

export interface WeaponSprite {
  sheetName: string;
  region: SpriteCropRegion;
}

export const WEAPON_ICON_BOX_SIZE = 32;
export const WEAPON_ICON_DISPLAY_SCALE = 3;

export const WEAPON_SPRITES: WeaponSprite[] = [
  { sheetName: "wood", region: { left: 119, top: 19, width: 17, height: 24 } },
  { sheetName: "bone", region: { left: 135, top: 19, width: 18, height: 24 } },
  { sheetName: "wood", region: { left: 67, top: 50, width: 29, height: 28 } },
  { sheetName: "wood", region: { left: 112, top: 0, width: 32, height: 16 } },
  { sheetName: "wood", region: { left: 145, top: 0, width: 14, height: 16 } },
  { sheetName: "bone", region: { left: 48, top: 17, width: 16, height: 30 } },
  { sheetName: "wood", region: { left: 0, top: 50, width: 16, height: 28 } },
  { sheetName: "bone", region: { left: 32, top: 49, width: 16, height: 31 } }
];
