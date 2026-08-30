import type { DirectionalSpriteSheet } from "../types/lpcCharacter";
import type { FacingDirection } from "../types/spriteSheet";
import {
  LPC_ROW_FACING_DOWN,
  LPC_ROW_FACING_LEFT,
  LPC_ROW_FACING_RIGHT,
  LPC_ROW_FACING_UP
} from "../constants/lpcCharacterSettings";

const ROW_FOR_FACING: Record<FacingDirection, number> = {
  up: LPC_ROW_FACING_UP,
  left: LPC_ROW_FACING_LEFT,
  down: LPC_ROW_FACING_DOWN,
  right: LPC_ROW_FACING_RIGHT
};

export function drawLpcCharacter(
  context: CanvasRenderingContext2D,
  sheet: DirectionalSpriteSheet,
  frameIndex: number,
  facing: FacingDirection,
  destinationLeft: number,
  destinationTop: number
): void {
  const row = Math.min(ROW_FOR_FACING[facing], sheet.rowCount - 1);
  const column = frameIndex % sheet.frameCount;

  context.drawImage(
    sheet.canvas,
    column * sheet.frameSize,
    row * sheet.frameSize,
    sheet.frameSize,
    sheet.frameSize,
    destinationLeft,
    destinationTop,
    sheet.frameSize,
    sheet.frameSize
  );
}
