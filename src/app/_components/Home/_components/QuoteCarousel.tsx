"use client";

import { useEffect, useRef, useState } from "react";
import { useErgoState } from "use-ergo-state";
import classes from "./QuoteCarousel.module.css";
import { e } from "easy-tailwind";
import cx from "classnames";

export const QuoteCarousel = ({
  quotes = [],
}: {
  quotes?: Array<{ quote: string; name: string }>;
}) => {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const currentIndex = useErgoState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;
        const nextIndex =
          currentIndex() + 1 > quotes.length - 1 ? 0 : currentIndex() + 1;
        scrollContainer.scrollTo({
          left: document.documentElement.clientWidth * nextIndex,
          behavior: "smooth",
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [autoplay]);

  return (
    !!quotes.length && (
      <div
        className={e("w-full overflow py-10 bg-primary my-10", {
          desktop: "py-20 my-20",
        })}
      >
        <ul
          ref={scrollContainerRef}
          style={{ scrollbarWidth: "none" }}
          className={cx(
            "flex overflow-x-auto snap-x snap-mandatory",
            classes.carousel
          )}
          onScroll={(e) =>
            currentIndex(
              Math.round(
                e.currentTarget.scrollLeft /
                  document.documentElement.clientWidth
              )
            )
          }
        >
          {quotes.map(({ quote, name }) => (
            <li
              key={name}
              className={e(
                "snap-start snap-always w-full flex-shrink-0 text-text px-4 flex flex-col gap-8",
                { desktop: "px-28" }
              )}
            >
              <p
                className={e("text-2xl font-semibold flex-grow text-center", {
                  desktop: "text-4xl",
                })}
              >
                "{quote}"
              </p>
              <p
                className={e("text-lg font-bold w-full text-right", {
                  desktop: "text-2xl",
                })}
              >
                - {name}
              </p>
            </li>
          ))}
        </ul>
        <ul className="flex justify-center w-full gap-2">
          {quotes.map((_, index) => {
            const isNotSelected = currentIndex() !== index;
            return (
              <li key={index}>
                <button
                  className={e(
                    "transition-opacity rounded-full w-3 h-3 bg-text",
                    isNotSelected &&
                      "opacity-25 hover:opacity-50 active:opacity-75 focus-visible:opacity-50"
                  )}
                  onClick={() => {
                    const scrollContainer = scrollContainerRef.current;
                    if (!scrollContainer) return;
                    scrollContainer.scrollTo({
                      left: document.documentElement.clientWidth * index,
                      behavior: "smooth",
                    });
                    setAutoplay(false);
                  }}
                  aria-label={`Select index ${index}`}
                />
              </li>
            );
          })}
        </ul>
      </div>
    )
  );
};
