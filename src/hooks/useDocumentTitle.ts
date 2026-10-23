import { useEffect } from "react";

const SUFFIX = "Arsvel";

/** Sets the tab title for the current page, e.g. "Projects — Arsvel". */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} — ${SUFFIX}`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
