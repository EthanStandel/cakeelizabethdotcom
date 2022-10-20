import { useEffect, useState } from "react";

import styled from "@emotion/styled";
import _isNil from "lodash/isNil";
import { Swiper, Pagination, Autoplay } from "swiper";
import {
  Swiper as SwiperComponent,
  SwiperSlide,
  useSwiperSlide,
} from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

export interface CarouselProps<T> {
  items: Array<T>;
  slideComponent: React.FC<SlideData & { item: T }>;
  index: number;
  setIndex: (index: number) => void;
  zIndex?: number;
  pagination?: boolean;
  autoplay?: boolean;
}

// this isn't exported for some reason 🤷‍♂️
type SlideData = ReturnType<typeof useSwiperSlide>;

const Carousel: <T>(props: CarouselProps<T>) => React.ReactElement = ({
  index,
  setIndex,
  pagination,
  autoplay,
  items,
  zIndex = 1, // actual default from swiper
  slideComponent: SlideComponent,
}) => {
  const [swiper, setSwiper] = useState<Swiper | undefined>();
  useEffect(() => {
    if (swiper && !_isNil(swiper?.realIndex) && swiper.realIndex !== index) {
      swiper.slideTo(index + 1);
    }
  }, [swiper, index]);
  return (
    <styles.SwiperComponent
      loop
      css={{ zIndex }}
      modules={[
        ...(pagination ? [Pagination] : []),
        ...(autoplay ? [Autoplay] : []),
      ]}
      autoplay={
        autoplay
          ? {
              delay: 2500,
              disableOnInteraction: true,
            }
          : undefined
      }
      pagination={
        pagination
          ? {
              clickable: true,
            }
          : undefined
      }
      initialSlide={index}
      onSwiper={(swiper: Swiper) => setSwiper(swiper)}
      onSlideChange={(swiper: Swiper) => {
        if (swiper.realIndex !== index) {
          setIndex(swiper.realIndex);
        }
      }}
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>
          {(slideData: SlideData) => (
            <SlideComponent {...slideData} item={item} />
          )}
        </SwiperSlide>
      ))}
    </styles.SwiperComponent>
  );
};

const styles = Object.freeze({
  SwiperComponent: styled(SwiperComponent)({
    ".swiper-pagination-bullet-active": {
      backgroundColor: "white",
    },
  }),
});

export default Carousel;
