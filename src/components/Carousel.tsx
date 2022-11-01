import { useEffect, useRef } from "react";

import { styled } from "@stitches/react";

export interface CarouselProps<T> {
  items: Array<T>;
  slideComponent: React.FC<{ item: T; index: number; isClose: boolean }>;
  index: number;
  setIndex: (index: number) => void;
  zIndex?: number;
  pagination?: boolean;
  autoplay?: boolean;
}

const Carousel: <T>(props: CarouselProps<T>) => React.ReactElement = ({
  index: currentIndex,
  setIndex,
  items,
  slideComponent: SlideComponent,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!carouselRef.current) return;

    carouselRef.current
      .querySelector(`[data-index="${currentIndex}"]`)
      ?.scrollIntoView();
  }, [currentIndex]);

  return (
    <styles.Carousel
      ref={carouselRef}
      onScroll={(e) => {
        const container = e.target as HTMLDivElement;
        const width = (container.firstChild as HTMLDivElement).clientWidth;
        if (container.scrollLeft % width === 0) {
          setIndex(container.scrollLeft / width);
        }
      }}
    >
      {items.map((item, index) => (
        <styles.CarouselSlide key={index} data-index={index}>
          <SlideComponent
            index={index}
            item={item}
            isClose={
              currentIndex === index - 1 ||
              currentIndex === index ||
              currentIndex === index + 1
            }
          />
        </styles.CarouselSlide>
      ))}
    </styles.Carousel>
  );
};

const styles = Object.freeze({
  Carousel: styled("div", {
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    overflowX: "auto",
    position: "fixed",
    display: "flex",
    scrollSnapType: "x mandatory",
    scrollBehavior: "smooth",
  }),
  CarouselSlide: styled("div", {
    height: "100%",
    width: "100%",
    flexShrink: 0,
    scrollSnapAlign: "start",
  }),
});

export default Carousel;
