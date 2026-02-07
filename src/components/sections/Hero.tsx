import Hero3D from "./Hero3D";
import Button from "../ui/Button";

interface HeroProps {
  dark: boolean;
}

export default function Hero({ dark }: HeroProps) {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Soft dark gradient background — not flat black */}
      <div
        className="absolute inset-0 transition-[background] duration-700"
        style={{
          background: dark
            ? "radial-gradient(ellipse at 50% 40%, #1c1c1e 0%, #0e0e10 50%, #050506 100%)"
            : "radial-gradient(ellipse at 50% 40%, #fafaf9 0%, #f0efed 50%, #e6e5e3 100%)",
        }}
      />

      {/* Three.js canvas layer */}
      <Hero3D dark={dark} />

      {/* Vignette overlay — subtle edge darkening for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: dark
            ? "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.5) 100%)"
            : "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.08) 100%)",
          zIndex: 1,
        }}
      />

      {/* HTML text overlay — sits above canvas, pointer-events disabled */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pointer-events-none select-none">
        <p className="text-xs md:text-sm font-light tracking-[0.4em] uppercase text-foreground/40 mb-4">
          Creative Studio
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-foreground leading-[0.95]">
          Design
          <br />
          <span className="font-normal">Fortis</span>
        </h1>
        <p className="mt-6 max-w-md text-sm md:text-base font-light text-foreground/50 leading-relaxed">
          Crafting digital experiences with precision, elegance, and purpose.
        </p>
        <div className="mt-10 pointer-events-auto">
          <Button variant="outline" size="lg">
            View Work
          </Button>
        </div>
      </div>
    </section>
  );
}
