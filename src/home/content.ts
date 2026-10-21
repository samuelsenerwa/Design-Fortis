import PROJECTS from "../data/projects";

/** Intro screen. */
export const LOADER = {
  words: ["A New", "Standard", "Of", "Design"] as const,
  title: "Design Fortis",
  subtitle: "Architectural Design & Build Studio",
  /** Picture that opens between the words. */
  image: "fortis_estate_front",
};

export const HEADER = {
  nav: [
    { label: "About us", to: "/about" },
    { label: "Projects", to: "/archive" },
    { label: "Contact", to: "/contact" },
  ],
  timezoneLabel: "KE",
};

export const HERO = {
  title: "Setting the Standard, One Design at a Time",
  poster: "hero_poster",
  caption: { index: "01", name: "Showreel", place: "Mombasa, Kenya", to: "/archive" },
};

export const ABOUT = {
  label: "About",
  lead: "Design Fortis designs and builds architecture shaped by listening, precision and purpose — from your first idea to a structure that stands in the real world, built to exceed what you imagined possible.",
  caption: "Beyond architecture.",
  paragraphs: [
    "We are your single point of accountability from concept to completion. Our integrated team of architects, designers and builders ensures seamless delivery at every stage.",
    "Every structure we design carries a responsibility — to the people who inhabit it, the landscape it occupies, and the legacy it leaves behind.",
  ],
  image: "fortis_estate",
  imageAlt: "Fortis Estates residence with plunge pool and timber screens",
};

export const MISSION = {
  left: "Beyond",
  right: ["Architecture", "for Lasting", "Legacy"],
  label: "Mission",
  text: "To shape human experience through architecture — with design, craft and construction held by one accountable team, from the first conversation to the final handover.",
  image: "apartment_interior",
  imageAlt: "Light-filled bedroom interior with warm timber detailing",
};

/** Full-bleed stacked project cards (first three projects). */
export const FEATURED = PROJECTS.slice(0, 3);

export const ARCH = {
  title: ["Designed", "to Be Built"],
  columns: [
    "From first sketch to constructed reality, our architects, designers and builders work as one team — so what is drawn is exactly what is delivered.",
    "Whether a residential estate, a mixed-use landmark or a boutique hospitality retreat, we bring design thinking and construction intelligence together from day one.",
  ],
  sketch: "builder_components",
};

export const PURPOSE = {
  words: ["Crafting", "Enduring", "Spaces"],
  text: "Each project begins with a clear vision: to create spaces that balance form, function and a strong sense of place — architecture built with precision and purpose.",
  image: "olerian_mara_olosho_enkaji_cottages",
  caption: { index: "03", name: "Nordic Retreat", place: "Jämtland, Sweden", to: "/work/nordic-retreat" },
};

export const SERVICES = {
  label: "Services",
  items: [
    {
      slug: "architectural-design",
      title: "Architectural Design",
      text: "Concept-to-construction architecture that responds to climate, site and the way you live.",
      image: "fortis_estate_front",
    },
    {
      slug: "interior-design",
      title: "Interior Design & Space Planning",
      text: "Considered interiors and space planning that carry the architecture inward.",
      image: "apartment_interior",
    },
    {
      slug: "landscape-site-design",
      title: "Landscape & Site Design",
      text: "Site strategy and landscape design that ties every structure to its place.",
      image: "olerian_mara_ground_level_view",
    },
    {
      slug: "construction-management",
      title: "Construction & Project Management",
      text: "In-house builders oversee every stage — efficient delivery, cost control and quality.",
      image: "underground_parking",
    },
    {
      slug: "3d-visualization",
      title: "3D Visualization & Concept Development",
      text: "Immersive renders and concept models that let you walk the design before it is built.",
      image: "cocoonschema",
    },
    {
      slug: "feasibility",
      title: "Design Consultation & Feasibility Studies",
      text: "Early advice that tests ideas, budgets and risk before the first line is drawn.",
      image: "lut_interactive_lightmix",
    },
  ],
};

export const CTA = {
  quote: ["“Every Design Fortis project begins", "and ends with the highest standards", "of integrity.”"],
  text: "Integrity is the foundation of every decision we make — from the first concept and the choice of partners to the final handover. We are guided by transparency and accountability.",
  image: "lut_interactive_lightmix",
};

export const CONTACT = {
  email: "designfortis.ke@gmail.com",
  phone: "+254 796 136945",
  studio: "Mombasa, Kenya",
  instagram: "https://www.instagram.com/designfortisfdn?igsh=MmNuYnJqd3FlNmU=",
  linkedin: "https://www.linkedin.com/in/joshua-nyabuto-277b75222/",
};

export const FOOTER = {
  wordmark: "Fortis",
  explore: [
    { label: "Home", to: "/" },
    { label: "About us", to: "/about" },
    { label: "Projects", to: "/archive" },
    { label: "Contact", to: "/contact" },
  ],
};

/** /about — copy and imagery. Photographs here are not used on the home page. */
export const ABOUT_PAGE = {
  hero: {
    label: "Design Fortis",
    title: ["A Studio", "Designing", "& Building", "For Generations"],
    text: "Design Fortis is an architectural design and build studio based in Mombasa, Kenya. We take on a select number of projects, each defined by an uncompromising commitment to design, craftsmanship, and the enduring quality of what we build.",
  },
  values: {
    label: "Our values",
    quote:
      "At Design Fortis, precision, collaboration, and innovation are the foundation of everything we do. We hold ourselves to the highest standards of craft, keep our clients involved at every milestone, and pursue excellence in every detail.",
    author: "The Design Fortis Team",
    role: "Architects & Builders, Mombasa",
  },
  whatWeDo: {
    label: "What we do",
    strapline: "Our ambition is to create timeless architecture that enriches lives and endures for generations.",
    items: [
      {
        label: "Our core",
        title: "Design & Build, End to End",
        text: "We take every project from the first sketch to the final handover. Architects, interior designers and builders work as one accountable team, so what is drawn is exactly what is delivered. Rigorous feasibility, precise documentation and in-house construction management keep each stage on budget, on programme and true to the design intent.",
        image: "shot_02",
        alt: "Stacked limestone column beneath a timber soffit",
      },
      {
        label: "Before the first line",
        title: "Feasibility & Advisory",
        text: "Good projects begin with good questions. We test sites, budgets and risk early, then shape concepts that make the most of the land and the brief. From planning approvals to procurement strategy, we guide clients through each decision, so they commit with confidence before a single shilling is spent.",
        image: "shot_12_intimate_conversation",
        alt: "Two people in conversation on a terrace",
      },
      {
        label: "Considered detail",
        title: "Interiors & Landscape",
        text: "Architecture does not end at the façade. We design interiors, joinery and landscape as one composition, so materials, light and planting carry the idea from the threshold to the horizon. Every space is detailed for the climate, the site and the way our clients live.",
        image: "shot_07",
        alt: "Timber ceiling and glazing framing an olive tree",
      },
    ],
  },
  partnership: {
    title: "Partnership",
    text: ["We work with a select circle of partners who", "share our commitment to craftsmanship.", "Every collaboration is built on a shared vision, uncompromising standards, and the highest levels of integrity."],
    cta: "Begin the Conversation",
    image: "olerian_mara_cottages_walkways",
    alt: "Sunlit timber deck with loungers beneath a woven roof",
    caption: { index: "03", name: "Nordic Retreat", place: "Jämtland, Sweden", to: "/work/nordic-retreat" },
  },
  cta: {
    quote: "“Every Design Fortis project begins and ends with the highest standards of integrity”",
    text: "Integrity is the foundation of every decision we make. From identifying opportunities and selecting partners to managing construction and delivering completed projects, we are guided by transparency and accountability.",
    image: "olerian_mara_interior_view",
    alt: "Lattice timber dome over a lounge with hanging greenery",
  },
};
