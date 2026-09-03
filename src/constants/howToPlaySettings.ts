export interface HowToPlayStep {
  title: string;
  detail: string;
}

export const THE_POINT_LINES = [
  "Every payment you have ever made on Ethereum is still there, written down forever.",
  "Creditcoin can check those payments itself, without trusting anyone to tell it the truth.",
  "This game reads your real payments, has Creditcoin prove they happened, and builds the dungeon out of them. Nothing here is made up."
];

export const HOW_IT_WORKS_STEPS: HowToPlayStep[] = [
  {
    title: "Your payments get proved",
    detail:
      "Nine of your old payments are checked on Creditcoin. Each one that passes becomes a relic you can carry."
  },
  {
    title: "You carry three relics",
    detail:
      "Each relic came from a different payment and does something different. What your payments were decides what you can do."
  },
  {
    title: "Each floor is one real block",
    detail:
      "The block your payment sat in decides the floor. A busy block makes a bigger floor with more enemies. Anyone can check the block themselves."
  },
  {
    title: "Clear the rooms, find the boss",
    detail:
      "Kill everything in a room and the way out opens. The boss sits at the far end of the floor."
  },
  {
    title: "Beat the boss and go deeper",
    detail:
      "The next floor is an older payment, from further back in your history. It gets harder the further down you go."
  },
  {
    title: "Die and you lose the run",
    detail:
      "You keep your relics. Your best depth is recorded. A full run is about five minutes."
  }
];
