import { useRef, useState } from "react";
import ResponsiveImage from "../components/ui/ResponsiveImage";
import GalleryModal from "../components/gallery/GalleryModal";
import { getLargestUrl } from "../lib/imageManifest";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface ArchiveProps {
  dark: boolean;
}

// Basenames of the responsive image derivatives (see scripts/optimize-images.mjs).
const ARCHIVE_IMAGES = [
  { name: "alllit", alt: "All Lit" },
  { name: "builder_components", alt: "Builder Components" },
  { name: "cocoonschema", alt: "Cocoon Schema" },
  { name: "underground_parking", alt: "Commercial Basement Parking Design" },
  { name: "famcc", alt: "Famcc" },
  { name: "fortis_estate", alt: "Fortis Estate" },
  { name: "fortis_estate_compound", alt: "Fortis Estate Compound" },
  { name: "fortis_estate_front", alt: "Fortis Estate Front" },
  { name: "lut_interactive_lightmix", alt: "LUT Interactive LightMix" },
  { name: "olerian_mara_cocoon_couple_cottages", alt: "Olerian Mara Compound" },
  { name: "olerian_mara_interior_view", alt: "Olerian Mara Interior View" },
  { name: "olerian_mara_lounge", alt: "Olerian Mara Lounge" },
  { name: "olerian_mara_ground_level_view", alt: "Olerian Mara Master" },
  { name: "olerian_mara_cottages_walkways", alt: "Olerian Mara Picnic" },
  { name: "olerian_mara_olosho_enkaji_cottages", alt: "Olerian Mara Picnic Area" },
  { name: "olerian_mara_sideview", alt: "Olerian Mara Sideview" },
  { name: "apartment_interior", alt: "Overcast" },
  { name: "overcast_lights_on", alt: "Overcast Lights On" },
  { name: "overcast_night", alt: "Overcast Night" },
  { name: "overcast_room", alt: "Overcast Room" },
  { name: "overcast_room_lights", alt: "Overcast Room Lights" },
  { name: "room_interior", alt: "Room Interior" },
  { name: "room_light", alt: "Room Light" },
  { name: "room_night", alt: "Room Night" },
  { name: "moswasco_complex", alt: "Villa" },
  { name: "window_view", alt: "Window View" },
];

function ArchiveItem({
  name,
  alt,
  index,
  onOpen,
}: {
  name: string;
  alt: string;
  index: number;
  onOpen: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { delayIndex: index % 4, staggerStep: 0.08, y: 30, start: "top 95%" });

  return (
    <div
      ref={ref}
      className="overflow-hidden cursor-pointer group aspect-square"
      data-cursor-label="View"
      onClick={() => onOpen(index)}
    >
      <ResponsiveImage
        name={name}
        alt={alt}
        role="grid"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
    </div>
  );
}

export default function Archive({ dark }: ArchiveProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  return (
    <main
      className={`min-h-screen pt-20 pb-24 transition-colors duration-700 ${
        dark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-12 md:mt-16 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight leading-tight mb-4">
          Archive
        </h1>
        <p
          className={`text-sm md:text-base font-light leading-relaxed max-w-2xl ${
            dark ? "text-white/60" : "text-black/60"
          }`}
        >
          A collection of architectural visualizations, design explorations, and project studies.
        </p>
      </div>

      {/* Image grid */}
      <div className=" mx-auto px-6 md:px-10 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ARCHIVE_IMAGES.map((image, index) => (
            <ArchiveItem
              key={index}
              name={image.name}
              alt={image.alt}
              index={index}
              onOpen={openGallery}
            />
          ))}
        </div>
      </div>

      {/* Gallery viewer */}
      <GalleryModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        index={galleryIndex}
        title="Archive"
        slides={ARCHIVE_IMAGES.map((img) => ({
          src: getLargestUrl(img.name, "webp"),
          alt: img.alt,
        }))}
      />
    </main>
  );
}