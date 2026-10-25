"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
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

type Phase = "hidden" | "entering" | "docked" | "closing";

/**
 * Pops up on the contact page. Lives in the layout so that once it has popped
 * up it stays open while navigating around the site, and once closed it stays
 * closed.
 */
export const AbsenceBanner = () => {
  const onContactPage = usePathname() === "/contact";
  const [shown, setShown] = useState(false);
  const [closed, setClosed] = useState(false);
  if (onContactPage && !shown) setShown(true);
  if (closed || !(shown || onContactPage)) return null;
  return <AbsenceBannerStrip onClosed={() => setClosed(true)} />;
};

/**
 * A strip stuck to the bottom of the screen (above the sticky footer on
 * desktop) that slides up on load and slides back down when closed. Renders
 * only on the client so the expiry check uses the visitor's clock rather than
 * a pre-rendered page.
 */
const AbsenceBannerStrip = ({ onClosed }: { onClosed: () => void }) => {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("hidden");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [stripHeight, setStripHeight] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const observer = new ResizeObserver(() =>
      setStripHeight(strip.offsetHeight)
    );
    observer.observe(strip);
    return () => observer.disconnect();
  }, [mounted]);

  const duration = reduceMotion ? 0 : slideDuration;

  useEffect(() => {
    if (phase !== "entering" && phase !== "closing") return;
    const next = phase === "entering" ? () => setPhase("docked") : onClosed;
    const timeout = setTimeout(next, duration);
    return () => clearTimeout(timeout);
  }, [phase, duration]);

  if (!mounted) return null;

  const open = phase === "entering" || phase === "docked";
  const easing = open
    ? "cubic-bezier(0, 0, 0.2, 1)"
    : "cubic-bezier(0.4, 0, 1, 1)";

  const transition = `transform ${duration}ms ${easing}`;

  // On desktop the strip takes over the footer's "sliding door" shadow: the
  // footer's gap and fade move above the strip, and a sticky shadow line
  // follows the strip, sliding under the fade at the page end. On close the
  // line slides down onto the footer's own line.
  return (
    <>
      <div
        className={e("relative mt-8 h-8 z-[6]", {
          desktop:
            "bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(255,255,255,1)]",
        })}
      />
      <div
        className={e("hidden", {
          desktop: "block sticky h-[1px] -mb-[1px] w-full z-[4] bg-primary",
        })}
        style={{
          bottom: `calc(2rem + ${stripHeight}px)`,
          boxShadow: "5px -1.5em 20px 5px rgb(0 0 0 / 50%)",
          // Sits 2rem below the strip's top edge, like the footer's line sits
          // a footer-height below its top, so only the shadow's edge peeks out
          transform: `translateY(calc(2rem + ${open ? 0 : stripHeight}px))`,
          transition,
        }}
      />
      {/* Only transform is animated: animating height makes the sticky
          position lag behind the slide. The clip hides the strip below its
          resting edge while leaving room for its shadow above. The negative
          margin cancels the footer's top margin so the strip rests on it. */}
      <div
        className={e("sticky bottom-0 z-[5] -mb-16", {
          desktop: "bottom-8 z-[11]",
        })}
        style={{ clipPath: "inset(-1rem 0 0 0)" }}
      >
        <div
          ref={stripRef}
          role="region"
          aria-label="Announcement"
          className={cx(
            "relative bg-white",
            e("py-3 pl-4 pr-9 shadow-sm-even shadow-black/20", {
              desktop: "px-10 shadow-none",
            })
          )}
          style={{
            transform: open ? "translateY(0)" : "translateY(100%)",
            transition,
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
    </>
  );
};
