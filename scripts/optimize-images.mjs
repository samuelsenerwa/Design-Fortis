#!/usr/bin/env node
/**
 * Responsive image optimization pipeline.
 *
 * Reads raw master images from `assets-originals/` (repo root, gitignored)
 * and generates right-sized WebP + JPG derivatives into
 * `src/assets/optimized/<basename>/<basename>-<width>.{webp,jpg}` using ffmpeg
 * (no extra npm dependency — ffmpeg already ships a libwebp encoder).
 *
 * Re-run any time the files in assets-originals/ change:
 *   node scripts/optimize-images.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ORIGINALS_DIR = path.join(ROOT, "assets-originals");
const OUTPUT_DIR = path.join(ROOT, "src", "assets", "optimized");

// Single width ladder covers every usage role in the app:
//   grid thumbnails (ProjectGrid/HomeProjects, Archive)  -> 400, 800, 1200
//   gallery pairs (ProjectDetail)                        -> 800, 1200, 1600
//   hero / full-bleed banners (ProjectDetail hero, Hero)  -> 1200, 1600, 2400
const WIDTHS = [400, 800, 1200, 1600, 2400];

// Small, non-responsive derivatives for favicon/app icon use.
const ICON_WIDTHS = [32, 180];
const ICON_BASENAME = "logo";

const IMAGE_EXT = /\.(png|jpe?g)$/i;

function toBasename(filename) {
  return path
    .basename(filename, path.extname(filename))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function run(args) {
  execFileSync("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
}

function sourceWidth(srcPath) {
  const out = execFileSync(
    "ffprobe",
    ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width", "-of", "csv=p=0", srcPath],
    { encoding: "utf8" }
  );
  return Number.parseInt(out.trim(), 10);
}

/**
 * Widths to generate for one source. Never upscales: a source narrower than
 * the top of the ladder gets the steps below its native width plus one
 * derivative at the native width, instead of several identical copies.
 *
 * Only applied to a basename that has no derivatives yet, so assets that were
 * already optimised keep their existing file names (and the imports built on them).
 */
function widthsFor(srcPath, outDir) {
  const hasOutput = existsSync(outDir) && readdirSync(outDir).length > 0;
  if (hasOutput) return WIDTHS;
  const native = sourceWidth(srcPath);
  if (!Number.isFinite(native) || native >= WIDTHS[WIDTHS.length - 1]) return WIDTHS;
  const below = WIDTHS.filter((w) => w < native);
  return [...below, native];
}

function generateDerivative(srcPath, outPath, width, format) {
  if (existsSync(outPath)) return; // idempotent re-runs
  const scale = `scale='min(${width},iw)':-2`;
  const args = ["-y", "-i", srcPath, "-vf", scale];
  if (format === "webp") {
    args.push("-q:v", "80", outPath);
  } else {
    args.push("-pix_fmt", "yuvj420p", "-q:v", "4", outPath);
  }
  run(args);
}

function main() {
  if (!existsSync(ORIGINALS_DIR)) {
    console.error(`No assets-originals/ directory found at ${ORIGINALS_DIR}`);
    process.exit(1);
  }

  const files = readdirSync(ORIGINALS_DIR).filter((f) => IMAGE_EXT.test(f));
  if (files.length === 0) {
    console.error("No source images found in assets-originals/.");
    process.exit(1);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

  let generated = 0;
  let skippedExisting = 0;

  for (const file of files) {
    const srcPath = path.join(ORIGINALS_DIR, file);
    const basename = toBasename(file);

    if (basename === ICON_BASENAME) {
      // Icon handled separately below — skip from the responsive ladder.
      continue;
    }

    const outDir = path.join(OUTPUT_DIR, basename);
    const widths = widthsFor(srcPath, outDir);
    mkdirSync(outDir, { recursive: true });

    for (const width of widths) {
      for (const format of ["webp", "jpg"]) {
        const outPath = path.join(outDir, `${basename}-${width}.${format}`);
        const existed = existsSync(outPath);
        generateDerivative(srcPath, outPath, width, format);
        if (existed) skippedExisting++;
        else generated++;
        process.stdout.write(".");
      }
    }
  }

  // Favicon / app icon derivatives (PNG only, no srcset needed).
  const logoFile = files.find((f) => toBasename(f) === ICON_BASENAME);
  if (logoFile) {
    const srcPath = path.join(ORIGINALS_DIR, logoFile);
    const iconDir = path.join(OUTPUT_DIR, "icon");
    mkdirSync(iconDir, { recursive: true });
    for (const width of ICON_WIDTHS) {
      const outPath = path.join(iconDir, `icon-${width}.png`);
      if (existsSync(outPath)) {
        skippedExisting++;
        continue;
      }
      run(["-y", "-i", srcPath, "-vf", `scale=${width}:${width}`, outPath]);
      generated++;
      process.stdout.write(".");
    }
  } else {
    console.warn("\nNo logo.png found in assets-originals/ — skipping icon generation.");
  }

  console.log(
    `\nDone. Generated ${generated} new derivative(s), ${skippedExisting} already existed (skipped).`
  );
  console.log(`Output: ${path.relative(ROOT, OUTPUT_DIR)}`);
}

main();
