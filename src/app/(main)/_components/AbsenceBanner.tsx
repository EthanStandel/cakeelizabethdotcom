"use client";

import { useEffect, useState } from "react";
import { e } from "easy-tailwind";
import cx from "classnames";
import CloseIcon from "./Navigation/GrClose.svg";

// Temporary, hard-coded announcement. Remove once it's no longer needed.
const title = "Away This Week";
const message =
  "Due to the death of my beloved grandmother, I will be absent for most of this week to grieve and attend her funeral.  For those of you with orders for this week, I will be reaching out to work out timing of pickups and deliveries with you.  I apologize for any inconveniences and thank you for your patience.";

// Never shown from midnight at the end of Sunday, Nov 1 (Eastern) onward
const hideAt = new Date("2026-11-02T00:00:00-05:00").getTime();

const slideDuration = 300;

type Phase = "hidden" | "entering" | "docked" | "closing" | "closed";

/**
 * A strip stuck to the bottom of the screen (above the sticky footer on
 * desktop) that slides up on load and slides back down when closed. Renders only on the client so the expiry check
 * uses the visitor's clock rather than a pre-rendered page.
 */
export const AbsenceBanner = () => {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("hidden");
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (Date.now() >= hideAt) return;
    setMounted(true);
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    // Wait for the collapsed strip to paint so it can slide in
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setPhase("entering"));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const duration = reduceMotion ? 0 : slideDuration;

  useEffect(() => {
    const timeline: Partial<Record<Phase, Phase>> = {
      entering: "docked",
      closing: "closed",
    };
    const next = timeline[phase];
    if (!next) return;
    const timeout = setTimeout(() => setPhase(next), duration);
    return () => clearTimeout(timeout);
  }, [phase, duration]);

  if (!mounted || phase === "closed") return null;

  const open = phase === "entering" || phase === "docked";
  const easing = open
    ? "cubic-bezier(0, 0, 0.2, 1)"
    : "cubic-bezier(0.4, 0, 1, 1)";

  return (
    <div
      className={e("grid sticky bottom-0 z-[5]", { desktop: "bottom-8" })}
      style={{
        gridTemplateRows: open ? "1fr" : "0fr",
        transition: `grid-template-rows ${duration}ms ${easing}`,
      }}
    >
      <div className={cx("min-h-0", phase !== "docked" && "overflow-hidden")}>
        <div
          role="region"
          aria-label="Announcement"
          className={cx(
            "relative bg-white shadow-sm-even shadow-black/20",
            e("py-3 pl-4 pr-9", { desktop: "px-10" })
          )}
          style={{
            transform: open ? "translateY(0)" : "translateY(100%)",
            transition: `transform ${duration}ms ${easing}`,
          }}
        >
          <p
            className={e("text-text text-sm text-center leading-relaxed", {
              desktop: "text-base",
            })}
          >
            <strong className="font-semibold">{title}</strong> — {message}
          </p>
          {phase !== "hidden" && (
            <button
              aria-label="Close announcement"
              onClick={() => setPhase("closing")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text"
            >
              <CloseIcon aria-hidden className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
