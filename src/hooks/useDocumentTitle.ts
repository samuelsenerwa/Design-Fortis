import { useEffect } from "react";

const SUFFIX = "Design Fortis";

/** Sets the tab title for the current page, e.g. "Projects — Design Fortis". */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} — ${SUFFIX}`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
