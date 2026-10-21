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
