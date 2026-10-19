import { useRef } from "react";
import { Link } from "react-router-dom";
import LiquidDistortion from "../motion/LazyLiquidDistortion";
import { useSplitTextReveal } from "../../hooks/useSplitTextReveal";
import { useScrollReveal } from "../../hooks/useScrollReveal";

interface HomeAboutProps {
  dark: boolean;
}

export default function HomeAbout({ dark }: HomeAboutProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useSplitTextReveal(headingRef, { type: "words", immediate: false });
  useScrollReveal(bodyRef, { delayIndex: 1, staggerStep: 0.15 });

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden max-w-480 mx-auto px-6 md:px-12 py-24 md:py-36 transition-colors duration-700 ${
        dark ? "bg-black" : "bg-white"
      }`}
    >
      <LiquidDistortion dark={dark} />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-4">
          <h4
            className={`text-xs font-bold uppercase tracking-[0.2em] mb-6 ${
              dark ? "text-white/50" : "text-black/50"
            }`}
          >
            About
          </h4>
          <h2
            ref={headingRef}
            className={`text-3xl md:text-4xl lg:text-5xl font-extralight leading-[1.15] ${
              dark ? "text-white" : "text-black"
            }`}
          >
            We believe architecture is the art of shaping human experience.
          </h2>
        </div>

        <div className="lg:col-span-7 lg:col-start-6 flex flex-col justify-end gap-8">
          <p
            ref={bodyRef}
            className={`text-base md:text-lg font-light leading-relaxed max-w-2xl ${
              dark ? "text-white/70" : "text-black/70"
            }`}
          >
            Design Fortis is a full-service architectural design and build firm — delivering
            end-to-end solutions from initial concept through to constructed reality. We are your
            single point of accountability from concept to completion, integrating design thinking
            with construction intelligence from day one.
          </p>
          <Link
            to="/about"
            data-cursor="hover"
            className={`inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] w-fit border-b pb-1 transition-colors ${
              dark
                ? "text-white border-white/30 hover:border-white"
                : "text-black border-black/30 hover:border-black"
            }`}
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
}
