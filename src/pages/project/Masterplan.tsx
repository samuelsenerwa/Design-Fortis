import ResponsiveImage from "../../components/ui/ResponsiveImage";
import type { Project } from "../../data/projects";
import { Pins, SwipeTip } from "./parts";

/** One wide picture with pins. On touch screens it scrolls sideways instead of cropping. */
export default function Masterplan({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (index: number) => void;
}) {
  const { masterplan } = project.study;
  if (!masterplan) return null;
  return (
    <>
      <div data-scroll-trigger="refresh" className="trigger-refresh" />
      <section data-snap="" data-bg="color" className="section clip theme_on-color">
        <div className="container">
          <div data-mob="off" data-parallax="w" className="master-w master-sb">
            <div data-parallax-img-out="" data-parallax-img-in="" className="master-w_bg">
              <SwipeTip />
              <Pins spots={masterplan.hotspots} />
              <div className="img-w _w-auto">
                <ResponsiveImage
                  name={masterplan.image}
                  alt={project.title}
                  role="hero"
                  sizes="(max-width: 991px) 200vw, 100vw"
                  className="img _w-auto"
                  onClick={() => onOpen(index)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
