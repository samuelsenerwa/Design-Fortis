import { useEffect, useRef } from "react";
import Footer from "../components/layout/Footer";
import LiquidDistortion from "../components/motion/LazyLiquidDistortion";
import { useSplitTextReveal } from "../hooks/useSplitTextReveal";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface AboutProps {
  dark: boolean;
}

export default function About({ dark }: AboutProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const whatWeDoRef = useRef<HTMLDivElement>(null);
  const approachRef = useRef<HTMLDivElement>(null);
  const precisionRef = useRef<HTMLDivElement>(null);
  const collaborationRef = useRef<HTMLDivElement>(null);
  const innovationRef = useRef<HTMLDivElement>(null);

  useSplitTextReveal(headingRef, { type: "words" });
  useScrollReveal(introRef, { delayIndex: 1, staggerStep: 0.15 });
  useScrollReveal(philosophyRef);
  useScrollReveal(whatWeDoRef, { delayIndex: 1, staggerStep: 0.15 });
  useScrollReveal(approachRef);
  useScrollReveal(precisionRef, { delayIndex: 0 });
  useScrollReveal(collaborationRef, { delayIndex: 1 });
  useScrollReveal(innovationRef, { delayIndex: 2 });

  // Scroll to top on mount (consistent with other pages).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main
      className={`min-h-screen pt-20 pb-6 transition-colors duration-700 ${
        dark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-12 md:mt-16">
        {/* Header Section */}
        <div className="max-w-4xl mb-20">
          <h1
            ref={headingRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight leading-tight mb-8"
          >
            About Us
          </h1>
          <p
            ref={introRef}
            className={`text-lg md:text-xl font-light leading-relaxed ${
              dark ? "text-white/80" : "text-black/80"
            }`}
          >
            Design Fortis is a full-service architectural design and build firm — delivering end-to-end
            solutions from initial concept through to constructed reality.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24 py-8">
          <LiquidDistortion dark={dark} />

          {/* Left Column - Philosophy */}
          <div ref={philosophyRef} className="relative space-y-8">
            <div>
              <h2
                className={`text-xs uppercase tracking-widest mb-4 ${
                  dark ? "text-white/50" : "text-black/50"
                }`}
              >
                OUR PHILOSOPHY
              </h2>
              <p
                className={`text-base md:text-lg font-light leading-relaxed ${
                  dark ? "text-white/70" : "text-black/70"
                }`}
              >
                We believe architecture is the art of shaping human experience. Every structure we
                design carries a responsibility — to the people who inhabit it, the landscape it
                occupies, and the legacy it leaves behind. Our work moves beyond drawings and
                renders; it stands in the real world, built with precision and purpose. Every project
                begins with listening. We immerse ourselves in your vision, your context, and your
                ambition — then engineer a built solution that exceeds what you imagined possible.
              </p>
            </div>
          </div>

          {/* Right Column - What We Do */}
          <div ref={whatWeDoRef} className="relative space-y-8">
            <div>
              <h2
                className={`text-xs uppercase tracking-widest mb-4 ${
                  dark ? "text-white/50" : "text-black/50"
                }`}
              >
                WHAT WE DO
              </h2>
              <p
                className={`text-base md:text-lg font-light leading-relaxed ${
                  dark ? "text-white/70" : "text-black/70"
                }`}
              >
                We are your single point of accountability from concept to completion. Our integrated
                team of architects, designers, and builders ensures seamless delivery at every
                stage.
              </p>
            </div>

            <div className="space-y-4">
              <div
                className={`pb-3 border-b ${
                  dark ? "border-white/10" : "border-black/10"
                }`}
              >
                <h3 className={`text-sm font-normal ${dark ? "text-white" : "text-black"}`}>
                  Architectural Design
                </h3>
              </div>
              <div
                className={`pb-3 border-b ${
                  dark ? "border-white/10" : "border-black/10"
                }`}
              >
                <h3 className={`text-sm font-normal ${dark ? "text-white" : "text-black"}`}>
                  Interior Design & Space Planning
                </h3>
              </div>
              <div
                className={`pb-3 border-b ${
                  dark ? "border-white/10" : "border-black/10"
                }`}
              >
                <h3 className={`text-sm font-normal ${dark ? "text-white" : "text-black"}`}>
                  Landscape & Site Design
                </h3>
              </div>
              <div
                className={`pb-3 border-b ${
                  dark ? "border-white/10" : "border-black/10"
                }`}
              >
                <h3 className={`text-sm font-normal ${dark ? "text-white" : "text-black"}`}>
                  Construction & Project Management
                </h3>
              </div>
              <div
                className={`pb-3 border-b ${
                  dark ? "border-white/10" : "border-black/10"
                }`}
              >
                <h3 className={`text-sm font-normal ${dark ? "text-white" : "text-black"}`}>
                  3D Visualization & Concept Development
                </h3>
              </div>
              <div
                className={`pb-3 border-b ${
                  dark ? "border-white/10" : "border-black/10"
                }`}
              >
                <h3 className={`text-sm font-normal ${dark ? "text-white" : "text-black"}`}>
                  Design Consultation & Feasibility Studies
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Approach Section */}
        <div ref={approachRef} className="max-w-4xl mb-24">
          <h2
            className={`text-xs uppercase tracking-widest mb-6 ${
              dark ? "text-white/50" : "text-black/50"
            }`}
          >
            OUR APPROACH
          </h2>
          <div className="space-y-6">
            <p
              className={`text-base md:text-lg font-light leading-relaxed ${
                dark ? "text-white/70" : "text-black/70"
              }`}
            >
             We start where most firms stop — at the intersection of bold design and buildable reality. Through close collaboration with our clients,
             we develop architectural solutions that are not only visually compelling but structurally sound and practically deliverable.
             Our process integrates design thinking with construction intelligence from day one,
             eliminating the costly gaps that arise when design and build teams work in silos.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          <div ref={precisionRef}>
            <h3
              className={`text-xs uppercase tracking-widest mb-4 ${
                dark ? "text-white/50" : "text-black/50"
              }`}
            >
              PRECISION
            </h3>
            <p
              className={`text-sm md:text-base font-light leading-relaxed ${
                dark ? "text-white/70" : "text-black/70"
              }`}
            >
               Every detail is engineered with intent. We hold ourselves to the highest standards of technical accuracy and craftsmanship,
               ensuring what is designed is what gets built — beautifully.
            </p>
          </div>

          <div ref={collaborationRef}>
            <h3
              className={`text-xs uppercase tracking-widest mb-4 ${
                dark ? "text-white/50" : "text-black/50"
              }`}
            >
              COLLABORATION
            </h3>
            <p
              className={`text-sm md:text-base font-light leading-relaxed ${
                dark ? "text-white/70" : "text-black/70"
              }`}
            >
              You are part of the team. We keep you informed, involved, and in control at every milestone, from first sketch to final handover.
            </p>
          </div>

          <div ref={innovationRef}>
            <h3
              className={`text-xs uppercase tracking-widest mb-4 ${
                dark ? "text-white/50" : "text-black/50"
              }`}
            >
              INNOVATION
            </h3>
            <p
              className={`text-sm md:text-base font-light leading-relaxed ${
                dark ? "text-white/70" : "text-black/70"
              }`}
            >
             We bring the latest in design technology, materials, and construction methodology to every project — delivering results that are not just current, but enduring.
            </p>
          </div>
        </div>

        {/* Contact CTA */}
       <Footer dark={dark} />
      </div>
    </main>
  );
}
