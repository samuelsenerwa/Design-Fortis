export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  image: string;
  gallery: string[];
  year: string;
  location: string;
  area: string;
  client: string;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    slug: "moswasco-complex",
    title: "Moswasco Complex",
    category: "Mixed-Use / Urban Development",
    description:
      "A climate-responsive mixed-use landmark in Mombasa CBD — retail podium, office tower, residential apartments & 2-level underground parking for 450 vehicles.",
    fullDescription:
      "Rising beside NSSF Towers in Mombasa's CBD, Moswasco Complex unites a 24-hour retail podium, a smart office tower, and a residential block of studios and 1 & 2-bed apartments. Every facade decision — timber louvers, shaded balconies, greenery — responds to the tropical coast. Two basement parking levels serve 450 vehicles, anchoring the complex as a true city-within-a-city in the heart of Mombasa.",
    image: new URL("../assets/moswasco_complex.png", import.meta.url).href,
    gallery: [
      new URL("../assets/moswasco_complex.png", import.meta.url).href,
      new URL("../assets/underground_parking.png", import.meta.url).href,
      new URL("../assets/lut_Interactive LightMix.png", import.meta.url).href,
    ],
    year: "2024",
    location: "Beside NSSF Towers, Mombasa CBD, Kenya",
    area: "Multi-Level Mixed-Use",
    client: "Moswasco",
  },
  {
    id: 2,
    slug: "fortis-estates",
    title: "Fortis Estates",
    category: "Residential",
    description:
      "A master-planned gated community in Machakos — 168 plots of 3 & 4-bed homes with private plunge pools, terracotta lattice screens, timber fins, and shared amenities.",
    fullDescription:
      "Fortis Estates is a master-planned residential community in Machakos, built around a hierarchy of private plot, tree-lined street, and central park. Stone plinths, timber fins, and woven terracotta screens compose each facade. Every gated plot includes a private plunge pool and DSQ. Shared amenities include an Olympic pool, gym, courts, kindergarten, and commercial spine. Phase One: 168 plots across 15 acres, 9-metre tree-lined streets.",
    image: new URL("../assets/fortis_estate.jpg", import.meta.url).href,
    gallery: [
      new URL("../assets/fortis_estate.jpg", import.meta.url).href,
      new URL("../assets/fortis_estate_compound.jpg", import.meta.url).href,
      new URL("../assets/fortis_estate_front.jpg", import.meta.url).href,
      new URL("../assets/window_view.png", import.meta.url).href,
    ],
    year: "2025",
    location: "Machakos, Kenya",
    area: "15 Acres — Phase One (168 Plots)",
    client: "Fortis Estates",
  },
  {
    id: 3,
    slug: "nordic-retreat",
    title: "Nordic Retreat",
    category: "Hospitality",
    description:
      "Dark timber cabin with panoramic lake views and minimalist Scandinavian interiors",
    fullDescription:
      "Nordic Retreat is a boutique hospitality project set on the shores of a pristine Scandinavian lake. The dark-stained timber exterior creates a striking silhouette against the natural landscape, while floor-to-ceiling windows frame uninterrupted views of water and forest. Inside, the interiors embrace a restrained material palette of light oak, natural linen, and polished concrete. Each suite is designed as a private sanctuary, offering guests an immersive connection to nature without sacrificing contemporary comfort.",
    image: new URL("../assets/olerian_mara_olosho_enkaji_cottages.jpg", import.meta.url).href,
    gallery: [
      new URL("../assets/olerian_mara_olosho_enkaji_cottages.jpg", import.meta.url).href,
      new URL("../assets/olerian_mara_sideview.jpg", import.meta.url).href,
      new URL("../assets/olerian_mara_lounge.jpg", import.meta.url).href,
      new URL("../assets/olerian_mara_interior_view.jpg", import.meta.url).href,
    ],
    year: "2024",
    location: "Jämtland, Sweden",
    area: "340 m²",
    client: "Nordic Stays Group",
  },
  {
    id: 4,
    slug: "fjord-cabin",
    title: "Fjord Cabin",
    category: "Residential",
    description:
      "Compact waterfront dwelling nestled among Norwegian fjords with sustainable timber construction",
    fullDescription:
      "Fjord Cabin is a compact yet deeply considered dwelling perched on the rocky shoreline of a Norwegian fjord. Built entirely from locally sourced timber, the cabin demonstrates that sustainable architecture need not compromise on beauty or ambition. The structure's angular form responds to prevailing winds and maximizes solar gain, while a large picture window transforms the living space into a living landscape painting. The project is a meditation on shelter, simplicity, and the power of place.",
    image: new URL("../assets/olerian_mara_cocoon_couple_cottages.jpg", import.meta.url).href,
    gallery: [
      new URL("../assets/olerian_mara_cocoon_couple_cottages.jpg", import.meta.url).href,
      new URL("../assets/olerian_mara_cottages_walkways.jpg", import.meta.url).href,
      new URL("../assets/olerian_mara_ground_level_view.png", import.meta.url).href,
      new URL("../assets/cocoonschema.png", import.meta.url).href,
    ],
    year: "2023",
    location: "Hjørundfjorden, Norway",
    area: "85 m²",
    client: "Private",
  },
  {
    id: 5,
    slug: "mountain-lodge",
    title: "Mountain Lodge",
    category: "Hospitality",
    description:
      "Alpine retreat with green roof integration and dramatic mountain backdrop",
    fullDescription:
      "Mountain Lodge is a hospitality project that seeks to disappear into its alpine setting. A living green roof merges the building with the surrounding meadow, while deep-set windows frame cinematic views of snow-capped peaks. The interior embraces a warm, tactile palette of reclaimed wood, hand-finished plaster, and natural stone. Common areas are anchored by a monumental fireplace, creating a gathering point that evokes the timeless tradition of mountain hospitality.",
    image: new URL("../assets/olerian_mara_ground_level_view.png", import.meta.url).href,
    gallery: [
      new URL("../assets/olerian_mara_ground_level_view.png", import.meta.url).href,
      new URL("../assets/olerian_mara_cottages_walkways.jpg", import.meta.url).href,
      new URL("../assets/olerian_mara_cocoon_couple_cottages.jpg", import.meta.url).href,
      new URL("../assets/olerian_mara_interior_view.jpg", import.meta.url).href,
    ],
    year: "2024",
    location: "Lofoten, Norway",
    area: "1,200 m²",
    client: "Arctic Hospitality AS",
  },
  {
    id: 6,
    slug: "coastal-villa",
    title: "Coastal Villa",
    category: "Residential",
    description:
      "Elevated coastal home with cantilevered volumes and floor-to-ceiling ocean views",
    fullDescription:
      "Coastal Villa is a bold residential project that celebrates its dramatic oceanfront setting. The design employs a series of stacked and offset volumes, each oriented to capture different views of the coastline. Deep overhangs provide shade while framing the horizon, and retractable glass walls open the living areas entirely to the sea breeze. The material palette — raw concrete, blackened steel, and bleached timber — reflects the rugged beauty of the coastal environment.",
    image: new URL("../assets/overcast_lights_on.png", import.meta.url).href,
    gallery: [
      new URL("../assets/overcast_lights_on.png", import.meta.url).href,
      new URL("../assets/overcast_night.png", import.meta.url).href,
      new URL("../assets/overcast_room.png", import.meta.url).href,
      new URL("../assets/overcast_room_lights.png", import.meta.url).href,
    ],
    year: "2023",
    location: "Cape Town, South Africa",
    area: "490 m²",
    client: "Private",
  },
  {
    id: 7,
    slug: "stone-and-glass",
    title: "Stone & Glass",
    category: "Commercial",
    description:
      "Mixed-use building blending natural stone cladding with contemporary glass curtain walls",
    fullDescription:
      "Stone & Glass is a mixed-use commercial development that bridges tradition and modernity. The lower floors are wrapped in locally quarried limestone, lending gravitas and permanence, while the upper levels feature a lightweight glass curtain wall that reflects the sky and surrounding cityscape. The building houses retail, office, and co-working spaces, all connected by a dramatic central atrium flooded with natural light. The project demonstrates that commercial architecture can be both functional and deeply beautiful.",
    image: new URL("../assets/alllit.png", import.meta.url).href,
    gallery: [
      new URL("../assets/alllit.png", import.meta.url).href,
      new URL("../assets/apartment_interior.png", import.meta.url).href,
      new URL("../assets/lut_Interactive LightMix.png", import.meta.url).href,
      new URL("../assets/builder_components.jpg", import.meta.url).href,
    ],
    year: "2022",
    location: "Copenhagen, Denmark",
    area: "2,800 m²",
    client: "Nordic Development Co.",
  },
  {
    id: 5,
    slug: "terrace-house",
    title: "Terrace House",
    category: "Residential",
    description:
      "Warm-toned Mediterranean residence with pool terrace and open-plan living spaces",
    fullDescription:
      "Terrace House draws inspiration from Mediterranean vernacular architecture, reinterpreted through a contemporary lens. The warm sandstone and terracotta palette grounds the residence in its sun-drenched landscape, while crisp modern lines and generous glazing bring a sense of openness and light. The centrepiece is a cantilevered pool terrace that extends over the hillside, offering sweeping views across olive groves. Interior spaces are defined by natural materials, soft textures, and a curated sense of calm.",
    image: new URL("../assets/room_interior.png", import.meta.url).href,
    gallery: [
      new URL("../assets/room_interior.png", import.meta.url).href,
      new URL("../assets/room_light.png", import.meta.url).href,
      new URL("../assets/room_night.png", import.meta.url).href,
      new URL("../assets/window_view.png", import.meta.url).href,
    ],
    year: "2024",
    location: "Algarve, Portugal",
    area: "360 m²",
    client: "Private",
  },
  {
    id: 9,
    slug: "urban-loft",
    title: "Urban Loft",
    category: "Residential",
    description:
      "Converted industrial space with exposed concrete, steel beams, and curated minimalism",
    fullDescription:
      "Urban Loft transforms a former industrial warehouse into a refined residential space that honours its raw heritage. Exposed concrete columns, steel beams, and original brickwork are preserved and celebrated, forming a dramatic backdrop for contemporary living. New interventions — a floating mezzanine, a sculptural steel staircase, and floor-to-ceiling bookshelves — are inserted with surgical precision. The result is a home that feels both monumental and deeply personal, where industrial grit meets curated minimalism.",
    image: new URL("../assets/apartment_interior.png", import.meta.url).href,
    gallery: [
      new URL("../assets/apartment_interior.png", import.meta.url).href,
      new URL("../assets/overcast_room_lights.png", import.meta.url).href,
      new URL("../assets/room_light.png", import.meta.url).href,
      new URL("../assets/famcc.jpg", import.meta.url).href,
    ],
    year: "2023",
    location: "Berlin, Germany",
    area: "210 m²",
    client: "Private",
  },
  {
    id: 10,
    slug: "pavilion-house",
    title: "Pavilion House",
    category: "Residential",
    description:
      "Single-story pavilion design with courtyard garden and sliding glass partitions",
    fullDescription:
      "Pavilion House is a single-story residence organized around a central courtyard garden. The design draws on the tradition of the courtyard house, creating a private world within — a serene landscape of water, stone, and carefully placed planting. Sliding glass partitions allow every room to open fully to the garden, blurring the line between built and natural space. The low-slung profile and flat roof give the house a quiet, grounded presence, while generous overhangs create shaded outdoor living areas.",
    image: new URL("../assets/room_night.png", import.meta.url).href,
    gallery: [
      new URL("../assets/room_night.png", import.meta.url).href,
      new URL("../assets/overcast_night.png", import.meta.url).href,
      new URL("../assets/window_view.png", import.meta.url).href,
      new URL("../assets/room_interior.png", import.meta.url).href,
    ],
    year: "2024",
    location: "Kyoto, Japan",
    area: "280 m²",
    client: "Private",
  },
];

export default PROJECTS;

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
