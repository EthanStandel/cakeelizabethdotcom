import { useEffect } from "react";
import type { UrlObject } from "url";

import { XyzTransition } from "@animxyz/react";
import { CloseIcon, ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";

import classes from "../styles/components/ImageCarouselOverlay.module.sass";

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
  const selectedItem =
    Number.parseInt(
      router.query[imageCarouselRouting.indexQueryParam] as string
    ) % images.length;
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

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.push(routes.close, undefined, { scroll: false });
        document.removeEventListener("keydown", listener);
      } else if (event.key === "ArrowRight") {
        router.push(routes.next, undefined, { scroll: false });
      } else if (event.key === "ArrowLeft") {
        router.push(routes.prev, undefined, { scroll: false });
      }
    };

    document.addEventListener("keydown", listener);

    return () => document.removeEventListener("keydown", listener);
  });

  return (
    <XyzTransition xyz="fade">
      {open && (
        <div className={classes.root}>
          <div className={classes.closeButton}>
            <ControlButton href={routes.close}>
              <CloseIcon />
            </ControlButton>
          </div>
          <div className={classes.prevButton}>
            <ControlButton href={routes.prev}>
              <ArrowBackIcon />
            </ControlButton>
          </div>
          <div className={classes.nextButton}>
            <ControlButton href={routes.next}>
              <ArrowForwardIcon />
            </ControlButton>
          </div>
          <div className={classes.carouselContainer}>
            <Carousel
              swipeable
              emulateTouch
              autoFocus
              infiniteLoop
              onChange={(index) =>
                router.push(
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
              useKeyboardArrows={false}
              showThumbs={false}
              showIndicators={false}
              showArrows={false}
              autoPlay={false}
              showStatus={false}
              selectedItem={selectedItem}
            >
              {images.map(({ src, alt }) => (
                <div key={src} className={classes.carouselFrame}>
                  <img src={src} alt={alt} />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
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
  <Link scroll={false} href={href}>
    <a className={classes.controlButton}>{children}</a>
  </Link>
);

export default ImageCarouselOverlay;
