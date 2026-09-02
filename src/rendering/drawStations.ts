import type { PlacedStation, StationSheets } from "../types/station";
import {
  STATION_GLOW_OPACITY,
  STATION_GLOW_RADIUS_PIXELS,
  STATION_PROMPT_RISE_PIXELS
} from "../constants/stationSettings";

export function drawStations(
  context: CanvasRenderingContext2D,
  stations: PlacedStation[],
  sheets: StationSheets,
  elapsedSeconds: number
): void {
  for (const station of stations) {
    const sheet = sheets[station.definition.kind];

    if (!sheet) {
      continue;
    }

    const definition = station.definition;

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
      Math.floor(elapsedSeconds * definition.framesPerSecond) % definition.frameCount;

    context.globalAlpha = station.hasBeenUsed ? 0.45 : 1;
    context.drawImage(
      sheet,
      frameIndex * definition.frameSize,
      0,
      definition.frameSize,
      definition.frameSize,
      Math.round(station.horizontalPosition - definition.frameSize / 2),
      Math.round(station.verticalPosition - definition.frameSize + 6),
      definition.frameSize,
      definition.frameSize
    );
    context.globalAlpha = 1;
  }
}

export function drawStationPrompt(
  context: CanvasRenderingContext2D,
  station: PlacedStation
): void {
  const text = `F  ${station.definition.label}`;
  const top = station.verticalPosition - STATION_PROMPT_RISE_PIXELS;

  context.font = "6px 'Silkscreen', monospace";
  context.textAlign = "center";
  context.textBaseline = "middle";

  const width = context.measureText(text).width + 8;

  context.fillStyle = "rgba(14, 10, 8, 0.82)";
  context.fillRect(Math.round(station.horizontalPosition - width / 2), Math.round(top - 6), width, 12);
  context.fillStyle = "#F5D18A";
  context.fillText(text, Math.round(station.horizontalPosition), Math.round(top));
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
}
