"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { e } from "easy-tailwind";
import cx from "classnames";
import CloseIcon from "../GrClose.svg";

// Temporary, hard-coded announcement. Remove once it's no longer needed.
const message =
  "Due to the death of my beloved grandmother, I will be absent for most of this week to grieve and attend her funeral.  For those of you with orders for this week, I will be reaching out to work out timing of pickups and deliveries with you.  I apologize for any inconveniences and thank you for your patience.";

const centeredDuration = 4000;
const cardOutDuration = 200;
const stripInDuration = 300;
const closeDuration = 250;

const easeIn = "cubic-bezier(0.4, 0, 1, 1)";
const easeOut = "cubic-bezier(0, 0, 0.2, 1)";

type Phase =
  | "intro"
  | "centered"
  | "leaving"
  | "entering"
  | "docked"
  | "closing"
  | "closed";

const bannerTextClassName = e("text-text text-sm text-center leading-relaxed", {
  desktop: "text-base",
});

/**
 * Starts as a card in the center of the screen. After a few seconds the card
 * fades out and the message slides down from behind the navigation bar as a
 * sticky strip, where it can be closed.
 */
export const AbsenceBanner = () => {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("intro");
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    // Wait for the hidden card to paint so it can fade in
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setPhase("centered"));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const motion = (duration: number) => (reduceMotion ? 0 : duration);

  useEffect(() => {
    const timeline: Partial<Record<Phase, [Phase, number]>> = {
      centered: ["leaving", centeredDuration],
      leaving: ["entering", motion(cardOutDuration)],
      entering: ["docked", motion(stripInDuration)],
      closing: ["closed", motion(closeDuration)],
    };
    const next = timeline[phase];
    if (!next) return;
    const timeout = setTimeout(() => setPhase(next[0]), next[1]);
    return () => clearTimeout(timeout);
  }, [phase, reduceMotion]);

  if (phase === "closed") return null;

  const cardMounted =
    mounted &&
    (phase === "intro" || phase === "centered" || phase === "leaving");
  const cardVisible = phase === "centered";
  const cardTransition = (property: string) =>
    `${property} ${motion(cardOutDuration)}ms ${
      cardVisible ? easeOut : easeIn
    }`;
  const stripShown =
    phase === "entering" || phase === "docked" || phase === "closing";
  const stripSettled = phase === "docked" || phase === "closing";

  const leaveEarly = () => {
    if (phase === "intro" || phase === "centered") setPhase("leaving");
  };

  return (
    <>
      <div
        className="grid"
        style={{
          gridTemplateRows: stripShown ? "1fr" : "0fr",
          transition: `grid-template-rows ${motion(
            stripInDuration
          )}ms ${easeOut}`,
        }}
      >
        <div className={cx("min-h-0", !stripSettled && "overflow-hidden")}>
          <div
            role="region"
            aria-label="Announcement"
            className={cx(
              "relative bg-white shadow-sm-even shadow-black/20",
              e("py-3 pl-4 pr-9", { desktop: "px-10" })
            )}
            style={{
              opacity: phase === "closing" ? 0 : 1,
              transform: stripShown ? "translateY(0)" : "translateY(-100%)",
              transition:
                phase === "closing"
                  ? `opacity ${motion(closeDuration)}ms ease-in-out`
                  : `transform ${motion(stripInDuration)}ms ${easeOut}`,
            }}
          >
            <p className={bannerTextClassName}>{message}</p>
            {stripSettled && (
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
      {cardMounted &&
        createPortal(
          <div
            aria-hidden
            onClick={leaveEarly}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black"
              style={{
                opacity: cardVisible ? 0.4 : 0,
                transition: cardTransition("opacity"),
              }}
            />
            <div
              className="relative w-full max-w-xl rounded bg-white py-8 px-6 shadow-even shadow-black/20"
              style={{
                opacity: cardVisible ? 1 : 0,
                transform: cardVisible ? "scale(1)" : "scale(0.97)",
                transition: `${cardTransition("opacity")}, ${cardTransition(
                  "transform"
                )}`,
              }}
            >
              <p className={bannerTextClassName}>{message}</p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
