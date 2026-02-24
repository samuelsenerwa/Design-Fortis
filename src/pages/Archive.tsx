import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

import "yet-another-react-lightbox/styles.css";

// Import all images from assets
import img1pp from "../assets/1pp.png";
import img2PP from "../assets/2PP.png";
import img375 from "../assets/3.75.png";
import img392 from "../assets/3.92.png";
import img455 from "../assets/4.55w_Interactive LightMix.png";
import img515 from "../assets/5.15curv.png";
import imgEXTPAV from "../assets/EXTPAV.png";
import imgScene10 from "../assets/Scene 10_1.png";
import imgScene4 from "../assets/Scene 4_1.png";
import imgScene5 from "../assets/Scene 5_1.png";
import imgScene7 from "../assets/Scene 7_1.png";
import imgScene8 from "../assets/Scene 8.png";
import imgCocoon from "../assets/cocoonschema.png";
import imgFamcc from "../assets/famcc.png";

interface ArchiveProps {
  dark: boolean;
}

const ARCHIVE_IMAGES = [
  { src: img1pp, alt: "1pp" },
  { src: img2PP, alt: "2PP" },
  { src: img375, alt: "3.75" },
  { src: img392, alt: "3.92" },
  { src: img455, alt: "4.55w Interactive LightMix" },
  { src: img515, alt: "5.15curv" },
  { src: imgEXTPAV, alt: "EXTPAV" },
  { src: imgScene10, alt: "Scene 10_1" },
  { src: imgScene4, alt: "Scene 4_1" },
  { src: imgScene5, alt: "Scene 5_1" },
  { src: imgScene7, alt: "Scene 7_1" },
  { src: imgScene8, alt: "Scene 8" },
  { src: imgCocoon, alt: "Cocoon Schema" },
  { src: imgFamcc, alt: "Famcc" },
];

export default function Archive({ dark }: ArchiveProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
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
            <div
              key={index}
              className="overflow-hidden cursor-pointer group aspect-square"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={ARCHIVE_IMAGES.map((img) => ({
          src: img.src,
          alt: img.alt,
        }))}
        plugins={[Zoom, Fullscreen]}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.92)" },
        }}
        controller={{ closeOnBackdropClick: true }}
      />
    </main>
  );
}