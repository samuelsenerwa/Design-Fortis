import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PROJECTS, { type Project } from "../../data/projects";

gsap.registerPlugin(ScrollTrigger);


// Split projects into alternating rows: 2, 3, 2, 3...

function buildRows(projects: Project[]): Project[][] {
  const rows: Project[][] = [];
  let i = 0;
  let rowSize = 2;

  while (i < projects.length) {
    rows.push(projects.slice(i, i + rowSize));
    i += rowSize;
    rowSize = rowSize === 2 ? 3 : 2; 
  }

  return rows;
}

// Single project card

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 60 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: index * 0.12,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [index]);

  return (
    <Link
      ref={cardRef}
      to={`/work/${project.slug}`}
      className="relative block overflow-hidden group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ opacity: 0 }}
    >
      {/* Image */}
      <div className="relative w-full" style={{ paddingBottom: "75%" }}>
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 transition-opacity duration-400"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)",
            opacity: hovered ? 1 : 0,
          }}
        >
          <p className="text-[10px] md:text-xs font-light tracking-[0.25em] uppercase text-white/60 mb-1">
            {project.category}
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

// Grid component

interface ProjectGridProps {
  dark: boolean;
}

export default function ProjectGrid({ dark }: ProjectGridProps) {
  const rows = buildRows(PROJECTS);

  return (
    <section
      className={`w-full px-6 lg:px-10 ${dark ? "bg-black" : "bg-white"} transition-colors duration-700`}
    >
      <div className="flex flex-col gap-1">
        {rows.map((row, rowIndex) => {
          const colCount = row.length;
          // 3-col row or 2-col row
          const gridCols =
            colCount === 3
              ? "grid-cols-1 sm:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2";

          return (
            <div key={rowIndex} className={`grid ${gridCols} gap-1`}>
              {row.map((project, colIdx) => (
                <ProjectCard key={project.id} project={project} index={colIdx} />
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
