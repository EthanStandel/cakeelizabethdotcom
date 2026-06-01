import {
  useMemo,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Ruler } from "./Rulers";

interface ImmutableMap {
  toJS(): Record<string, unknown>;
}

export interface CmsEntry {
  get(key: "slug"): string;
  get(key: "data"): ImmutableMap | undefined;
  get(key: string): unknown;
}

interface CmsPreviewMessage {
  type: "cms-preview-update";
  slug: string;
  data: Record<string, unknown>;
}

export interface PreviewFrameHandle {
  back(): void;
  forward(): void;
  reload(): void;
  navigateTo(src: string): void;
}

export type ViewScale = "desktop" | "mobile" | "native";

const VIEW_SCALE_WIDTHS: Record<Exclude<ViewScale, "native">, number> = {
  desktop: 1920,
  mobile: 375,
};

interface PreviewFrameProps {
  src: string;
  entry: CmsEntry;
  slug: string;
  onPathChange: (path: string) => void;
  viewScale: ViewScale;
}

// --- PreviewFrame ---

export const PreviewFrame = forwardRef<PreviewFrameHandle, PreviewFrameProps>(
  ({ src, entry, slug, onPathChange, viewScale }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const outerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
      const el = outerRef.current;
      if (!el) return;
      const update = (width: number, height: number) => {
        const w = Math.max(0, width - Ruler.SIZE);
        const h = Math.max(0, height - Ruler.SIZE);
        setContainerSize((prev) =>
          prev.width === w && prev.height === h ? prev : { width: w, height: h }
        );
      };
      const onResize = () => update(el.offsetWidth, el.offsetHeight);
      const ro = new ResizeObserver(([e]) => {
        const { width, height } = e.contentRect;
        update(width, height);
      });
      ro.observe(el);
      window.addEventListener("resize", onResize);
      return () => {
        ro.disconnect();
        window.removeEventListener("resize", onResize);
      };
    }, []);

    useImperativeHandle(ref, () => ({
      back: () => iframeRef.current?.contentWindow?.history.back(),
      forward: () => iframeRef.current?.contentWindow?.history.forward(),
      reload: () => iframeRef.current?.contentWindow?.location.reload(),
      navigateTo: (newSrc) => {
        if (iframeRef.current) iframeRef.current.src = newSrc;
      },
    }));

    useEffect(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const onLoad = () => {
        try {
          onPathChange(iframe.contentWindow?.location.pathname ?? "");
        } catch {
          // cross-origin guard
        }
      };
      iframe.addEventListener("load", onLoad);
      return () => iframe.removeEventListener("load", onLoad);
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

    const { scaledWidth, scale, effectiveWidth, effectiveHeight } =
      useMemo(() => {
        const scaledWidth =
          viewScale !== "native" ? VIEW_SCALE_WIDTHS[viewScale] : null;
        const scale =
          scaledWidth != null ? containerSize.width / scaledWidth : 1;
        return {
          scaledWidth,
          scale,
          effectiveWidth: scaledWidth ?? containerSize.width,
          effectiveHeight: containerSize.height / scale,
        };
      }, [viewScale, containerSize]);

    return (
      <div
        ref={outerRef}
        style={{
          display: "grid",
          gridTemplateRows: `${Ruler.SIZE}px 1fr`,
          gridTemplateColumns: `${Ruler.SIZE}px 1fr`,
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: Ruler.BG,
            borderRight: `1px solid ${Ruler.BORDER_COLOR}`,
            borderBottom: `1px solid ${Ruler.BORDER_COLOR}`,
          }}
        />
        <Ruler.Horizontal
          effectiveWidth={effectiveWidth}
          containerWidth={containerSize.width}
        />
        <Ruler.Vertical
          effectiveHeight={effectiveHeight}
          containerHeight={containerSize.height}
        />
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          <iframe
            ref={iframeRef}
            src={src}
            style={
              scaledWidth != null
                ? {
                    width: `${scaledWidth}px`,
                    height: `${containerSize.height / scale}px`,
                    border: "none",
                    display: "block",
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }
                : {
                    width: "100%",
                    height: "100%",
                    border: "none",
                    display: "block",
                  }
            }
          />
        </div>
      </div>
    );
  }
);
