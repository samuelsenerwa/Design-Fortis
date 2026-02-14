import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getProjectBySlug } from "../data/projects";
import Button from "../components/ui/Button";

interface ProjectDetailProps {
  dark: boolean;
}

export default function ProjectDetail({ dark }: ProjectDetailProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = slug ? getProjectBySlug(slug) : undefined;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  return (
    <main
      className={`min-h-screen pt-20 pb-24 transition-colors duration-700 ${
        dark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Hero image — full width */}
      <div className="w-full aspect-16/7 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Project header */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 mt-12 md:mt-16">
        <p
          className={`text-xs font-light tracking-[0.3em] uppercase ${
            dark ? "text-white/40" : "text-black/40"
          } mb-3`}
        >
          {project.category}
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight leading-tight">
          {project.title}
        </h1>
        <p
          className={`mt-6 text-base md:text-lg font-light leading-relaxed max-w-2xl ${
            dark ? "text-white/60" : "text-black/60"
          }`}
        >
          {project.description}
        </p>
      </div>

      {/* Project details grid */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 mt-12">
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 gap-8 py-8 border-t border-b ${
            dark ? "border-white/10" : "border-black/10"
          }`}
        >
          <div>
            <p
              className={`text-[10px] font-light tracking-[0.25em] uppercase ${
                dark ? "text-white/35" : "text-black/35"
              } mb-1`}
            >
              Year
            </p>
            <p className="text-sm font-light">{project.year}</p>
          </div>
          <div>
            <p
              className={`text-[10px] font-light tracking-[0.25em] uppercase ${
                dark ? "text-white/35" : "text-black/35"
              } mb-1`}
            >
              Location
            </p>
            <p className="text-sm font-light">{project.location}</p>
          </div>
          <div>
            <p
              className={`text-[10px] font-light tracking-[0.25em] uppercase ${
                dark ? "text-white/35" : "text-black/35"
              } mb-1`}
            >
              Area
            </p>
            <p className="text-sm font-light">{project.area}</p>
          </div>
          <div>
            <p
              className={`text-[10px] font-light tracking-[0.25em] uppercase ${
                dark ? "text-white/35" : "text-black/35"
              } mb-1`}
            >
              Client
            </p>
            <p className="text-sm font-light">{project.client}</p>
          </div>
        </div>
      </div>

      {/* Full description */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 mt-12">
        <p
          className={`text-sm md:text-base font-light leading-[1.8] max-w-3xl ${
            dark ? "text-white/70" : "text-black/70"
          }`}
        >
          {project.fullDescription}
        </p>
      </div>

      {/* Gallery — asymmetric staggered pairs */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 mt-16">
        <div className="flex flex-col gap-10 md:gap-16">
          {/* Pair images into rows of 2 */}
          {Array.from(
            { length: Math.ceil(project.gallery.length / 2) },
            (_, rowIdx) => {
              const left = project.gallery[rowIdx * 2];
              const right = project.gallery[rowIdx * 2 + 1];
              const isEven = rowIdx % 2 === 0;

              return (
                <div
                  key={rowIdx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start"
                >
                  {/* Left image */}
                  {left && (
                    <div
                      className={`overflow-hidden ${
                        isEven ? "md:col-span-7" : "md:col-span-5 md:mt-12"
                      }`}
                    >
                      <img
                        src={left}
                        alt={`${project.title} — ${rowIdx * 2 + 1}`}
                        loading="lazy"
                        className={`w-full object-cover ${
                          isEven ? "aspect-4/3" : "aspect-3/4"
                        }`}
                      />
                    </div>
                  )}

                  {/* Right image */}
                  {right && (
                    <div
                      className={`overflow-hidden ${
                        isEven ? "md:col-span-5 md:mt-16" : "md:col-span-7"
                      }`}
                    >
                      <img
                        src={right}
                        alt={`${project.title} — ${rowIdx * 2 + 2}`}
                        loading="lazy"
                        className={`w-full object-cover ${
                          isEven ? "aspect-3/4" : "aspect-4/3"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 mt-20 border-t border-gray-200 pt-6">
        <div className="flex flex-col justify-center items-center gap-4 mt-6">
          <p className="uppercase text-xs font-light tracking-[0.2em] text-gray-400">End of Record</p>
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className={`gap-2 px-8 py-3 text-xs font-light tracking-[0.2em] transition-all items-center ${
            dark 
              ? "text-white border-white/20 hover:border-white hover:bg-transparent hover:text-white" 
              : "text-black border-black/20 hover:border-black hover:bg-black hover:text-white"
          }`}
        >
          <span className="text-center">←</span>
          Back to Work
        </Button>
        </div>
      </div>
    </main>
  );
}
