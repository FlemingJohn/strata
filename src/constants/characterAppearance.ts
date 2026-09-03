export interface AppearanceSlot {
  folderName: string;
  displayName: string;
}

export const HEAD_OPTIONS: AppearanceSlot[] = [
  { folderName: "head", displayName: "human" }
];

export const TORSO_OPTIONS: AppearanceSlot[] = [
  { folderName: "torso", displayName: "tunic" },
  { folderName: "torsoLeather", displayName: "leather" },
  { folderName: "torsoLegion", displayName: "legion" },
  { folderName: "torsoPlate", displayName: "plate" }
];

export const HEADGEAR_OPTIONS: AppearanceSlot[] = [
  { folderName: "hood", displayName: "hood" },
  { folderName: "hatHorned", displayName: "horned helm" },
  { folderName: "hatKettle", displayName: "kettle helm" },
  { folderName: "hatViking", displayName: "viking helm" }
];

export const DEMO_WALLET_ADDRESS = "0x7c1a4e9b2f0d8a3c5e7f1b9d2a4c6e8f0b3d5a7c";
