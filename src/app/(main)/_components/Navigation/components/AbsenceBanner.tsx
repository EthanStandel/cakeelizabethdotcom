"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { e } from "easy-tailwind";
import cx from "classnames";

// Temporary, hard-coded announcement. Remove once it's no longer needed.
const message =
  "Due to the death of my beloved grandmother, I will be absent for most of this week to grieve and attend her funeral.  For those of you with orders for this week, I will be reaching out to work out timing of pickups and deliveries with you.  I apologize for any inconveniences and thank you for your patience.";

const centeredDuration = 4000;
const dockDuration = 700;

type Phase = "centered" | "docking" | "docked";

const bannerTextClassName = e("text-text text-sm text-center leading-relaxed", {
  desktop: "text-base",
});

/**
 * Starts as a card fixed in the center of the screen, then glides into a
 * sticky strip directly below the navigation bar.
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

  const transition = `all ${duration}ms ease-in-out`;
  const cardStyle: CSSProperties =
    phase === "centered"
      ? {
          top: "50%",
          left: "50%",
          width: "calc(100% - 2rem)",
          maxWidth: "36rem",
          transform: "translate(-50%, -50%)",
          padding: "2rem 1.5rem",
          borderRadius: "24px",
          transition,
        }
      : {
          top: dockTop,
          left: 0,
          width: "100%",
          maxWidth: "100%",
          transform: "translate(0, 0)",
          padding: "0.75rem 1rem",
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
        <div className={cx("min-h-0", phase !== "docked" && "overflow-hidden")}>
          <div
            role="region"
            aria-label="Announcement"
            className={cx(
              "bg-white shadow-sm-even shadow-black/20 py-3 px-4",
              phase !== "docked" && "opacity-0"
            )}
          >
            <p className={bannerTextClassName}>{message}</p>
          </div>
        </div>
      </div>
      {mounted &&
        phase !== "docked" &&
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
              className="fixed bg-white shadow-even shadow-black/20"
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
