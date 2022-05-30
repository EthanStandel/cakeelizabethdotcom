import { FC } from "react";

import { css } from "@emotion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import styleUtils from "src/utils/styleUtils";

import { imageCarouselRouting } from "./ImageCarouselOverlay";

export const ImageGallery: FC<{ images: Array<{ src: string; alt: string }> }> =
  ({ images }) => {
    const router = useRouter();

    return (
      <div css={styles.imagesContainer}>
        {images
          .filter((_, index) => index !== 0)
          .map(({ src, alt }, index) => (
            <Link
              key={src}
              scroll={false}
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
      </div>
    );
  };

const styles = {
  imagesContainer: css`
    display: grid;
    gap: 1em;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));

    img {
      object-fit: cover;
    }

    > a {
      ${styleUtils.clickableShadow}
      border-radius: var(--chakra-radii-md);

      & > * {
        display: block !important;
      }
    }
  `,
};
