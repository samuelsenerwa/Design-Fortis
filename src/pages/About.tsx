interface AboutProps {
  dark: boolean;
}

export default function About({ dark }: AboutProps) {
  return (
    <main
      className={`min-h-screen pt-20 pb-24 transition-colors duration-700 ${
        dark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-12 md:mt-16">
        {/* Header Section */}
        <div className="max-w-4xl mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight leading-tight mb-8">
            About Us
          </h1>
          <p
            className={`text-lg md:text-xl font-light leading-relaxed ${
              dark ? "text-white/80" : "text-black/80"
            }`}
          >
            Design Fortis is an architectural and landscape visualization studio specializing in
            photorealistic renders, concept visuals, and spatial storytelling for design projects.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
          {/* Left Column - Philosophy */}
          <div className="space-y-8">
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
                We believe that architecture is more than just buildings—it's about creating
                experiences, emotions, and narratives. Our work bridges the gap between concept and
                reality, transforming architectural visions into compelling visual stories.
              </p>
            </div>

            <div>
              <p
                className={`text-base md:text-lg font-light leading-relaxed ${
                  dark ? "text-white/70" : "text-black/70"
                }`}
              >
                Every project is approached with meticulous attention to detail, combining technical
                precision with artistic sensibility. We don't just render spaces; we craft
                atmospheres that resonate with viewers and bring designs to life before they're
                built.
              </p>
            </div>
          </div>

          {/* Right Column - What We Do */}
          <div className="space-y-8">
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
                We specialize in creating high-quality architectural visualizations that help
                architects, developers, and designers communicate their vision effectively. From
                early concept sketches to final presentation renders, we provide comprehensive
                visualization services.
              </p>
            </div>

            <div className="space-y-4">
              <div
                className={`pb-3 border-b ${
                  dark ? "border-white/10" : "border-black/10"
                }`}
              >
                <h3 className={`text-sm font-normal ${dark ? "text-white" : "text-black"}`}>
                  Architectural Visualization
                </h3>
              </div>
              <div
                className={`pb-3 border-b ${
                  dark ? "border-white/10" : "border-black/10"
                }`}
              >
                <h3 className={`text-sm font-normal ${dark ? "text-white" : "text-black"}`}>
                  Interior Rendering
                </h3>
              </div>
              <div
                className={`pb-3 border-b ${
                  dark ? "border-white/10" : "border-black/10"
                }`}
              >
                <h3 className={`text-sm font-normal ${dark ? "text-white" : "text-black"}`}>
                  Landscape Design Visualization
                </h3>
              </div>
              <div
                className={`pb-3 border-b ${
                  dark ? "border-white/10" : "border-black/10"
                }`}
              >
                <h3 className={`text-sm font-normal ${dark ? "text-white" : "text-black"}`}>
                  Concept Development
                </h3>
              </div>
              <div
                className={`pb-3 border-b ${
                  dark ? "border-white/10" : "border-black/10"
                }`}
              >
                <h3 className={`text-sm font-normal ${dark ? "text-white" : "text-black"}`}>
                  3D Modeling & Animation
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Approach Section */}
        <div className="max-w-4xl mb-24">
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
              We start by understanding your project's unique context, goals, and audience. Through
              close collaboration, we develop a visual language that authentically represents your
              design intent while creating emotional connections with viewers.
            </p>
            <p
              className={`text-base md:text-lg font-light leading-relaxed ${
                dark ? "text-white/70" : "text-black/70"
              }`}
            >
              Our process combines cutting-edge technology with traditional artistic principles.
              We use industry-leading software and rendering engines, but always prioritize
              composition, lighting, and storytelling—the elements that make visualizations truly
              compelling.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          <div>
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
              Every detail matters. We ensure technical accuracy while maintaining artistic vision,
              delivering renders that are both beautiful and architecturally sound.
            </p>
          </div>

          <div>
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
              We work closely with our clients throughout the process, ensuring the final result
              exceeds expectations and truly represents their vision.
            </p>
          </div>

          <div>
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
              We stay at the forefront of visualization technology, constantly exploring new
              techniques and tools to deliver cutting-edge results.
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="max-w-4xl pt-12 border-t border-white/10">
          <h2
            className={`text-2xl md:text-3xl font-light mb-6 ${
              dark ? "text-white" : "text-black"
            }`}
          >
            Let's work together
          </h2>
          <p
            className={`text-base md:text-lg font-light leading-relaxed mb-8 ${
              dark ? "text-white/70" : "text-black/70"
            }`}
          >
            Whether you're an architect with a vision, a developer with a project, or a designer
            seeking to bring your concepts to life, we'd love to hear from you.
          </p>
          <a
            href="/contact"
            className={`inline-block px-8 py-3 border ${
              dark
                ? "border-white text-white hover:bg-white hover:text-black"
                : "border-black text-black hover:bg-black hover:text-white"
            } transition-all duration-300 text-xs tracking-widest uppercase`}
          >
            GET IN TOUCH
          </a>
        </div>
      </div>
    </main>
  );
}
