import showreel from "../assets/hero_video.mp4";

/** A pin laid over a picture; `x`/`y` are percentages of the picture. */
export interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  text: string;
}

/** A titled chapter of "What's Inside": a short note and the pictures it scrubs through. */
export interface InsideChapter {
  title: string;
  text: string;
  images: string[];
}

export interface ProgressEntry {
  date: string;
  text: string;
  image: string;
}

/** Everything the case-study page shows beyond the card on the index. Each block is optional. */
export interface ProjectStudy {
  tagline: string;
  overview: string;
  context?: string;
  facts: { label: string; value: string }[];
  /** URL of a video that plays muted on the page and opens full screen with sound. */
  reel?: string;
  quote?: { text: string; author: string; role: string };
  /** Pictures scattered through the page between overview and masterplan. */
  amenities: string[];
  /** A single wide picture carrying hotspots. */
  masterplan?: { image: string; hotspots: Hotspot[] };
  inside?: InsideChapter[];
  progress?: { title: string; text: string; entries: ProgressEntry[] };
  /** Aerial / location picture with its own hotspots. */
  site?: { title: string; image: string; hotspots: Hotspot[] };
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  /** Basename of the responsive image derivative set (see scripts/optimize-images.mjs), not a resolved URL. */
  image: string;
  /** Basenames of the gallery images. */
  gallery: string[];
  year: string;
  location: string;
  area: string;
  client: string;
  study: ProjectStudy;
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
    image: "moswasco_complex",
    gallery: ["moswasco_complex", "underground_parking", "lut_interactive_lightmix"],
    year: "2024",
    location: "Beside NSSF Towers, Mombasa CBD, Kenya",
    area: "Multi-Level Mixed-Use",
    client: "Moswasco",
    study: {
      tagline: "A City Within a City, Shaped for the Coast.",
      overview:
        "Arsvel is delivering a climate-responsive mixed-use landmark beside NSSF Towers in the heart of Mombasa CBD. A 24-hour retail podium, a smart office tower and a residential block of studios and one- and two-bedroom apartments rise above two levels of basement parking for 450 vehicles, with timber louvers, shaded balconies and planting answering the tropical coast on every facade.",
      reel: showreel,
      context:
        "Mombasa's old town meets its new skyline here: a compact urban block that gives the city shade, street life and a place to stay.",
      facts: [
        { label: "Location", value: "Mombasa CBD, Kenya" },
        { label: "Programme", value: "Retail, office, residential" },
        { label: "Parking", value: "450 vehicles, 2 levels" },
        { label: "Design & Build", value: "Arsvel" },
      ],
      quote: {
        text: "We wanted a tower that belongs to Mombasa: deep shade, moving air and a street-level life that never switches off. Every facade decision answers the coast.",
        author: "The Arsvel Team",
        role: "Architects & Builders, Mombasa",
      },
      amenities: ["lut_interactive_lightmix", "underground_parking", "hero_poster", "apartment_interior", "window_view"],
      masterplan: {
        image: "underground_parking",
        hotspots: [
          { id: "moswasco-levels", x: 30, y: 62, title: "Two Basement Levels", text: "Parking for 450 vehicles sits beneath the complex, with clear sightlines, generous bays and direct lift access to every floor above." },
          { id: "moswasco-circulation", x: 56, y: 48, title: "Easy Circulation", text: "Wide drive aisles and one-way loops keep the basements calm at peak hours, with colour-coded zones for visitors, tenants and residents." },
          { id: "moswasco-safety", x: 78, y: 66, title: "Safe By Design", text: "Bollards, lighting and surveillance are planned together so the basements feel as secure as the lobby upstairs." },
          { id: "moswasco-lifts", x: 14, y: 40, title: "Direct to the Lobby", text: "Dedicated lift cores connect each parking level to the podium, the office tower and the residential entrance." },
        ],
      },
      inside: [
        {
          title: "Retail Podium",
          text: "A twenty-four-hour podium of shops, cafes and services wraps the base of the complex, shaded by deep timber louvers and opening onto the street.",
          images: ["moswasco_complex", "lut_interactive_lightmix"],
        },
        {
          title: "Office Tower",
          text: "Flexible, naturally lit floorplates with smart building services give tenants room to grow, with views from the harbour to the Indian Ocean.",
          images: ["lut_interactive_lightmix", "window_view"],
        },
        {
          title: "Residences",
          text: "Studios, one- and two-bedroom apartments are planned around cross-ventilation and shaded balconies, with warm timber and calm palettes inside.",
          images: ["apartment_interior", "room_light", "overcast_room"],
        },
        {
          title: "Parking",
          text: "Two basement levels hold 450 vehicles, cleanly organised and lit, so arrival is simple whether you are here for work, shopping or home.",
          images: ["underground_parking", "room_night"],
        },
      ],
    },
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
    image: "fortis_estate",
    gallery: ["fortis_estate", "fortis_estate_compound", "fortis_estate_front", "window_view"],
    year: "2025",
    location: "Machakos, Kenya",
    area: "15 Acres — Phase One (168 Plots)",
    client: "Fortis Estates",
    study: {
      tagline: "A Master-Planned Community Built Around Home.",
      overview:
        "Fortis Estates is a gated residential community in Machakos, organised around a clear hierarchy of private plot, tree-lined street and central park. Stone plinths, timber fins and woven terracotta screens give every facade its character, and each of the 168 plots in Phase One carries a private plunge pool across fifteen acres of shared amenities.",
      context:
        "Nine-metre tree-lined streets, an Olympic pool, a gym, courts, a kindergarten and a commercial spine make daily life walkable.",
      facts: [
        { label: "Location", value: "Machakos, Kenya" },
        { label: "Site Area", value: "15 acres, Phase One" },
        { label: "Plots", value: "168 homes, 3 & 4 bedrooms" },
        { label: "Design & Build", value: "Arsvel" },
      ],
      quote: {
        text: "A good neighbourhood starts at the front door and continues down the street. We drew the plot, the lane and the park as one connected composition.",
        author: "The Arsvel Team",
        role: "Architects & Builders, Mombasa",
      },
      amenities: ["fortis_estate", "fortis_estate_front", "window_view", "fortis_estate_compound", "room_interior"],
      masterplan: {
        image: "olerian_mara_ground_level_view",
        hotspots: [
          { id: "fortis-park", x: 48, y: 40, title: "Central Park", text: "A landscaped park forms the heart of the estate, linking every street to shaded lawns, play areas and walking loops." },
          { id: "fortis-pool", x: 28, y: 58, title: "Olympic Pool", text: "A full-size pool anchors the shared amenities, with a gym, courts and a kindergarten close at hand." },
          { id: "fortis-streets", x: 70, y: 50, title: "Tree-Lined Streets", text: "Nine-metre streets are planted for shade and set back from private plots, keeping the neighbourhood quiet and green." },
          { id: "fortis-plots", x: 58, y: 70, title: "Private Plots", text: "Every gated plot includes a private plunge pool and domestic staff quarters, sized for family life." },
        ],
      },
      inside: [
        {
          title: "The Home",
          text: "Stone plinths, timber fins and woven terracotta lattice screens compose each facade, filtering light and keeping interiors cool.",
          images: ["fortis_estate", "fortis_estate_compound"],
        },
        {
          title: "The Street",
          text: "Low walls, planted verges and generous setbacks give every street a calm, walkable rhythm.",
          images: ["fortis_estate_front", "fortis_estate_compound"],
        },
        {
          title: "Interiors",
          text: "Warm timber, soft textures and clean joinery carry the architecture inside, with bedrooms that open to light and air.",
          images: ["apartment_interior", "overcast_room_lights", "room_light"],
        },
        {
          title: "Amenities",
          text: "Shared facilities give the community its own centre: sport, play, learning and a small commercial spine at the gate.",
          images: ["window_view", "overcast_night"],
        },
      ],
      progress: {
        title: "A Community Coming to Life",
        text: "At Arsvel, design and construction are one conversation. Our team oversees every detail so quality, efficiency and performance are held through each phase.",
        entries: [
          { date: "Q1 2025", text: "Master plan approved and infrastructure design complete, with roads and drainage set out across Phase One.", image: "fortis_estate_compound" },
          { date: "Q2 2025", text: "Roads, services and the central park are under construction while the first show homes rise.", image: "fortis_estate_front" },
          { date: "Q3 2025", text: "Show homes complete and landscaping planted, with the first plots released to buyers.", image: "fortis_estate" },
        ],
      },
    },
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
    image: "olerian_mara_olosho_enkaji_cottages",
    gallery: [
      "olerian_mara_olosho_enkaji_cottages",
      "olerian_mara_sideview",
      "olerian_mara_lounge",
      "olerian_mara_interior_view",
    ],
    year: "2024",
    location: "Jämtland, Sweden",
    area: "340 m²",
    client: "Nordic Stays Group",
    study: {
      tagline: "A Quiet Cabin at the Edge of the Water.",
      overview:
        "Nordic Retreat is a boutique hospitality project on the shore of a still Scandinavian lake. A dark-stained timber exterior sits low against the forest, while floor-to-ceiling glazing frames uninterrupted views of water and trees. Inside, light oak, natural linen and polished concrete make each suite a private sanctuary.",
      context: "Guests arrive on foot along a timber walkway, the building revealing itself slowly between the pines.",
      facts: [
        { label: "Location", value: "Jämtland, Sweden" },
        { label: "Area", value: "340 sqm" },
        { label: "Completion", value: "2024" },
        { label: "Client", value: "Nordic Stays Group" },
      ],
      amenities: ["olerian_mara_olosho_enkaji_cottages", "olerian_mara_lounge", "olerian_mara_interior_view", "olerian_mara_sideview"],
      masterplan: {
        image: "olerian_mara_ground_level_view",
        hotspots: [
          { id: "nordic-lounge", x: 55, y: 42, title: "The Lounge", text: "A woven timber shell gathers the main living space around the fire, with the water visible from every seat." },
          { id: "nordic-tower", x: 66, y: 17, title: "Lookout Ring", text: "A raised walkway leads to a circular lookout above the treeline, the best place to read the lake at dusk." },
          { id: "nordic-cottages", x: 52, y: 68, title: "Guest Cottages", text: "Cottages follow the contour in a gentle curve, each turned to its own view and linked by timber boardwalks." },
          { id: "nordic-spa", x: 17, y: 72, title: "Spa & Plunge Pool", text: "A sunken pool and spa pavilion sit at the water's edge, sheltered by planting and low stone walls." },
        ],
      },
      inside: [
        {
          title: "Arrival",
          text: "A timber walkway threads through the trees, framing the lake and the cabin before you reach the door.",
          images: ["olerian_mara_cottages_walkways", "olerian_mara_olosho_enkaji_cottages"],
        },
        {
          title: "Lounge",
          text: "A double-height room gathers the household around the fire, with the lake always in view.",
          images: ["olerian_mara_lounge", "olerian_mara_interior_view"],
        },
        {
          title: "The Water",
          text: "A plunge pool at the water's edge continues the landscape into the building.",
          images: ["olerian_mara_sideview", "olerian_mara_cocoon_couple_cottages"],
        },
      ],
    },
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
    image: "olerian_mara_cocoon_couple_cottages",
    gallery: [
      "olerian_mara_cocoon_couple_cottages",
      "olerian_mara_cottages_walkways",
      "olerian_mara_ground_level_view",
      "cocoonschema",
    ],
    year: "2023",
    location: "Hjørundfjorden, Norway",
    area: "85 m²",
    client: "Private",
    study: {
      tagline: "Compact Shelter on a Rocky Shore.",
      overview:
        "Fjord Cabin is a compact dwelling on the shoreline of a Norwegian fjord, built entirely from locally sourced timber. Its angular form turns from the prevailing wind and gathers the low sun, while a single large window turns the living space into a view of the water.",
      facts: [
        { label: "Location", value: "Hjørundfjorden, Norway" },
        { label: "Area", value: "85 sqm" },
        { label: "Completion", value: "2023" },
        { label: "Client", value: "Private" },
      ],
      amenities: ["olerian_mara_cocoon_couple_cottages", "olerian_mara_cottages_walkways", "cocoonschema", "olerian_mara_ground_level_view"],
      masterplan: {
        image: "olerian_mara_sideview",
        hotspots: [
          { id: "fjord-cabin", x: 34, y: 71, title: "The Cabin", text: "A single angular volume of local timber, turned from the wind and set to catch the low winter sun." },
          { id: "fjord-shore", x: 17, y: 88, title: "The Shoreline", text: "The cabin steps down the rock toward the fjord, leaving the natural edge of the site untouched." },
          { id: "fjord-neighbours", x: 62, y: 85, title: "Neighbouring Cabins", text: "Other dwellings sit well apart among the trees, so every cabin keeps its own horizon." },
        ],
      },
      inside: [
        {
          title: "The Cabin",
          text: "A simple timber volume steps down the rock, so the building rests lightly on the site.",
          images: ["olerian_mara_cocoon_couple_cottages", "olerian_mara_cottages_walkways"],
        },
        {
          title: "The Structure",
          text: "Locally sourced timber is cut and assembled in a shell that doubles as the interior finish.",
          images: ["cocoonschema", "builder_components"],
        },
      ],
    },
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
    image: "olerian_mara_ground_level_view",
    gallery: [
      "olerian_mara_ground_level_view",
      "olerian_mara_cottages_walkways",
      "olerian_mara_cocoon_couple_cottages",
      "olerian_mara_interior_view",
    ],
    year: "2024",
    location: "Lofoten, Norway",
    area: "1,200 m²",
    client: "Arctic Hospitality AS",
    study: {
      tagline: "An Alpine Retreat That Disappears Into the Meadow.",
      overview:
        "Mountain Lodge seeks to vanish into its alpine setting. A living green roof joins the building to the meadow, deep-set windows frame the peaks, and a warm palette of reclaimed wood, hand-finished plaster and natural stone gives guests a place to slow down.",
      context: "A monumental fireplace anchors the common rooms, continuing the long tradition of mountain hospitality.",
      facts: [
        { label: "Location", value: "Lofoten, Norway" },
        { label: "Area", value: "1,200 sqm" },
        { label: "Completion", value: "2024" },
        { label: "Client", value: "Arctic Hospitality AS" },
      ],
      amenities: ["olerian_mara_ground_level_view", "olerian_mara_cottages_walkways", "olerian_mara_cocoon_couple_cottages", "olerian_mara_interior_view"],
      site: {
        title: "Lofoten, Norway",
        image: "olerian_mara_ground_level_view",
        hotspots: [
          { id: "lodge-meadow", x: 52, y: 38, title: "The Meadow", text: "The lodge sits within an open alpine meadow, its green roof continuing the grass up and over the building." },
          { id: "lodge-cabins", x: 30, y: 60, title: "Guest Cabins", text: "Small timber cabins are scattered along the contour, each with its own view of the peaks." },
          { id: "lodge-loop", x: 70, y: 62, title: "Walking Loop", text: "A gentle path ties the lodge, cabins and the water together, open to guests all year round." },
        ],
      },
    },
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
    image: "overcast_lights_on",
    gallery: ["overcast_lights_on", "overcast_night", "overcast_room", "overcast_room_lights"],
    year: "2023",
    location: "Cape Town, South Africa",
    area: "490 m²",
    client: "Private",
    study: {
      tagline: "Stacked Volumes Facing the Open Ocean.",
      overview:
        "Coastal Villa celebrates its oceanfront setting with a series of stacked, offset volumes, each turned to catch a different view of the coastline. Deep overhangs shade the glass, retractable walls open the living areas to the sea breeze, and raw concrete, blackened steel and bleached timber echo the weather.",
      facts: [
        { label: "Location", value: "Cape Town, South Africa" },
        { label: "Area", value: "490 sqm" },
        { label: "Completion", value: "2023" },
        { label: "Client", value: "Private" },
      ],
      amenities: ["overcast_lights_on", "overcast_night", "overcast_room", "overcast_room_lights"],
      inside: [
        {
          title: "Day",
          text: "Morning light crosses the bedroom through tall glazing, warming timber and linen.",
          images: ["overcast_room", "overcast_lights_on"],
        },
        {
          title: "Night",
          text: "Concealed lighting and a deep palette turn the same room into a calm evening retreat.",
          images: ["overcast_night", "overcast_room_lights"],
        },
      ],
    },
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
    image: "alllit",
    gallery: ["alllit", "apartment_interior", "lut_interactive_lightmix", "builder_components"],
    year: "2022",
    location: "Copenhagen, Denmark",
    area: "2,800 m²",
    client: "Nordic Development Co.",
    study: {
      tagline: "Limestone Below, Sky Above.",
      overview:
        "Stone & Glass is a mixed-use commercial development that bridges tradition and modernity. Locally quarried limestone wraps the lower floors, giving gravitas and permanence, while a lightweight glass curtain wall above reflects the sky. Retail, office and co-working spaces are linked by a central atrium flooded with daylight.",
      facts: [
        { label: "Location", value: "Copenhagen, Denmark" },
        { label: "Area", value: "2,800 sqm" },
        { label: "Completion", value: "2022" },
        { label: "Client", value: "Nordic Development Co." },
      ],
      amenities: ["alllit", "apartment_interior", "lut_interactive_lightmix", "builder_components"],
    },
  },
  {
    id: 8,
    slug: "terrace-house",
    title: "Terrace House",
    category: "Residential",
    description:
      "Warm-toned Mediterranean residence with pool terrace and open-plan living spaces",
    fullDescription:
      "Terrace House draws inspiration from Mediterranean vernacular architecture, reinterpreted through a contemporary lens. The warm sandstone and terracotta palette grounds the residence in its sun-drenched landscape, while crisp modern lines and generous glazing bring a sense of openness and light. The centrepiece is a cantilevered pool terrace that extends over the hillside, offering sweeping views across olive groves. Interior spaces are defined by natural materials, soft textures, and a curated sense of calm.",
    image: "room_interior",
    gallery: ["room_interior", "room_light", "room_night", "window_view"],
    year: "2024",
    location: "Algarve, Portugal",
    area: "360 m²",
    client: "Private",
    study: {
      tagline: "Warm Stone and Olive Groves, Open to the Hills.",
      overview:
        "Terrace House draws on Mediterranean vernacular and reinterprets it with crisp modern lines and generous glazing. Warm sandstone grounds the house in its sun-drenched landscape, and a cantilevered pool terrace extends across the hillside with views over olive groves. Inside, natural materials and soft textures hold a quiet calm.",
      context: "Dry-stone walls, drought-tolerant planting and shaded terraces let the house sit gently on the hill.",
      facts: [
        { label: "Location", value: "Algarve, Portugal" },
        { label: "Area", value: "360 sqm" },
        { label: "Completion", value: "2024" },
        { label: "Client", value: "Private" },
      ],
      amenities: ["shot_01", "shot_04", "shot_08", "shot_10", "shot_09"],
      inside: [
        {
          title: "The Terrace",
          text: "Low steps and wide landings join the lawn to the living room, so everyday life moves outdoors.",
          images: ["shot_01", "shot_05", "shot_03"],
        },
        {
          title: "Stone & Timber",
          text: "A stacked stone column carries a timber ceiling, a simple detail that sets the tone for the whole house.",
          images: ["shot_02", "shot_06", "shot_11_hand_on_stone"],
        },
        {
          title: "Living Room",
          text: "Floor-to-ceiling glass opens to olive trees and the distant hills, with joinery and light kept soft.",
          images: ["shot_07", "shot_08", "shot_12_intimate_conversation"],
        },
      ],
    },
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
    image: "apartment_interior",
    gallery: ["apartment_interior", "overcast_room_lights", "room_light", "famcc"],
    year: "2023",
    location: "Berlin, Germany",
    area: "210 m²",
    client: "Private",
    study: {
      tagline: "Industrial Heritage, Quietly Refined.",
      overview:
        "Urban Loft turns a former industrial warehouse into a refined home that honours its raw heritage. Exposed concrete columns, steel beams and original brickwork are kept and celebrated, and a floating mezzanine, sculptural steel stair and floor-to-ceiling bookshelves are inserted with precision.",
      facts: [
        { label: "Location", value: "Berlin, Germany" },
        { label: "Area", value: "210 sqm" },
        { label: "Completion", value: "2023" },
        { label: "Client", value: "Private" },
      ],
      amenities: ["apartment_interior", "overcast_room_lights", "room_light", "famcc"],
    },
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
    image: "room_night",
    gallery: ["room_night", "overcast_night", "window_view", "room_interior"],
    year: "2024",
    location: "Kyoto, Japan",
    area: "280 m²",
    client: "Private",
    study: {
      tagline: "A Single Storey Around a Quiet Garden.",
      overview:
        "Pavilion House is a single-storey residence organised around a courtyard garden of water, stone and carefully placed planting. Sliding glass partitions open every room to the garden, and a low flat roof with generous overhangs gives the house a grounded presence and shaded outdoor rooms.",
      facts: [
        { label: "Location", value: "Kyoto, Japan" },
        { label: "Area", value: "280 sqm" },
        { label: "Completion", value: "2024" },
        { label: "Client", value: "Private" },
      ],
      amenities: ["room_night", "overcast_night", "window_view", "room_interior"],
    },
  },
];

export default PROJECTS;

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** The project that follows `slug` in the index, wrapping to the first. */
export function getNextProject(slug: string): Project {
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  return PROJECTS[(index + 1) % PROJECTS.length];
}

export const projectPath = (slug: string) => `/projects/${slug}`;
