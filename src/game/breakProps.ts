import type { CombatParticle } from "../types/combat";
import type { PlacedProp } from "../types/prop";
import type { PlayerCharacter } from "../types/player";
import type { RoomTileMap } from "../types/dungeon";
import {
  BREAKING_PARTICLE_COLOUR,
  BREAKING_PARTICLE_COUNT,
  CHANCE_A_BROKEN_PROP_HEALS,
  HEALTH_FROM_A_BROKEN_PROP
} from "../constants/propSettings";
import { SOLID_PROP_BASE_HEIGHT_PIXELS } from "../constants/solidObjectSettings";
import { burstParticles } from "./createImpactFeedback";
import { unblockRoomTiles } from "./blockRoomTiles";

export function breakPropsInReach(
  props: PlacedProp[],
  tileMap: RoomTileMap,
  player: PlayerCharacter,
  particles: CombatParticle[],
  attackArea: { horizontal: number; vertical: number; radius: number }
): number {
  let brokenCount = 0;

  for (let index = props.length - 1; index >= 0; index--) {
    const prop = props[index];

    if (!prop.isBreakable) {
      continue;
    }

    const distance = Math.hypot(
      attackArea.horizontal - prop.horizontalPosition,
      attackArea.vertical - (prop.verticalPosition - prop.region.height / 2)
    );

    if (distance > attackArea.radius + prop.region.width / 2) {
      continue;
    }

    unblockRoomTiles(
      tileMap,
      prop.horizontalPosition,
      prop.verticalPosition,
      prop.region.width,
      SOLID_PROP_BASE_HEIGHT_PIXELS
    );

    burstParticles(
      particles,
      prop.horizontalPosition,
      prop.verticalPosition - prop.region.height / 2,
      BREAKING_PARTICLE_COUNT,
      BREAKING_PARTICLE_COLOUR,
      130
    );

    props.splice(index, 1);
    brokenCount += 1;

    if (Math.random() < CHANCE_A_BROKEN_PROP_HEALS) {
      player.currentHealth = Math.min(
        player.maximumHealth,
        player.currentHealth + HEALTH_FROM_A_BROKEN_PROP
      );
    }
  }

  return brokenCount;
}
