import { createElement, useState, useCallback, useEffect, useRef } from "react";
import { BrowserNavBar } from "./components/BrowserNavBar";
import { PreviewFrame, PreviewFrameHandle } from "./components/PreviewFrame";
import type { CmsEntry, ViewScale } from "./components/PreviewFrame";
import { useLocalStorageState } from "./hooks/useLocalStorageState";

export interface PreviewProps {
  entry: CmsEntry;
}

export const buildIframePreviewComponent = ({
  previewPath,
}: {
  previewPath: (slug: string) => string;
}) => {
  const IframePreview = ({ entry }: PreviewProps) => {
    const slug = entry.get("slug");
    const base = import.meta.env.VITE_SERVER_URL ?? "";
    const headerRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<PreviewFrameHandle>(null);
    const [urlInput, setUrlInput] = useState(slug ? previewPath(slug) : "");
    const [viewScale, setViewScale] = useLocalStorageState<ViewScale>("cms-view-scale", "native");
    const cycleViewScale = useCallback(
      () => setViewScale((s) => s === "native" ? "desktop" : s === "desktop" ? "mobile" : "native"),
      []
    );

    useEffect(() => {
      if (slug) setUrlInput(previewPath(slug));
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
          onHome={() => previewRef.current?.navigateTo(`${base}${previewPath(slug)}`)}
          viewScale={viewScale}
          onCycleViewScale={cycleViewScale}
        />
        <PreviewFrame
          ref={previewRef}
          src={`${base}${previewPath(slug)}`}
          entry={entry}
          slug={slug}
          onPathChange={setUrlInput}
          viewScale={viewScale}
        />
      </div>
    );
  };
  return IframePreview;
};
