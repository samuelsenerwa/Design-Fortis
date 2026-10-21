import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getProjectBySlug } from "../data/projects";
import Button from "../components/ui/Button";
import ResponsiveImage from "../components/ui/ResponsiveImage";
import GalleryModal from "../components/gallery/GalleryModal";
import { getLargestUrl } from "../lib/imageManifest";
import { useSplitTextReveal } from "../hooks/useSplitTextReveal";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface ProjectDetailProps {
  dark: boolean;
}

interface GalleryRowProps {
  left?: string;
  right?: string;
  isEven: boolean;
  rowIdx: number;
  title: string;
  onOpen: (index: number) => void;
}

function GalleryRow({ left, right, isEven, rowIdx, title, onOpen }: GalleryRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  useScrollReveal(rowRef, { delayIndex: rowIdx, staggerStep: 0.1, start: "top 92%" });

  return (
    <div ref={rowRef} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
      {left && (
        <div
          className={`overflow-hidden cursor-pointer ${
            isEven ? "md:col-span-7" : "md:col-span-5 md:mt-12"
          }`}
          data-cursor-label="Zoom In"
          onClick={() => onOpen(rowIdx * 2)}
        >
          <ResponsiveImage
            name={left}
            alt={`${title} — ${rowIdx * 2 + 1}`}
            role="gallery"
            className={`w-full object-cover transition-transform duration-1000 ease-out hover:scale-110 ${
              isEven ? "aspect-4/3" : "aspect-3/4"
            }`}
          />
        </div>
      )}

      {right && (
        <div
          className={`overflow-hidden cursor-pointer ${
            isEven ? "md:col-span-5 md:mt-16" : "md:col-span-7"
          }`}
          data-cursor-label="Zoom In"
          onClick={() => onOpen(rowIdx * 2 + 1)}
        >
          <ResponsiveImage
            name={right}
            alt={`${title} — ${rowIdx * 2 + 2}`}
            role="gallery"
            className={`w-full object-cover transition-transform duration-1000 ease-out hover:scale-110 ${
              isEven ? "aspect-3/4" : "aspect-4/3"
            }`}
          />
        </div>
      )}
    </div>
  );
}

export default function ProjectDetail({ dark }: ProjectDetailProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = slug ? getProjectBySlug(slug) : undefined;

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const headingRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  useSplitTextReveal(headingRef, { type: "words" });
  useScrollReveal(introRef, { delayIndex: 1, staggerStep: 0.15 });
  useScrollReveal(detailsRef, { delayIndex: 2, staggerStep: 0.15 });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug, dark]);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  return (
    <main
      className={`min-h-screen pt-20 pb-24 transition-colors duration-700 ${
        dark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Hero image — full width */}
      <div 
        className="w-full aspect-16/7 overflow-hidden cursor-pointer"
        data-cursor-label="View Gallery"
        onClick={() => openGallery(0)}
      >
        <ResponsiveImage
          name={project.image}
          alt={project.title}
          role="hero"
          loading="eager"
          className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
        />
      </div>

      {/* Project header */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 mt-12 md:mt-16">
        <p
          className={`text-xs font-light tracking-[0.3em] uppercase ${
            dark ? "text-white/40" : "text-black/40"
          } mb-3`}
        >
          {project.category}
        </p>
        <h1
          ref={headingRef}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight leading-tight"
        >
          {project.title}
        </h1>
        <p
          ref={introRef}
          className={`mt-6 text-base md:text-lg font-light leading-relaxed max-w-2xl ${
            dark ? "text-white/60" : "text-black/60"
          }`}
        >
          {project.description}
        </p>
      </div>

      {/* Project details grid */}
      <div ref={detailsRef} className="max-w-5xl mx-auto px-6 md:px-10 mt-12">
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 gap-8 py-8 border-t border-b ${
            dark ? "border-white/10" : "border-black/10"
          }`}
        >
          <div>
            <p
              className={`text-[10px] font-light tracking-[0.25em] uppercase ${
                dark ? "text-white/35" : "text-black/35"
              } mb-1`}
            >
              Year
            </p>
            <p className="text-sm font-light">{project.year}</p>
          </div>
          <div>
            <p
              className={`text-[10px] font-light tracking-[0.25em] uppercase ${
                dark ? "text-white/35" : "text-black/35"
              } mb-1`}
            >
              Location
            </p>
            <p className="text-sm font-light">{project.location}</p>
          </div>
          <div>
            <p
              className={`text-[10px] font-light tracking-[0.25em] uppercase ${
                dark ? "text-white/35" : "text-black/35"
              } mb-1`}
            >
              Area
            </p>
            <p className="text-sm font-light">{project.area}</p>
          </div>
          <div>
            <p
              className={`text-[10px] font-light tracking-[0.25em] uppercase ${
                dark ? "text-white/35" : "text-black/35"
              } mb-1`}
            >
              Client
            </p>
            <p className="text-sm font-light">{project.client}</p>
          </div>
        </div>
      </div>

      {/* Full description */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 mt-12">
        <p
          className={`text-sm md:text-base font-light leading-[1.8] max-w-3xl ${
            dark ? "text-white/70" : "text-black/70"
          }`}
        >
          {project.fullDescription}
        </p>
      </div>

      {/* Gallery — asymmetric staggered pairs */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 mt-16">
        <div className="flex flex-col gap-10 md:gap-16">
          {/* Pair images into rows of 2 */}
          {Array.from({ length: Math.ceil(project.gallery.length / 2) }, (_, rowIdx) => (
            <GalleryRow
              key={rowIdx}
              rowIdx={rowIdx}
              left={project.gallery[rowIdx * 2]}
              right={project.gallery[rowIdx * 2 + 1]}
              isEven={rowIdx % 2 === 0}
              title={project.title}
              onOpen={openGallery}
            />
          ))}
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 mt-20 border-t border-gray-200 pt-6">
        <div className="flex flex-col justify-center items-center gap-4 mt-6">
          <p className="uppercase text-xs font-light tracking-[0.2em] text-gray-400">End of Record</p>
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className={`gap-2 px-8 py-3 text-xs font-light tracking-[0.2em] transition-all items-center ${
            dark 
              ? "text-white border-white/20 hover:border-white hover:bg-transparent hover:text-white" 
              : "text-black border-black/20 hover:border-black hover:bg-black hover:text-white"
          }`}
        >
          <span className="text-center">←</span>
          Back to Work
        </Button>
        </div>
      </div>

      {/* Gallery viewer */}
      <GalleryModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        index={galleryIndex}
        title={project.title}
        slides={project.gallery.map((name, i) => ({
          src: getLargestUrl(name, "webp"),
          alt: `${project.title} — ${i + 1}`,
        }))}
      />
    </main>
  );
}
