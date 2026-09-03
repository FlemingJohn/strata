import type { PlacedStation, StationSheets } from "../types/station";
import {
  STATION_GLOW_OPACITY,
  STATION_GLOW_RADIUS_PIXELS
} from "../constants/stationSettings";

export function drawStations(
  context: CanvasRenderingContext2D,
  stations: PlacedStation[],
  sheets: StationSheets,
  elapsedSeconds: number
): void {
  for (const station of stations) {
    const appearance = station.appearance;
    const sheet = sheets[appearance.sheetName];

    if (!sheet) {
      continue;
    }

    if (!station.hasBeenUsed) {
      const radius =
        STATION_GLOW_RADIUS_PIXELS * (1 + Math.sin(elapsedSeconds * 2.4) * 0.08);
      const glow = context.createRadialGradient(
        station.horizontalPosition,
        station.verticalPosition - 8,
        0,
        station.horizontalPosition,
        station.verticalPosition - 8,
        radius
      );

      glow.addColorStop(0, `rgba(255, 196, 96, ${STATION_GLOW_OPACITY})`);
      glow.addColorStop(1, "rgba(255, 170, 60, 0)");

      context.globalCompositeOperation = "lighter";
      context.fillStyle = glow;
      context.fillRect(
        station.horizontalPosition - radius,
        station.verticalPosition - 8 - radius,
        radius * 2,
        radius * 2
      );
      context.globalCompositeOperation = "source-over";
    }

    const frameIndex =
      Math.floor(elapsedSeconds * appearance.framesPerSecond) % appearance.frameCount;

    context.globalAlpha = station.hasBeenUsed ? 0.45 : 1;
    context.drawImage(
      sheet,
      frameIndex * appearance.frameWidth,
      0,
      appearance.frameWidth,
      appearance.frameHeight,
      Math.round(station.horizontalPosition - appearance.frameWidth / 2),
      Math.round(station.verticalPosition - appearance.frameHeight + 6),
      appearance.frameWidth,
      appearance.frameHeight
    );
    context.globalAlpha = 1;
  }
}
