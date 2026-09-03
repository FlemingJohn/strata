export type SectionShape = "lines" | "steps" | "room" | "controls";

export interface HowToPlayStep {
  title: string;
  detail: string;
}

export interface HowToPlaySection {
  label: string;
  heading: string;
  shape: SectionShape;
  lines: string[];
  steps: HowToPlayStep[];
}

export const PREVIEW_COLUMNS = 21;
export const PREVIEW_ROWS = 10;
export const PREVIEW_SCALE = 3;

export const HOW_TO_PLAY_SECTIONS: HowToPlaySection[] = [
  {
    label: "What this is",
    heading: "Your own payments become the dungeon",
    shape: "lines",
    lines: [
      "Every payment you have made on Ethereum is written down forever.",
      "Creditcoin can check those payments itself, without trusting anyone to tell it the truth.",
      "This game reads your real payments, has Creditcoin prove them, and builds the dungeon out of them.",
      "Nothing you fight through here is made up."
    ],
    steps: []
  },
  {
    label: "What happens",
    heading: "From your history to a floor",
    shape: "steps",
    lines: [],
    steps: [
      {
        title: "Your payments get proved",
        detail: "Nine old payments are checked on Creditcoin. Each one that passes becomes a relic."
      },
      {
        title: "You carry three relics",
        detail: "Each does something different. What your payments were decides what you can do."
      },
      {
        title: "Each floor is one real block",
        detail: "A busy block makes a bigger floor with more enemies. Anyone can check the block."
      }
    ]
  },
  {
    label: "What happens",
    heading: "Down through your history",
    shape: "steps",
    lines: [],
    steps: [
      {
        title: "Clear the rooms",
        detail: "Kill everything in a room and the way out opens."
      },
      {
        title: "Beat the boss, go deeper",
        detail: "The next floor is an older payment. It gets harder the further down you go."
      },
      {
        title: "Die and the run ends",
        detail: "You keep your relics. Your best depth is recorded. A full run is about five minutes."
      }
    ]
  },
  {
    label: "A room",
    heading: "This is what you will be looking at",
    shape: "room",
    lines: [
      "Stone blocks and barrels are solid. Put them between you and the archers.",
      "Water slows you down. So does everything that wades into it.",
      "Enemies raise a weapon before they swing. That is your moment to roll."
    ],
    steps: []
  },
  {
    label: "Controls",
    heading: "Move with the keyboard, aim with the mouse",
    shape: "controls",
    lines: [],
    steps: []
  }
];
