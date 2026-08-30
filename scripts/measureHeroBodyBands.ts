import { readFileSync, writeFileSync } from "fs";
import { inflateSync } from "zlib";

const SKIN_COLOURS = new Set(["#d9a066", "#a26543", "#fac895"]);

const SHEETS_TO_MEASURE: { name: string; path: string }[] = [
  { name: "standingDown", path: "Idle_Base/Idle_Down-Sheet.png" },
  { name: "standingSide", path: "Idle_Base/Idle_Side-Sheet.png" },
  { name: "standingUp", path: "Idle_Base/Idle_Up-Sheet.png" },
  { name: "walkingDown", path: "Run_Base/Run_Down-Sheet.png" },
  { name: "walkingSide", path: "Run_Base/Run_Side-Sheet.png" },
  { name: "walkingUp", path: "Run_Base/Run_Up-Sheet.png" },
  { name: "slicing", path: "Slice_Base/Slice_Down-Sheet.png" },
  { name: "crushing", path: "Crush_Base/Crush_Down-Sheet.png" },
  { name: "piercing", path: "Pierce_Base/Pierce_Down-Sheet.png" }
];

const ANIMATION_FOLDER =
  "public/assets/pixelCrawler/Entities/Characters/Body_A/Animations";
const OUTPUT_PATH = "src/constants/heroBodyBands.ts";

interface DecodedImage {
  width: number;
  height: number;
  stride: number;
  pixels: Buffer;
}

function decodePng(filePath: string): DecodedImage {
  const file = readFileSync(filePath);
  let offset = 8;
  let width = 0;
  let height = 0;
  const compressed: Buffer[] = [];

  while (offset < file.length) {
    const length = file.readUInt32BE(offset);
    const chunkType = file.toString("ascii", offset + 4, offset + 8);
    const data = file.subarray(offset + 8, offset + 8 + length);

    if (chunkType === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
    }

    if (chunkType === "IDAT") {
      compressed.push(data);
    }

    offset += 12 + length;
  }

  const raw = inflateSync(Buffer.concat(compressed));
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const pixels = Buffer.alloc(height * stride);
  let readPosition = 0;

  for (let row = 0; row < height; row++) {
    const filterType = raw[readPosition];
    readPosition += 1;

    for (let index = 0; index < stride; index++) {
      const rawByte = raw[readPosition + index];
      const left = index >= bytesPerPixel ? pixels[row * stride + index - bytesPerPixel] : 0;
      const above = row > 0 ? pixels[(row - 1) * stride + index] : 0;
      const aboveLeft =
        index >= bytesPerPixel && row > 0
          ? pixels[(row - 1) * stride + index - bytesPerPixel]
          : 0;

      let value = rawByte;

      if (filterType === 1) {
        value = rawByte + left;
      } else if (filterType === 2) {
        value = rawByte + above;
      } else if (filterType === 3) {
        value = rawByte + ((left + above) >> 1);
      } else if (filterType === 4) {
        const prediction = left + above - aboveLeft;
        const distanceLeft = Math.abs(prediction - left);
        const distanceAbove = Math.abs(prediction - above);
        const distanceAboveLeft = Math.abs(prediction - aboveLeft);

        if (distanceLeft <= distanceAbove && distanceLeft <= distanceAboveLeft) {
          value = rawByte + left;
        } else if (distanceAbove <= distanceAboveLeft) {
          value = rawByte + above;
        } else {
          value = rawByte + aboveLeft;
        }
      }

      pixels[row * stride + index] = value & 255;
    }

    readPosition += stride;
  }

  return { width, height, stride, pixels };
}

function countSkinPixelsPerRow(image: DecodedImage, frameIndex: number, frameSize: number): number[] {
  const widths: number[] = [];

  for (let row = 0; row < frameSize; row++) {
    let count = 0;

    for (let column = 0; column < frameSize; column++) {
      const position = row * image.stride + (frameIndex * frameSize + column) * 4;

      if (image.pixels[position + 3] === 0) {
        continue;
      }

      const colour =
        "#" +
        [image.pixels[position], image.pixels[position + 1], image.pixels[position + 2]]
          .map((channel) => channel.toString(16).padStart(2, "0"))
          .join("");

      if (SKIN_COLOURS.has(colour)) {
        count += 1;
      }
    }

    widths.push(count);
  }

  return widths;
}

interface BodyBands {
  headTop: number;
  headBottom: number;
  torsoTop: number;
  torsoBottom: number;
  legsTop: number;
  legsBottom: number;
}

const HEAD_SHARE_OF_BODY = 0.42;
const TORSO_SHARE_OF_BODY = 0.3;

function measureFrame(widths: number[]): BodyBands | null {
  const occupiedRows = widths
    .map((width, row) => ({ width, row }))
    .filter((entry) => entry.width > 0);

  if (occupiedRows.length < 6) {
    return null;
  }

  const bodyTop = occupiedRows[0].row;
  const bodyBottom = occupiedRows[occupiedRows.length - 1].row;
  const bodyHeight = bodyBottom - bodyTop + 1;

  const neckRow = bodyTop + Math.round(bodyHeight * HEAD_SHARE_OF_BODY);
  const hipRow = bodyTop + Math.round(bodyHeight * (HEAD_SHARE_OF_BODY + TORSO_SHARE_OF_BODY));

  return {
    headTop: bodyTop,
    headBottom: neckRow,
    torsoTop: neckRow,
    torsoBottom: hipRow,
    legsTop: hipRow,
    legsBottom: bodyBottom + 1
  };
}

function measureSheet(sheetPath: string): BodyBands[] {
  const image = decodePng(sheetPath);
  const frameSize = image.height;
  const frameCount = Math.round(image.width / frameSize);
  const bands: BodyBands[] = [];

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
    const widths = countSkinPixelsPerRow(image, frameIndex, frameSize);
    const measured = measureFrame(widths);

    bands.push(
      measured ?? {
        headTop: 18,
        headBottom: 31,
        torsoTop: 31,
        torsoBottom: 41,
        legsTop: 41,
        legsBottom: 48
      }
    );
  }

  return bands;
}

function buildFileContents(measurements: Record<string, BodyBands[]>): string {
  const lines: string[] = [];

  lines.push("export interface HeroBodyBands {");
  lines.push("  headTop: number;");
  lines.push("  headBottom: number;");
  lines.push("  torsoTop: number;");
  lines.push("  torsoBottom: number;");
  lines.push("  legsTop: number;");
  lines.push("  legsBottom: number;");
  lines.push("}");
  lines.push("");
  lines.push("export const HERO_BODY_BANDS: Record<string, HeroBodyBands[]> = {");

  const sheetNames = Object.keys(measurements);

  sheetNames.forEach((sheetName, sheetIndex) => {
    lines.push(`  ${sheetName}: [`);

    measurements[sheetName].forEach((bands, frameIndex) => {
      const isLastFrame = frameIndex === measurements[sheetName].length - 1;
      lines.push(
        `    { headTop: ${bands.headTop}, headBottom: ${bands.headBottom}, ` +
          `torsoTop: ${bands.torsoTop}, torsoBottom: ${bands.torsoBottom}, ` +
          `legsTop: ${bands.legsTop}, legsBottom: ${bands.legsBottom} }${isLastFrame ? "" : ","}`
      );
    });

    lines.push(`  ]${sheetIndex === sheetNames.length - 1 ? "" : ","}`);
  });

  lines.push("};");
  lines.push("");

  return lines.join("\n");
}

function run(): void {
  const measurements: Record<string, BodyBands[]> = {};

  for (const sheet of SHEETS_TO_MEASURE) {
    const fullPath = `${ANIMATION_FOLDER}/${sheet.path}`;
    measurements[sheet.name] = measureSheet(fullPath);

    const summary = measurements[sheet.name]
      .map((bands) => `${bands.headTop}/${bands.torsoTop}/${bands.legsTop}/${bands.legsBottom}`)
      .join("  ");

    console.log(`${sheet.name.padEnd(14)} ${summary}`);
  }

  writeFileSync(OUTPUT_PATH, buildFileContents(measurements), "utf8");
  console.log("");
  console.log(`wrote ${OUTPUT_PATH}`);
}

run();
