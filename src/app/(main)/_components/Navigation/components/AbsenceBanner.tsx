"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { e } from "easy-tailwind";
import cx from "classnames";
import CloseIcon from "../GrClose.svg";

// Temporary, hard-coded announcement. Remove once it's no longer needed.
const message =
  "Due to the death of my beloved grandmother, I will be absent for most of this week to grieve and attend her funeral.  For those of you with orders for this week, I will be reaching out to work out timing of pickups and deliveries with you.  I apologize for any inconveniences and thank you for your patience.";

const centeredDuration = 4000;
const dockDuration = 700;
const closeDuration = 250;

type Phase = "centered" | "docking" | "docked" | "closing" | "closed";

// Shared by the floating card and the strip so the hand-off between them is seamless
const dockedPaddingClassName = e("py-3 pl-4 pr-9", { desktop: "px-10" });

const bannerTextClassName = e("text-text text-sm text-center leading-relaxed", {
  desktop: "text-base",
});

/**
 * Starts as a card fixed in the center of the screen, then glides into a
 * sticky strip directly below the navigation bar, where it can be closed.
 */
export const AbsenceBanner = () => {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("centered");
  const [dockTop, setDockTop] = useState(0);
  const [duration, setDuration] = useState(dockDuration);
  const slotRef = useRef<HTMLDivElement>(null);

  const dock = () => {
    if (phase !== "centered") return;
    setDockTop(slotRef.current?.getBoundingClientRect().top ?? 0);
    setPhase("docking");
  };

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDuration(0);
    }
  }, []);

  useEffect(() => {
    if (!mounted || phase !== "centered") return;
    const timeout = setTimeout(dock, centeredDuration);
    return () => clearTimeout(timeout);
  }, [mounted, phase]);

  useEffect(() => {
    if (phase !== "docking") return;
    const timeout = setTimeout(() => setPhase("docked"), duration);
    return () => clearTimeout(timeout);
  }, [phase, duration]);

  useEffect(() => {
    if (phase !== "closing") return;
    const timeout = setTimeout(() => setPhase("closed"), closeDuration);
    return () => clearTimeout(timeout);
  }, [phase]);

  if (phase === "closed") return null;

  const floating = phase === "centered" || phase === "docking";

  const transition = `all ${duration}ms ease-in-out`;
  const cardStyle: CSSProperties =
    phase === "centered"
      ? {
          top: "50%",
          left: "50%",
          width: "calc(100% - 2rem)",
          maxWidth: "36rem",
          transform: "translate(-50%, -50%)",
          borderRadius: "24px",
          transition,
        }
      : {
          top: dockTop,
          left: 0,
          width: "100%",
          maxWidth: "100%",
          transform: "translate(0, 0)",
          borderRadius: 0,
          transition,
        };

  return (
    <>
      <div
        ref={slotRef}
        className="grid"
        style={{
          gridTemplateRows: phase === "centered" ? "0fr" : "1fr",
          transition: `grid-template-rows ${duration}ms ease-in-out`,
        }}
      >
        <div className={cx("min-h-0", floating && "overflow-hidden")}>
          <div
            role="region"
            aria-label="Announcement"
            className={cx(
              "relative bg-white shadow-sm-even shadow-black/20",
              dockedPaddingClassName,
              floating && "opacity-0",
              phase === "closing" && "opacity-0 transition-opacity"
            )}
          >
            <p className={bannerTextClassName}>{message}</p>
            {!floating && (
              <button
                aria-label="Close announcement"
                onClick={() => setPhase("closing")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      {mounted &&
        floating &&
        createPortal(
          <div aria-hidden onClick={dock} className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black"
              style={{
                opacity: phase === "centered" ? 0.4 : 0,
                transition: `opacity ${duration}ms ease-in-out`,
              }}
            />
            <div
              className={cx(
                "fixed bg-white shadow-even shadow-black/20",
                phase === "centered" ? "py-8 px-6" : dockedPaddingClassName
              )}
              style={cardStyle}
            >
              <p className={bannerTextClassName}>{message}</p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
