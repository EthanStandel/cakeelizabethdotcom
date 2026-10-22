import { memo, useRef, useEffect } from "react";

const RULER_SIZE = 20;
const RULER_BG = "#f8f8f9";
const RULER_BORDER_COLOR = "#dfdfe3";
const RULER_TICK = "#c0c0c4";
const RULER_TEXT = "#aaa";

function niceInterval(raw: number): number {
  if (raw <= 0) return 1;
  const exp = Math.floor(Math.log10(raw));
  const pow = Math.pow(10, exp);
  const frac = raw / pow;
  if (frac < 1.5) return pow;
  if (frac < 3.5) return 2 * pow;
  if (frac < 7.5) return 5 * pow;
  return 10 * pow;
}

export const HRuler = memo(function HRuler({
  effectiveWidth,
  containerWidth,
}: {
  effectiveWidth: number;
  containerWidth: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      !canvas ||
      containerWidth <= 0 ||
      effectiveWidth <= 0 ||
      !isFinite(effectiveWidth)
    )
      return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(containerWidth * dpr);
    canvas.height = Math.round(RULER_SIZE * dpr);
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = RULER_BG;
    ctx.fillRect(0, 0, containerWidth, RULER_SIZE);
    ctx.strokeStyle = RULER_BORDER_COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, RULER_SIZE - 0.5);
    ctx.lineTo(containerWidth, RULER_SIZE - 0.5);
    ctx.stroke();

    const scale = containerWidth / effectiveWidth;
    const majorInterval = Math.max(1, Math.round(niceInterval(80 / scale)));
    const minorInterval = Math.max(1, Math.round(majorInterval / 5));

    ctx.strokeStyle = RULER_TICK;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let v = 0; v <= effectiveWidth; v += minorInterval) {
      const x = v * scale;
      const isMajor = v % majorInterval === 0;
      ctx.moveTo(x, RULER_SIZE);
      ctx.lineTo(x, isMajor ? RULER_SIZE * 0.2 : RULER_SIZE * 0.6);
    }
    ctx.stroke();

    ctx.fillStyle = RULER_TEXT;
    ctx.font = "9px monospace";
    ctx.textBaseline = "middle";
    for (let v = majorInterval; v <= effectiveWidth; v += majorInterval) {
      const x = v * scale;
      ctx.fillText(String(v), x + 2, RULER_SIZE * 0.4);
    }
  }, [effectiveWidth, containerWidth]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: `${containerWidth}px`,
        height: `${RULER_SIZE}px`,
        borderBottom: `1px solid ${RULER_BORDER_COLOR}`,
      }}
    />
  );
});

export const VRuler = memo(function VRuler({
  effectiveHeight,
  containerHeight,
}: {
  effectiveHeight: number;
  containerHeight: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      !canvas ||
      containerHeight <= 0 ||
      effectiveHeight <= 0 ||
      !isFinite(effectiveHeight)
    )
      return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(RULER_SIZE * dpr);
    canvas.height = Math.round(containerHeight * dpr);
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = RULER_BG;
    ctx.fillRect(0, 0, RULER_SIZE, containerHeight);
    ctx.strokeStyle = RULER_BORDER_COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(RULER_SIZE - 0.5, 0);
    ctx.lineTo(RULER_SIZE - 0.5, containerHeight);
    ctx.stroke();

    const scale = containerHeight / effectiveHeight;
    const majorInterval = Math.max(1, Math.round(niceInterval(80 / scale)));
    const minorInterval = Math.max(1, Math.round(majorInterval / 5));

    ctx.strokeStyle = RULER_TICK;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let v = 0; v <= effectiveHeight; v += minorInterval) {
      const y = v * scale;
      const isMajor = v % majorInterval === 0;
      ctx.moveTo(RULER_SIZE, y);
      ctx.lineTo(isMajor ? RULER_SIZE * 0.2 : RULER_SIZE * 0.6, y);
    }
    ctx.stroke();

    ctx.fillStyle = RULER_TEXT;
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    for (let v = majorInterval; v <= effectiveHeight; v += majorInterval) {
      const y = v * scale;
      if (y > 10) {
        ctx.save();
        ctx.translate(RULER_SIZE * 0.4, y - 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(String(v), 0, 0);
        ctx.restore();
      }
    }
  }, [effectiveHeight, containerHeight]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: `${RULER_SIZE}px`,
        height: `${containerHeight}px`,
        borderRight: `1px solid ${RULER_BORDER_COLOR}`,
      }}
    />
  );
});

export const Ruler = {
  SIZE: RULER_SIZE,
  BG: RULER_BG,
  BORDER_COLOR: RULER_BORDER_COLOR,
  Horizontal: HRuler,
  Vertical: VRuler,
};
