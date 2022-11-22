import React, { useRef } from "react";
import type { UrlObject } from "url";

import ArrowBackIcon from "@fortawesome/fontawesome-free/svgs/solid/arrow-left.svg";
import ArrowForwardIcon from "@fortawesome/fontawesome-free/svgs/solid/arrow-right.svg";
import CloseIcon from "@fortawesome/fontawesome-free/svgs/solid/xmark.svg";
import { css, styled } from "@stitches/react";
import { keyword } from "color-convert";
import Link from "next/link";
import { useRouter } from "next/router";
import { CSSTransition } from "react-transition-group";

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
          router.replace(routes.close, undefined, {
            scroll: false,
            shallow: true,
          });
          document.removeEventListener("keydown", listener);
        } else if (event.key === "ArrowRight") {
          router.replace(routes.next, undefined, {
            scroll: false,
            shallow: true,
          });
        } else if (event.key === "ArrowLeft") {
          router.replace(routes.prev, undefined, {
            scroll: false,
            shallow: true,
          });
        }
      };

      document.addEventListener("keydown", listener);

      return () => document.removeEventListener("keydown", listener);
    }
  });
  const rootRef = useRef(null);

  return (
    <CSSTransition
      timeout={200}
      nodeRef={rootRef}
      in={open}
      classNames="image-carousel"
      unmountOnExit
    >
      <div ref={rootRef} className={styles.transitionalRoot()}>
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
              overlay
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
                  { scroll: false, shallow: true }
                )
              }
              items={images}
              slideComponent={({ item: { src, alt } }) => (
                <>
                  <styles.CarouselFrame
                    key={src}
                    onClick={() =>
                      router.replace(routes.close, undefined, {
                        scroll: false,
                        shallow: true,
                      })
                    }
                  >
                    <img
                      src={src}
                      alt={alt}
                      loading="lazy"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </styles.CarouselFrame>
                </>
              )}
            />
          </styles.CarouselContainer>
        </styles.ImageCarouselOverlay>
      </div>
    </CSSTransition>
  );
};

const ControlButton = ({
  href,
  children,
}: {
  href: UrlObject | string;
  children: React.ReactChild;
}) => (
  <Link
    className={styles.controlButton()}
    scroll={false}
    href={href}
    replace
    shallow
  >
    {children}
  </Link>
);

const styles = Object.freeze({
  transitionalRoot: css({
    "&.image-carousel-enter": {
      "> *": {
        opacity: 0,
      },
      "[data-index] img": {
        transform: "scale(.6)",
      },
    },
    "&.image-carousel-enter-active": {
      "> *": {
        opacity: 1,
        transition: "opacity .2s ease",
      },
      "[data-index] img": {
        transition: "transform .2s ease",
        transform: "none",
      },
    },
    "&.image-carousel-exit": {
      "> *": {
        opacity: 1,
      },
      "[data-index] img": {
        transform: "none",
      },
    },
    "&.image-carousel-exit-active": {
      "> *": {
        transition: "opacity .2s ease",
        opacity: 0,
      },
      "[data-index] img": {
        transition: "transform .2s ease",
        transform: "scale(.6)",
      },
    },
  }),
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
  controlButton: css({
    transition: "border-color 0.15s, box-shadow 0.15s",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 33,
    background: "var(--primary-color)",
    border: "1px solid transparent",
    img: {
      height: 25,
      width: 25,
      opacity: 0.7,
    },
    outline: "none !important",
    "&:hover, &:focus": {
      borderColor: "white",
      boxShadow: "0 0 5px 5px var(--primary-color)",
    },
    "> *": {
      transition: "transform 0.15s",
    },
    "&:active": {
      boxShadow: "none",
      "> * ": {
        transform: "scale(0.8)",
      },
    },
  }),
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
      borderRadius: "1.5em",
    },
  }),
});

export default ImageCarouselOverlay;
