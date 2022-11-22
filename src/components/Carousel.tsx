import { useEffect, useRef, useState } from "react";

import { styled } from "@stitches/react";

export interface CarouselProps<T> {
  items: Array<T>;
  slideComponent: React.FC<{ item: T; index: number }>;
  index: number;
  setIndex: (index: number) => void;
  overlay?: boolean;
  autoplayInterval?: number;
  hideScroll?: boolean;
}

const Carousel: <T>(props: CarouselProps<T>) => React.ReactElement = ({
  index: currentIndex,
  setIndex,
  items,
  overlay,
  autoplayInterval,
  hideScroll,
  slideComponent: SlideComponent,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const previousIndex = useRef(currentIndex);
  useEffect(() => {
    if (carouselRef.current && Number.isInteger(currentIndex)) {
      const hasWrapped =
        (previousIndex.current === 0 && currentIndex === items.length - 1) ||
        (previousIndex.current === items.length - 1 && currentIndex === 0);
      const firstRender = previousIndex.current === currentIndex;
      previousIndex.current = currentIndex;

      carouselRef.current.scroll({
        behavior: firstRender || hasWrapped ? undefined : "smooth",
        left: carouselRef.current.clientWidth * (currentIndex + 1),
      });
    }
  }, [currentIndex, items.length]);

  useEffect(() => {
    if (autoplayInterval) {
      const timeout = setTimeout(() => {
        setIndex(currentIndex + 1 > items.length - 1 ? 0 : currentIndex + 1);
      }, autoplayInterval);
      return () => clearTimeout(timeout);
    }
  }, [autoplayInterval, currentIndex, items, setIndex]);

  return (
    <styles.Carousel
      ref={carouselRef}
      overlay={overlay}
      hideScroll={hideScroll}
      onScroll={(e) => {
        const container = e.target as HTMLDivElement;
        const width = (container.firstChild as HTMLDivElement).clientWidth;
        if (container.scrollLeft % width === 0) {
          setIndex((container.scrollLeft - width) / width);
        }
      }}
    >
      {[items[items.length - 1], ...items, items[0]].map(
        (item, effectiveIndex) => {
          const index = effectiveIndex - 1;
          return (
            <styles.CarouselSlide key={index} data-index={index}>
              <SlideComponent index={index} item={item} />
            </styles.CarouselSlide>
          );
        }
      )}
    </styles.Carousel>
  );
};

const styles = Object.freeze({
  Carousel: styled("div", {
    overflowX: "auto",
    display: "flex",
    scrollSnapType: "x mandatory",
    variants: {
      overlay: {
        true: {
          position: "fixed",
          height: "100%",
          width: "100%",
          top: 0,
          left: 0,
        },
      },
      hideScroll: {
        true: {
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      },
    },
  }),
  CarouselSlide: styled("div", {
    height: "100%",
    width: "100%",
    flexShrink: 0,
    scrollSnapAlign: "start",
  }),
});

export default Carousel;
