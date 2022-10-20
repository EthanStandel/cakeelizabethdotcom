import { FC } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import styleUtils from "src/utils/styleUtils";

import { imageCarouselRouting } from "./ImageCarouselOverlay";

export const ImageGallery: FC<{ images: Array<{ src: string; alt: string }> }> =
  ({ images }) => {
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
              href={{
                pathname: router.pathname,
                query: {
                  ...router.query,
                  ...imageCarouselRouting.queryBuilder(index + 1),
                },
              }}
            >
              <a>
                <Image alt={alt} width={150} height={150} src={src} />
              </a>
            </Link>
          ))}
      </styles.ImagesContainer>
    );
  };

const styles = {
  ImagesContainer: styled.div({
    display: "grid",
    gap: "1em",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",

    img: {
      objectFit: "auto" as any,
    },

    "> a": {
      "&": styleUtils.clickableShadow,
      borderRadius: "var(--card-border-radius)",

      "> *": {
        display: "block !important",
      },
    },
  }),
};
