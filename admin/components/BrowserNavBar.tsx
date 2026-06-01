import { createElement, FormEvent, RefObject } from "react";
import type { ViewScale } from "./PreviewFrame";

interface BrowserNavBarProps {
  containerRef: RefObject<HTMLDivElement | null>;
  url: string;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
  onReload: () => void;
  onHome: () => void;
  viewScale: ViewScale;
  onCycleViewScale: () => void;
}

const DECAP_PRIMARY_COLOR = "#3a69c7";
const DECAP_BORDER_COLOR = "#dfdfe3";
const DECAP_BORDER = `2px solid ${DECAP_BORDER_COLOR}`;
const DECAP_FIELD_BORDER_RADIUS = "5px";
const DECAP_FIELD_PADDING = "16px 20px";
const DECAP_FONT_SIZE = "15px";

const buttonStyle: React.CSSProperties = {
  color: DECAP_PRIMARY_COLOR,
  background: `${DECAP_PRIMARY_COLOR}20`,
  borderRadius: DECAP_FIELD_BORDER_RADIUS,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  aspectRatio: "1",
  padding: "10px",
  containerType: "size",
  border: "none",
};

export const BrowserNavBar = ({
  containerRef,
  url,
  onUrlChange,
  onSubmit,
  onReload,
  onHome,
  viewScale,
  onCycleViewScale,
}: BrowserNavBarProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "14px",
        borderBottom: DECAP_BORDER,
        fontFamily: "monospace",
        flexShrink: 0,
      }}
    >
      <button onClick={onHome} title="Home" style={buttonStyle}>
        <span style={{ fontSize: "100cqmin" }}>🏠</span>
      </button>
      <button onClick={onReload} title="Reload" style={buttonStyle}>
        <span style={{ fontSize: "100cqmin" }}>🔄</span>
      </button>
      <form onSubmit={handleSubmit} style={{ flex: 1, display: "flex" }}>
        <input
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          style={{
            flex: 1,
            fontFamily: "monospace",
            fontSize: DECAP_FONT_SIZE,
            padding: DECAP_FIELD_PADDING,
            border: DECAP_BORDER,
            borderRadius: DECAP_FIELD_BORDER_RADIUS,
            outline: "2px dashed var(--highlight-color)",
            outlineOffset: -4,
          }}
        />
      </form>
      <button
        onClick={onCycleViewScale}
        title={
          viewScale === "desktop"
            ? "Switch to mobile (375px)"
            : viewScale === "mobile"
            ? "Switch to native"
            : "Switch to desktop (1920px)"
        }
        style={buttonStyle}
      >
        <span style={{ fontSize: "100cqmin" }}>
          {viewScale === "desktop" ? "🖥" : viewScale === "mobile" ? "📱" : "📐"}
        </span>
      </button>
    </div>
  );
};
