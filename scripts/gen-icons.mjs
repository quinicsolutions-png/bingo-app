// One-off icon generator: rasterizes public/icon.svg into the PNG set the
// PWA manifest and iOS expect. Run with Node from the workspace root:
//   node scripts/gen-icons.mjs
// Uses sharp from node_modules (installed with --no-save).

import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const svg = await readFile("public/icon.svg");

async function render(size, file) {
  const png = await sharp(svg, { density: 300 })
    .resize(size, size)
    .png()
    .toBuffer();
  await writeFile(`public/${file}`, png);
  console.log(`public/${file} (${size}x${size})`);
}

// "any" purpose icons + iOS apple-touch-icon
await render(192, "icon-192.png");
await render(512, "icon-512.png");
await render(180, "icon-180.png");

// Maskable icon: the emblem scaled into the 80% safe zone over a solid
// background, so Android adaptive shapes never clip the artwork.
const emblem = await sharp(svg, { density: 300 }).resize(410, 410).png().toBuffer();
const maskable = await sharp({
  create: {
    width: 512,
    height: 512,
    channels: 4,
    background: { r: 6, g: 78, b: 59, alpha: 1 }, // #047857 area base (emerald)
  },
})
  .composite([{ input: emblem, gravity: "center" }])
  .png()
  .toBuffer();
await writeFile("public/icon-512-maskable.png", maskable);
console.log("public/icon-512-maskable.png (512x512)");
