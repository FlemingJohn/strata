import type { AnimatedPropSheets, PlacedAnimatedProp } from "../types/animatedProp";

export function drawAnimatedProps(
  context: CanvasRenderingContext2D,
  props: PlacedAnimatedProp[],
  sheets: AnimatedPropSheets,
  elapsedSeconds: number
): void {
  for (const prop of props) {
    const sheet = sheets[prop.definition.name];

    if (!sheet) {
      continue;
    }

    const definition = prop.definition;
    const frameIndex =
      Math.floor(elapsedSeconds * definition.framesPerSecond) % definition.frameCount;

    context.drawImage(
      sheet,
      frameIndex * definition.frameSize,
      0,
      definition.frameSize,
      definition.frameSize,
      Math.round(prop.horizontalPosition - definition.frameSize / 2),
      Math.round(prop.verticalPosition - definition.frameSize + 4),
      definition.frameSize,
      definition.frameSize
    );
  }
}
