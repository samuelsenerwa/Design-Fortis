import type { Project } from "../../data/projects";

/**
 * Every picture the lightbox can show, in the order the page lays them out, plus where
 * each section's pictures start. Sections use the offsets to open the viewer on the
 * picture that was clicked.
 */
export interface GalleryPlan {
  slides: string[];
  hero: number;
  amenities: number;
  masterplan: number;
  /** First slide of each "What's Inside" chapter. */
  chapters: number[];
}

export function planGallery({ image, study }: Project): GalleryPlan {
  const slides: string[] = [image];
  const amenities = slides.length;
  slides.push(...study.amenities);
  const masterplan = slides.length;
  if (study.masterplan) slides.push(study.masterplan.image);
  const chapters = (study.inside ?? []).map((chapter) => {
    const start = slides.length;
    slides.push(...chapter.images);
    return start;
  });
  return { slides, hero: 0, amenities, masterplan, chapters };
}
