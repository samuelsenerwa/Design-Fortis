import { useRef } from "react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";

interface ServicesSectionProps {
  dark: boolean;
}

// Sourced verbatim from the existing About page's "What We Do" list.
const SERVICES = [
  "Architectural Design",
  "Interior Design & Space Planning",
  "Landscape & Site Design",
  "Construction & Project Management",
  "3D Visualization & Concept Development",
  "Design Consultation & Feasibility Studies",
];

function ServiceRow({ index, title, dark }: { index: number; title: string; dark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { delayIndex: index, staggerStep: 0.08, y: 30 });

  return (
    <div
      ref={ref}
      className={`group flex items-center justify-between gap-6 py-6 md:py-8 border-b transition-colors ${
        dark ? "border-white/10" : "border-black/10"
      }`}
    >
      <div className="flex items-baseline gap-6 md:gap-10">
        <span
          className={`text-xs md:text-sm font-light tabular-nums ${
            dark ? "text-white/35" : "text-black/35"
          }`}
        >
          {String(index + 1).padStart(2, "0")}.0
        </span>
        <h3
          className={`text-xl md:text-3xl font-extralight tracking-tight ${
            dark ? "text-white" : "text-black"
          }`}
        >
          {title}
        </h3>
      </div>
      <Link
        to="/contact"
        data-cursor="hover"
        className={`shrink-0 text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity ${
          dark ? "text-white" : "text-black"
        }`}
      >
        Let's Talk →
      </Link>
    </div>
  );
}

export default function ServicesSection({ dark }: ServicesSectionProps) {
  return (
    <section
      className={`max-w-480 mx-auto px-6 md:px-12 py-24 md:py-36 transition-colors duration-700 ${
        dark ? "bg-black" : "bg-white"
      }`}
    >
      <h4
        className={`text-xs font-bold uppercase tracking-[0.2em] mb-10 md:mb-16 ${
          dark ? "text-white/50" : "text-black/50"
        }`}
      >
        Services
      </h4>
      <div>
        {SERVICES.map((title, index) => (
          <ServiceRow key={title} index={index} title={title} dark={dark} />
        ))}
      </div>
    </section>
  );
}
