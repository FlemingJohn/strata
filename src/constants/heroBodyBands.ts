export interface HeroBodyBands {
  headTop: number;
  headBottom: number;
  torsoTop: number;
  torsoBottom: number;
  legsTop: number;
  legsBottom: number;
}

export const HERO_BODY_BANDS: Record<string, HeroBodyBands[]> = {
  standingDown: [
    { headTop: 19, headBottom: 31, torsoTop: 31, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 20, headBottom: 32, torsoTop: 32, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 21, headBottom: 32, torsoTop: 32, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 20, headBottom: 32, torsoTop: 32, torsoBottom: 40, legsTop: 40, legsBottom: 48 }
  ],
  standingSide: [
    { headTop: 19, headBottom: 31, torsoTop: 31, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 20, headBottom: 32, torsoTop: 32, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 21, headBottom: 32, torsoTop: 32, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 20, headBottom: 32, torsoTop: 32, torsoBottom: 40, legsTop: 40, legsBottom: 48 }
  ],
  standingUp: [
    { headTop: 19, headBottom: 31, torsoTop: 31, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 20, headBottom: 32, torsoTop: 32, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 21, headBottom: 32, torsoTop: 32, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 20, headBottom: 32, torsoTop: 32, torsoBottom: 40, legsTop: 40, legsBottom: 48 }
  ],
  walkingDown: [
    { headTop: 19, headBottom: 30, torsoTop: 30, torsoBottom: 38, legsTop: 38, legsBottom: 46 },
    { headTop: 19, headBottom: 31, torsoTop: 31, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 20, headBottom: 31, torsoTop: 31, torsoBottom: 39, legsTop: 39, legsBottom: 47 },
    { headTop: 19, headBottom: 30, torsoTop: 30, torsoBottom: 38, legsTop: 38, legsBottom: 46 },
    { headTop: 19, headBottom: 31, torsoTop: 31, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 20, headBottom: 31, torsoTop: 31, torsoBottom: 39, legsTop: 39, legsBottom: 47 }
  ],
  walkingSide: [
    { headTop: 18, headBottom: 30, torsoTop: 30, torsoBottom: 39, legsTop: 39, legsBottom: 47 },
    { headTop: 19, headBottom: 31, torsoTop: 31, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 19, headBottom: 31, torsoTop: 31, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 18, headBottom: 29, torsoTop: 29, torsoBottom: 37, legsTop: 37, legsBottom: 45 },
    { headTop: 19, headBottom: 31, torsoTop: 31, torsoBottom: 39, legsTop: 39, legsBottom: 47 },
    { headTop: 19, headBottom: 31, torsoTop: 31, torsoBottom: 39, legsTop: 39, legsBottom: 47 }
  ],
  walkingUp: [
    { headTop: 19, headBottom: 31, torsoTop: 31, torsoBottom: 39, legsTop: 39, legsBottom: 47 },
    { headTop: 20, headBottom: 31, torsoTop: 31, torsoBottom: 39, legsTop: 39, legsBottom: 46 },
    { headTop: 20, headBottom: 32, torsoTop: 32, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 19, headBottom: 31, torsoTop: 31, torsoBottom: 39, legsTop: 39, legsBottom: 47 },
    { headTop: 20, headBottom: 31, torsoTop: 31, torsoBottom: 39, legsTop: 39, legsBottom: 46 },
    { headTop: 20, headBottom: 32, torsoTop: 32, torsoBottom: 40, legsTop: 40, legsBottom: 48 }
  ],
  slicing: [
    { headTop: 17, headBottom: 30, torsoTop: 30, torsoBottom: 39, legsTop: 39, legsBottom: 48 },
    { headTop: 16, headBottom: 29, torsoTop: 29, torsoBottom: 39, legsTop: 39, legsBottom: 48 },
    { headTop: 15, headBottom: 29, torsoTop: 29, torsoBottom: 39, legsTop: 39, legsBottom: 48 },
    { headTop: 25, headBottom: 33, torsoTop: 33, torsoBottom: 39, legsTop: 39, legsBottom: 44 },
    { headTop: 24, headBottom: 33, torsoTop: 33, torsoBottom: 39, legsTop: 39, legsBottom: 45 },
    { headTop: 23, headBottom: 33, torsoTop: 33, torsoBottom: 40, legsTop: 40, legsBottom: 46 },
    { headTop: 22, headBottom: 33, torsoTop: 33, torsoBottom: 41, legsTop: 41, legsBottom: 48 },
    { headTop: 21, headBottom: 32, torsoTop: 32, torsoBottom: 40, legsTop: 40, legsBottom: 48 }
  ],
  crushing: [
    { headTop: 18, headBottom: 31, torsoTop: 31, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 17, headBottom: 30, torsoTop: 30, torsoBottom: 39, legsTop: 39, legsBottom: 48 },
    { headTop: 17, headBottom: 30, torsoTop: 30, torsoBottom: 39, legsTop: 39, legsBottom: 48 },
    { headTop: 26, headBottom: 35, torsoTop: 35, torsoBottom: 42, legsTop: 42, legsBottom: 48 },
    { headTop: 27, headBottom: 36, torsoTop: 36, torsoBottom: 42, legsTop: 42, legsBottom: 48 },
    { headTop: 24, headBottom: 34, torsoTop: 34, torsoBottom: 41, legsTop: 41, legsBottom: 47 },
    { headTop: 22, headBottom: 33, torsoTop: 33, torsoBottom: 41, legsTop: 41, legsBottom: 48 },
    { headTop: 22, headBottom: 33, torsoTop: 33, torsoBottom: 41, legsTop: 41, legsBottom: 48 }
  ],
  piercing: [
    { headTop: 20, headBottom: 32, torsoTop: 32, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 20, headBottom: 32, torsoTop: 32, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 20, headBottom: 32, torsoTop: 32, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 25, headBottom: 35, torsoTop: 35, torsoBottom: 42, legsTop: 42, legsBottom: 49 },
    { headTop: 23, headBottom: 34, torsoTop: 34, torsoBottom: 41, legsTop: 41, legsBottom: 48 },
    { headTop: 22, headBottom: 33, torsoTop: 33, torsoBottom: 41, legsTop: 41, legsBottom: 48 },
    { headTop: 21, headBottom: 32, torsoTop: 32, torsoBottom: 40, legsTop: 40, legsBottom: 48 },
    { headTop: 21, headBottom: 32, torsoTop: 32, torsoBottom: 40, legsTop: 40, legsBottom: 48 }
  ]
};
