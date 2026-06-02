import { useCallback, useEffect, useRef } from "react";
import { BrowserNavBar } from "./components/BrowserNavBar";
import { PreviewFrame, PreviewFrameHandle } from "./components/PreviewFrame";
import type { CmsEntry, ViewScale } from "./components/PreviewFrame";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { useNavigationHistory } from "./hooks/useNavigationHistory";
import { useMessageHandler } from "./hooks/useMessageHandler";
import { localStorageKeys } from "./localStorageKeys";

export interface PreviewProps {
  entry: CmsEntry;
}

export const buildIframePreviewComponent = ({
  previewPath,
}: {
  previewPath: ((slug: string) => string) | null;
}) => {
  const IframePreview = ({ entry }: PreviewProps) => {
    const slug = entry.get("slug");
    const base = import.meta.env.VITE_SERVER_URL ?? "";
    const headerRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<PreviewFrameHandle>(null);
    const isFirstRender = useRef(true);
    const [viewScale, setViewScale] = useLocalStorageState<ViewScale>(
      localStorageKeys.viewScale,
      "native"
    );
    const [isFieldDocumentTransition] = useLocalStorageState(
      localStorageKeys.fieldDocumentTransition,
      false
    );
    const cycleViewScale = useCallback(
      () =>
        setViewScale((s) =>
          s === "native" ? "desktop" : s === "desktop" ? "mobile" : "native"
        ),
      []
    );

    const [urlInput, setUrlInput] = useLocalStorageState<string>(
      localStorageKeys.cmsPreview,
      slug && previewPath ? previewPath(slug) : "",
      { initializeToDefault: () => previewPath !== null && !isFieldDocumentTransition }
    );

    const nav = useNavigationHistory(urlInput);

    const navigate = useCallback((path: string) => {
      setUrlInput(path);
      previewRef.current?.navigateTo(`${base}${path}`);
    }, [base]);

    useMessageHandler({
      "cms-route-change": ({ path, source }) => {
        setUrlInput(path);
        if (source === "push") nav.push(path);
        else if (source === "replace") nav.replace(path);
        // "pop" = native browser history navigation; just update the display
      },
    });

    const handlePathChange = (path: string) => {
      setUrlInput(path);
      nav.push(path);
    };

    // When the slug changes after the initial mount (user switches entries in
    // the same collection), reset the preview to that entry's default path.
    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      if (slug && previewPath) {
        const defaultPath = previewPath(slug);
        nav.reset(defaultPath);
        setUrlInput(defaultPath);
      }
    }, [slug]);

    if (!slug) return null;
    return (
      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr",
          height: "100dvh",
          overflow: "hidden",
        }}
      >
        <style>{`body { margin: 0; }`}</style>
        <BrowserNavBar
          containerRef={headerRef}
          url={urlInput}
          onUrlChange={setUrlInput}
          onSubmit={() => previewRef.current?.navigateTo(`${base}${urlInput}`)}
          onReload={() => previewRef.current?.reload()}
          onHome={() =>
            previewRef.current?.navigateTo(`${base}${previewPath ? previewPath(slug) : "/"}`)
          }
          onBack={() => nav.back(navigate)}
          onForward={() => nav.forward(navigate)}
          canGoBack={nav.canGoBack}
          canGoForward={nav.canGoForward}
          viewScale={viewScale}
          onCycleViewScale={cycleViewScale}
        />
        <PreviewFrame
          ref={previewRef}
          src={`${base}${urlInput}`}
          entry={entry}
          slug={slug}
          onPathChange={handlePathChange}
          viewScale={viewScale}
        />
      </div>
    );
  };
  return IframePreview;
};
