import { useMemo, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import GalleryModal from "../components/gallery/GalleryModal";
import { getLargestUrl } from "../lib/imageManifest";
import "../home/home.css";
import "../home/projects.css";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { getProjectBySlug, type Project as ProjectData } from "../data/projects";
import { CircleTip, SiteFooter, SiteHeader, SiteOverlays } from "../home/SiteChrome";
import { initProjectScripts } from "../home/project";
import { usePageRuntime } from "../home/usePageRuntime";
import Amenities from "./project/Amenities";
import { LearnMore, NextProject } from "./project/Closing";
import Hero from "./project/Hero";
import Inside from "./project/Inside";
import { planGallery } from "./project/gallery";
import Masterplan from "./project/Masterplan";
import Overview from "./project/Overview";
import { HotspotSheets, HotspotTips, ReelModal } from "./project/parts";
import Progress from "./project/Progress";
import Site from "./project/Site";

/** A project's case study. Unknown slugs fall back to the index. */
export default function Project() {
  const { slug } = useParams();
  const project = slug ? getProjectBySlug(slug) : undefined;
  if (!project) return <Navigate to="/projects" replace />;
  // Keyed so moving to the next project rebuilds the page and its scripts from scratch.
  return <ProjectView key={project.slug} project={project} />;
}

function ProjectView({ project }: { project: ProjectData }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  usePageRuntime(rootRef, pageRef, initProjectScripts);
  useDocumentTitle(project.title);

  const plan = useMemo(() => planGallery(project), [project]);
  const slides = useMemo(
    () => plan.slides.map((name) => ({ src: getLargestUrl(name, "webp"), alt: project.title })),
    [plan, project.title]
  );
  const [gallery, setGallery] = useState({ open: false, index: 0 });
  const openGallery = (index: number) => setGallery({ open: true, index });

  const { study } = project;
  const spots = [...(study.masterplan?.hotspots ?? []), ...(study.site?.hotspots ?? [])];

  return (
    <div ref={rootRef} className="lv transition-wrapper">
      <main ref={pageRef} className="transition-container">
        <SiteHeader theme="theme_on-color" current="/projects" />

        <div className="s-w">
          <Hero project={project} onOpen={() => openGallery(plan.hero)} />
          <Overview project={project} />
          <Amenities project={project} start={plan.amenities} onOpen={openGallery} />
          <Masterplan project={project} index={plan.masterplan} onOpen={openGallery} />
          <Inside project={project} starts={plan.chapters} onOpen={openGallery} />
          <Progress project={project} />
          <Site project={project} />
          <LearnMore />
          <NextProject project={project} />
          <SiteFooter current="/projects" />
        </div>
      </main>

      <SiteOverlays
        tips={
          <>
            <CircleTip name="gallery" label="View gallery" />
            <CircleTip name="prev" label="Prev" />
            <CircleTip name="next" label="Next" />
            <HotspotTips spots={spots} />
          </>
        }
      >
        <HotspotSheets spots={spots} />
        {study.reel && <ReelModal />}
      </SiteOverlays>

      <GalleryModal
        open={gallery.open}
        index={gallery.index}
        slides={slides}
        title={project.title}
        onClose={() => setGallery((g) => ({ ...g, open: false }))}
      />
    </div>
  );
}
