import { FC } from "react";

import { css, styled } from "@stitches/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import styleUtils from "../utils/styleUtils";

import { imageCarouselRouting } from "./ImageCarouselOverlay";

export const ImageGallery: FC<{
  images: Array<{ src: string; alt: string }>;
}> = ({ images }) => {
  const router = useRouter();

  return (
    <styles.ImagesContainer>
      {images
        .filter((_, index) => index !== 0)
        .map(({ src, alt }, index) => (
          <Link
            key={src}
            scroll={false}
            replace
            shallow
            passHref
            href={{
              pathname: router.pathname,
              query: {
                ...router.query,
                ...imageCarouselRouting.queryBuilder(index + 1),
              },
            }}
          >
            <styles.GallaryThumbnailLink>
              <Image alt={alt} width={150} height={150} src={src} />
            </styles.GallaryThumbnailLink>
          </Link>
        ))}
    </styles.ImagesContainer>
  );
};

const styles = {
  ImagesContainer: styled("div", {
    display: "grid",
    gap: "1em",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",

    img: {
      objectFit: "auto",
      borderRadius: 0,
    },
  }),
  GallaryThumbnailLink: styled(
    "a",
    {
      borderRadius: "var(--card-border-radius)",
      height: 150,
      width: 150,
      overflow: "hidden",

      "> *": {
        display: "block !important",
        height: "100%",
        width: "100%",
      },
    },
    styleUtils.clickableShadow
  ),
};
