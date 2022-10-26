import React from "react";
import type { UrlObject } from "url";

import { XyzTransition } from "@animxyz/react";
import ArrowBackIcon from "@fortawesome/fontawesome-free/svgs/solid/arrow-left.svg";
import ArrowForwardIcon from "@fortawesome/fontawesome-free/svgs/solid/arrow-right.svg";
import CloseIcon from "@fortawesome/fontawesome-free/svgs/solid/xmark.svg";
import { styled } from "@stitches/react";
import { keyword } from "color-convert";
import Link from "next/link";
import { useRouter } from "next/router";

import styleUtils from "../utils/styleUtils";

import Carousel from "./Carousel";

export const imageCarouselRouting = {
  queryParam: "overlay",
  queryValue: "image-carousel",
  indexQueryParam: "index",
  queryBuilder(selectedIndex: number) {
    return {
      [this.queryParam]: this.queryValue,
      [this.indexQueryParam]: selectedIndex,
    };
  },
};

interface Props {
  images: Array<{ src: string; alt: string }>;
}

const ImageCarouselOverlay = ({ images }: Props) => {
  const router = useRouter();
  const selectedItemMod =
    Number.parseInt(
      router.query[imageCarouselRouting.indexQueryParam] as string
    ) % images.length;
  const selectedItem =
    selectedItemMod < 0
      ? images.length - Math.abs(selectedItemMod)
      : selectedItemMod;
  const open =
    router.query[imageCarouselRouting.queryParam] ===
    imageCarouselRouting.queryValue;
  const routes = {
    close: {
      pathname: router.pathname,
      query: (() => {
        const query = { ...router.query };
        delete query[imageCarouselRouting.indexQueryParam];
        delete query[imageCarouselRouting.queryParam];
        return query;
      })(),
    },
    prev: {
      pathname: router.pathname,
      query: {
        ...router.query,
        [imageCarouselRouting.indexQueryParam]: selectedItem - 1,
      },
    },
    next: {
      pathname: router.pathname,
      query: {
        ...router.query,
        [imageCarouselRouting.indexQueryParam]: selectedItem + 1,
      },
    },
  };

  React.useEffect(() => {
    if (open) {
      const listener = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          router.replace(routes.close, undefined, { scroll: false });
          document.removeEventListener("keydown", listener);
        } else if (event.key === "ArrowRight") {
          router.replace(routes.next, undefined, { scroll: false });
        } else if (event.key === "ArrowLeft") {
          router.replace(routes.prev, undefined, { scroll: false });
        }
      };

      document.addEventListener("keydown", listener);

      return () => document.removeEventListener("keydown", listener);
    }
  });

  return (
    <XyzTransition xyz="fade">
      {open && (
        <styles.ImageCarouselOverlay>
          <styles.CloseButton>
            <ControlButton href={routes.close}>
              <img src={CloseIcon.src} alt="Close" />
            </ControlButton>
          </styles.CloseButton>
          <styles.PrevButton>
            <ControlButton href={routes.prev}>
              <img src={ArrowBackIcon.src} alt="Close" />
            </ControlButton>
          </styles.PrevButton>
          <styles.NextButton>
            <ControlButton href={routes.next}>
              <img src={ArrowForwardIcon.src} alt="Close" />
            </ControlButton>
          </styles.NextButton>
          <styles.CarouselContainer>
            <Carousel
              index={selectedItem}
              setIndex={(index) =>
                router.replace(
                  {
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      [imageCarouselRouting.indexQueryParam]: index,
                    },
                  },
                  undefined,
                  { scroll: false }
                )
              }
              items={images}
              slideComponent={({
                item: { src, alt },
                isActive,
                isPrev,
                isNext,
              }) => (
                <>
                  {isActive && (
                    <Link href={routes.close} scroll={false} replace passHref>
                      <styles.BackgroundCover tabIndex={-1} />
                    </Link>
                  )}
                  <styles.CarouselFrame key={src}>
                    {(isActive || isPrev || isNext) && (
                      <img src={src} alt={alt} loading="lazy" />
                    )}
                  </styles.CarouselFrame>
                </>
              )}
            />
          </styles.CarouselContainer>
        </styles.ImageCarouselOverlay>
      )}
    </XyzTransition>
  );
};

const ControlButton = ({
  href,
  children,
}: {
  href: UrlObject | string;
  children: React.ReactChild;
}) => (
  <Link scroll={false} href={href} replace passHref>
    <styles.ControlButton>{children}</styles.ControlButton>
  </Link>
);

const styles = Object.freeze({
  ImageCarouselOverlay: styled("div", {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    zIndex: 100,
    background: `rgba(${keyword.rgb("black").join(",")}, 0.5)`,
    backdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  BackgroundCover: styled("a", {
    height: "100vh",
    width: "100vw",
    display: "block",
    position: "absolute",
    top: 0,
    left: 0,
    cursor: "auto",
  }),
  CloseButton: styled("div", {
    position: "fixed",
    zIndex: 100,
    top: 25,
    left: 25,
  }),
  PrevButton: styled("div", {
    position: "fixed",
    zIndex: 100,
    left: 25,
    top: "calc(50vh - 25px)",
    "> a": {
      [styleUtils.mobile]: {
        background: "var(--transparent-primary)",
      },
    },
  }),
  NextButton: styled("div", {
    position: "fixed",
    zIndex: 100,
    right: 25,
    top: "calc(50vh - 25px)",
    "> a": {
      [styleUtils.mobile]: {
        background: "var(--transparent-primary)",
      },
    },
  }),
  ControlButton: styled(
    "a",
    {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 50,
      height: 50,
      borderRadius: 25,
      background: "var(--primary-color)",
      img: {
        height: 25,
        width: 25,
        opacity: 0.7,
      },
    },
    styleUtils.clickableShadow
  ),
  CarouselContainer: styled("div", {
    marginTop: 100,
    marginBottom: 100,
    [styleUtils.mobile]: {
      marginTop: 0,
      marginBottom: 0,
    },
    maxHeight: "calc(100vh - 200px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ".swiper-initialized": {
      width: "100vw",
      height: "100vh",
    },
  }),
  CarouselFrame: styled("div", {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    margin: "auto",
    height: "100vh",
    img: {
      height: "auto !important",
      width: "auto !important",
      maxHeight: "85%",
      maxWidth: "100%",
      zIndex: 100,
      cursor: "grab",
      "&:active": {
        cursor: "grabbing",
      },
    },
  }),
});

export default ImageCarouselOverlay;
