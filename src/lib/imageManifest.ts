// Builds a lookup of every generated responsive image derivative
// (see scripts/optimize-images.mjs) so components can reference images
// by a simple basename instead of importing every size/format manually.
//
// Vite resolves image modules' default export to the final asset URL,
// so this glob gives us a flat map of "/abs/path/file.ext" -> url string.
const modules = import.meta.glob("/src/assets/optimized/**/*.{webp,jpg,png}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export type ImageFormat = "webp" | "jpg" | "png";

interface Derivative {
  width: number;
  url: string;
}

type ManifestEntry = Partial<Record<ImageFormat, Derivative[]>>;

const FILENAME_RE = /\/([a-z0-9_]+)-(\d+)\.(webp|jpg|png)$/i;

function buildManifest(): Record<string, ManifestEntry> {
  const manifest: Record<string, ManifestEntry> = {};

  for (const [path, url] of Object.entries(modules)) {
    const match = path.match(FILENAME_RE);
    if (!match) continue;
    const [, basename, widthStr, format] = match;
    const width = Number(widthStr);

    const entry = (manifest[basename] ??= {});
    const list = (entry[format as ImageFormat] ??= []);
    list.push({ width, url });
  }

  for (const entry of Object.values(manifest)) {
    for (const list of Object.values(entry)) {
      list.sort((a, b) => a.width - b.width);
    }
  }

  return manifest;
}

export const imageManifest = buildManifest();

/** Builds a `srcset` string (e.g. "url1 400w, url2 800w, ...") for a given basename/format. */
export function getSrcSet(name: string, format: ImageFormat): string | undefined {
  const list = imageManifest[name]?.[format];
  if (!list || list.length === 0) return undefined;
  return list.map((d) => `${d.url} ${d.width}w`).join(", ");
}

/** Returns the largest available derivative URL for a given basename/format — useful for the lightbox, poster attributes, etc. */
export function getLargestUrl(name: string, format: ImageFormat = "jpg"): string {
  const list = imageManifest[name]?.[format];
  if (!list || list.length === 0) {
    console.warn(`[imageManifest] No "${format}" derivative found for "${name}".`);
    return "";
  }
  return list[list.length - 1].url;
}
