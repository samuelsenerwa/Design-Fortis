import ResponsiveImage from "../../components/ui/ResponsiveImage";
import type { Project } from "../../data/projects";
import { Pins, SwipeTip } from "./parts";

/** Aerial of the site with the title laid over it; on touch screens the title moves above. */
export default function Site({ project }: { project: Project }) {
  const site = project.study.site;
  if (!site) return null;
  const title = (
    <div className="grid">
      <div className="img-map-s_title">
        <h2 data-scroll-reveal="h" className="h1 text-dark text-balance">
          {site.title}
        </h2>
        <div className="u-24" />
      </div>
    </div>
  );
  return (
    <section data-mob="off" data-bg="color" data-parallax="w" className="section clip">
      <div className="container">
        <div className="img-map-s f-mob">
          <div className="u-128" />
          {title}
          <div className="u-8" />
        </div>
        <div className="img-map-w master-sb theme_on-color">
          <div className="img-map-s f-desc">
            <div className="img-map-s_t">
              <div className="u-128" />
              {title}
            </div>
            <div className="img-map-s_b">
              <div className="grid" />
              <div className="u-16" />
            </div>
          </div>
          <div data-parallax="img" className="img-map-w_bg">
            <SwipeTip />
            <Pins spots={site.hotspots} />
            <div className="img-w _w-auto">
              <ResponsiveImage
                name={site.image}
                alt={site.title}
                role="hero"
                sizes="(max-width: 991px) 200vw, 100vw"
                className="img _w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
