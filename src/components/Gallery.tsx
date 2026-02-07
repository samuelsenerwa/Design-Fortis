import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface GalleryImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

// Demo images — replace with your own
const images: GalleryImage[] = Array.from({ length: 35 }, (_, i) => ({
  src: `https://picsum.photos/seed/${i + 1}/${600 + (i % 3) * 100}/${
    800 + ((i + 1) % 4) * 100
  }`,
  alt: `Gallery image ${i + 1}`,
  width: 600 + (i % 3) * 100,
  height: 800 + ((i + 1) % 4) * 100,
}));

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Gallery</h2>

      {/* Responsive masonry grid using CSS columns */}
      <div className="columns-1 gap-3 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative mb-3 break-inside-avoid cursor-pointer overflow-hidden rounded-xl group"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.src}
              alt={image.alt || ""}
              loading="lazy"
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox with plugins */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images.map((img) => ({
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height,
        }))}
        plugins={[Counter, Fullscreen, Slideshow, Thumbnails, Zoom]}
        counter={{ container: { style: { top: "unset", bottom: 0 } } }}
        thumbnails={{
          position: "bottom",
          width: 80,
          height: 60,
          gap: 4,
          borderRadius: 4,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
        slideshow={{ delay: 3000 }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.92)" },
        }}
        controller={{ closeOnBackdropClick: true }}
      />
    </section>
  );
}
