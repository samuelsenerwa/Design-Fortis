import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import PROJECTS, { type Project } from "../../data/projects";
import ResponsiveImage from "../ui/ResponsiveImage";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const FEATURED_COUNT = 4;

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);
  useScrollReveal(cardRef, { delayIndex: index, staggerStep: 0.12 });

  return (
    <Link
      ref={cardRef}
      to={`/work/${project.slug}`}
      data-cursor="hover"
      className="relative block overflow-hidden group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full" style={{ paddingBottom: "75%" }}>
        <ResponsiveImage
          name={project.image}
          alt={project.title}
          role="grid"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Project code + location tag — top-left, Lenval-style */}
        <div className="absolute top-4 left-4 md:top-5 md:left-5 flex items-center gap-2 text-white">
          <span className="text-[10px] md:text-xs font-medium tracking-[0.15em] bg-black/40 backdrop-blur-sm px-2 py-1">
            P{project.id}
          </span>
        </div>

        <div
          className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 transition-opacity duration-400"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)",
            opacity: hovered ? 1 : 0,
          }}
        >
          <p className="text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/60 mb-1">
            {project.category} — {project.location}
          </p>
          <h3 className="text-sm md:text-base lg:text-lg font-medium text-white leading-tight">
            {project.title}
          </h3>
          <p className="mt-1 text-[11px] md:text-xs font-light text-white/70 leading-relaxed line-clamp-2 max-w-md">
            {project.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

interface HomeProjectsProps {
  dark: boolean;
}

export default function HomeProjects({ dark }: HomeProjectsProps) {
  const featured = PROJECTS.slice(0, FEATURED_COUNT);
  const headingRef = useRef<HTMLDivElement>(null);
  useScrollReveal(headingRef);

  return (
    <section
      className={`max-w-480 mx-auto px-6 lg:px-10 py-16 md:py-24 ${
        dark ? "bg-black" : "bg-white"
      } transition-colors duration-700`}
    >
      <div
        ref={headingRef}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14"
      >
        <div>
          <h4
            className={`text-xs font-bold uppercase tracking-[0.2em] mb-4 ${
              dark ? "text-white/50" : "text-black/50"
            }`}
          >
            Selected Work
          </h4>
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight ${
              dark ? "text-white" : "text-black"
            }`}
          >
            Landmarks, Shaped by Intent
          </h2>
        </div>
        <Link
          to="/archive"
          data-cursor="hover"
          className={`inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] w-fit border-b pb-1 transition-colors shrink-0 ${
            dark
              ? "text-white border-white/30 hover:border-white"
              : "text-black border-black/30 hover:border-black"
          }`}
        >
          View all work
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {featured.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
