import { createElement, useState, useEffect, useRef } from "react";

interface ImmutableMap {
  toJS(): Record<string, unknown>;
}

export interface PreviewProps {
  entry: {
    get(key: "slug"): string;
    get(key: "data"): ImmutableMap | undefined;
    get(key: string): unknown;
  };
}

interface CmsPreviewMessage {
  type: "cms-preview-update";
  slug: string;
  data: Record<string, unknown>;
}

export const buildIframePreviewComponent = ({
  previewPath,
}: {
  previewPath: (slug: string) => string;
}) => {
  const IframePreview = ({ entry }: PreviewProps) => {
    const slug = entry.get("slug");
    const base = import.meta.env.VITE_SERVER_URL ?? "";
    const wrapperRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [height, setHeight] = useState("100vh");

    useEffect(() => {
      const parent = wrapperRef.current?.parentElement;
      if (!parent) return;
      const observer = new ResizeObserver(() =>
        setHeight(`${parent.clientHeight}px`)
      );
      observer.observe(parent);
      setHeight(`${parent.clientHeight}px`);
      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      const iframe = iframeRef.current;
      if (!iframe || !slug) return;
      const data = entry.get("data")?.toJS() ?? {};
      const message: CmsPreviewMessage = {
        type: "cms-preview-update",
        slug,
        data,
      };
      const send = () => iframe.contentWindow?.postMessage(message, "*");
      iframe.addEventListener("load", send);
      send();
      return () => iframe.removeEventListener("load", send);
    }, [entry, slug]);

    if (!slug) return null;
    return (
      <div ref={wrapperRef} style={{ height: "100%" }}>
        <style>{`body { margin: 0; }`}</style>
        <iframe
          ref={iframeRef}
          src={`${base}${previewPath(slug)}`}
          style={{ width: "100%", height, border: "none", display: "block" }}
        />
      </div>
    );
  };
  return IframePreview;
};
