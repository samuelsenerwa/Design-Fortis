import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

import "yet-another-react-lightbox/styles.css";

// Import all images from assets
import alllit from "../assets/alllit.png";
import builderComponents from "../assets/builder_components.jpg";
import cocoonSchema from "../assets/cocoonschema.png";
import commercialBasement from "../assets/underground_parking.png";
import famcc from "../assets/famcc.jpg";
import fortisEstate from "../assets/fortis_estate.jpg";
import fortisEstateCompound from "../assets/fortis_estate_compound.jpg";
import fortisEstateFront from "../assets/fortis_estate_front.jpg";
import lutInteractive from "../assets/lut_Interactive LightMix.png";
import olerianMaraCompound from "../assets/olerian_mara_cocoon_couple_cottages.jpg";
import olerianMaraInterior from "../assets/olerian_mara_interior_view.jpg";
import olerianMaraLounge from "../assets/olerian_mara_lounge.jpg";
import olerianMaraMaster from "../assets/olerian_mara_ground_level_view.png";
import olerianMaraPicnic from "../assets/olerian_mara_cottages_walkways.jpg";
import olerianMaraPicnicArea from "../assets/olerian_mara_olosho_enkaji_cottages.jpg";
import olerianMaraSideview from "../assets/olerian_mara_sideview.jpg";
import overcast from "../assets/apartment_interior.png";
import overcastLightsOn from "../assets/overcast_lights_on.png";
import overcastNight from "../assets/overcast_night.png";
import overcastRoom from "../assets/overcast_room.png";
import overcastRoomLights from "../assets/overcast_room_lights.png";
import roomInterior from "../assets/room_interior.png";
import roomLight from "../assets/room_light.png";
import roomNight from "../assets/room_night.png";
import villa from "../assets/moswasco_complex.png";
import windowView from "../assets/window_view.png";

interface ArchiveProps {
  dark: boolean;
}

const ARCHIVE_IMAGES = [
  { src: alllit, alt: "All Lit" },
  { src: builderComponents, alt: "Builder Components" },
  { src: cocoonSchema, alt: "Cocoon Schema" },
  { src: commercialBasement, alt: "Commercial Basement Parking Design" },
  { src: famcc, alt: "Famcc" },
  { src: fortisEstate, alt: "Fortis Estate" },
  { src: fortisEstateCompound, alt: "Fortis Estate Compound" },
  { src: fortisEstateFront, alt: "Fortis Estate Front" },
  { src: lutInteractive, alt: "LUT Interactive LightMix" },
  { src: olerianMaraCompound, alt: "Olerian Mara Compound" },
  { src: olerianMaraInterior, alt: "Olerian Mara Interior View" },
  { src: olerianMaraLounge, alt: "Olerian Mara Lounge" },
  { src: olerianMaraMaster, alt: "Olerian Mara Master" },
  { src: olerianMaraPicnic, alt: "Olerian Mara Picnic" },
  { src: olerianMaraPicnicArea, alt: "Olerian Mara Picnic Area" },
  { src: olerianMaraSideview, alt: "Olerian Mara Sideview" },
  { src: overcast, alt: "Overcast" },
  { src: overcastLightsOn, alt: "Overcast Lights On" },
  { src: overcastNight, alt: "Overcast Night" },
  { src: overcastRoom, alt: "Overcast Room" },
  { src: overcastRoomLights, alt: "Overcast Room Lights" },
  { src: roomInterior, alt: "Room Interior" },
  { src: roomLight, alt: "Room Light" },
  { src: roomNight, alt: "Room Night" },
  { src: villa, alt: "Villa" },
  { src: windowView, alt: "Window View" },
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