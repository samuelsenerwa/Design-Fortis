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
    slug: "villa-oster",
    title: "Villa Öster",
    category: "Residential",
    description:
      "Contemporary Scandinavian villa designed with clean lines, natural materials, and refined spatial balance",
    fullDescription:
      "Villa Öster is a contemporary Scandinavian residence that embodies the principles of Nordic minimalism. The design prioritizes natural light, clean geometries, and a seamless relationship between interior and exterior spaces. Clad in warm timber and cool concrete, the villa sits gracefully within its landscape, offering panoramic views through expansive glazing. Every detail — from the cantilevered upper volume to the recessed entrance — has been carefully considered to create a home that feels both monumental and intimate.",
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?w=1200&h=800&fit=crop&q=80",
    ],
    year: "2024",
    location: "Stockholm, Sweden",
    area: "420 m²",
    client: "Private",
  },
  {
    id: 2,
    slug: "casa-moderna",
    title: "Casa Moderna",
    category: "Residential",
    description:
      "Modern luxury residence featuring expansive glass facades and seamless indoor-outdoor living",
    fullDescription:
      "Casa Moderna redefines luxury living through bold architectural gestures and meticulous material selection. The residence features a dramatic cantilevered upper floor that extends over a ground-level pool terrace, creating a striking interplay of mass and void. Floor-to-ceiling glass walls dissolve the boundary between inside and out, while natural stone and warm timber bring tactile richness to every surface. The open-plan living spaces flow effortlessly into landscaped gardens, embodying a lifestyle of refined ease.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7e17a7?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&h=800&fit=crop&q=80",
    ],
    year: "2023",
    location: "Marbella, Spain",
    area: "580 m²",
    client: "Private",
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
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=800&fit=crop&q=80",
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
    image:
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616137466211-f02fc81ae5d1?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1200&h=800&fit=crop&q=80",
    ],
    year: "2023",
    location: "Hjørundfjorden, Norway",
    area: "85 m²",
    client: "Private",
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
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&h=800&fit=crop&q=80",
    ],
    year: "2024",
    location: "Algarve, Portugal",
    area: "360 m²",
    client: "Private",
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
    image:
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200&h=800&fit=crop&q=80",
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
    image:
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=1200&h=800&fit=crop&q=80",
    ],
    year: "2022",
    location: "Copenhagen, Denmark",
    area: "2,800 m²",
    client: "Nordic Development Co.",
  },
  {
    id: 8,
    slug: "mountain-lodge",
    title: "Mountain Lodge",
    category: "Hospitality",
    description:
      "Alpine retreat with green roof integration and dramatic mountain backdrop",
    fullDescription:
      "Mountain Lodge is a hospitality project that seeks to disappear into its alpine setting. A living green roof merges the building with the surrounding meadow, while deep-set windows frame cinematic views of snow-capped peaks. The interior embraces a warm, tactile palette of reclaimed wood, hand-finished plaster, and natural stone. Common areas are anchored by a monumental fireplace, creating a gathering point that evokes the timeless tradition of mountain hospitality.",
    image:
      "https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop&q=80",
    ],
    year: "2024",
    location: "Lofoten, Norway",
    area: "1,200 m²",
    client: "Arctic Hospitality AS",
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
    image:
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&h=800&fit=crop&q=80",
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
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616137466211-f02fc81ae5d1?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&h=800&fit=crop&q=80",
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
