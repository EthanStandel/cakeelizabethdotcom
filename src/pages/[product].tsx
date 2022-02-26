import React from "react";

import { css } from "@emotion/react";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import ImageCarouselOverlay, {
  imageCarouselRouting,
} from "../components/ImageCarouselOverlay";
import MdRenderer from "../components/MdRenderer";
import styleUtils from "../utils/styleUtils";

import { allPageContents, allImageManifests } from ".contentlayer/data";
import type { PageContent } from ".contentlayer/types";

interface ProductPageProps {
  content: PageContent;
  images: Array<{ src: string; alt: string }>;
}

const Page = ({ content, images }: ProductPageProps) => {
  const mainImgRef = React.useRef<null | HTMLImageElement>(null);
  const router = useRouter();

  return (
    <div css={[styleUtils.pageContainer, styles.root]}>
      <ImageCarouselOverlay images={images} />
      <div css={styleUtils.contentContainer}>
        <div css={styles.mainSection}>
          <div ref={mainImgRef} css={styles.mainImgContainer}>
            <img alt={images[0].alt} src={images[0].src} />
          </div>
          <div css={styles.spielContainer}>
            <MdRenderer input={content.body.raw} />
          </div>
        </div>
        <div css={styles.imagesContainer}>
          {images.map(({ src, alt }, index) => (
            <Link
              key={src}
              scroll={false}
              href={{
                pathname: router.pathname,
                query: {
                  ...router.query,
                  ...imageCarouselRouting.queryBuilder(index),
                },
              }}
            >
              <a>
                <Image alt={alt} width={150} height={150} src={src} />
              </a>
            </Link>
          ))}
        </div>
        {content.data?.extendedContent && (
          <div css={styles.extendedInfo}>
            <MdRenderer input={content.data.extendedContent} />
          </div>
        )}
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = () => ({
  paths: allPageContents
    .filter(({ product }) => product)
    .map(({ page }) => ({ params: { product: page } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const content = allPageContents.find(
      ({ page }) => page === params?.product
    );

    if (typeof params?.product !== "string" || !content) {
      throw new Error("Not a product page");
    }

    const images = allImageManifests
      .find(({ page }) => page === params.product)
      ?.items.map((src) => ({ src, alt: `${content?.pageTitle} example` }));

    return {
      props: { content, images },
    };
  } catch {
    return { notFound: true };
  }
};

export const styles = Object.freeze({
  root: css`
    img {
      border-radius: var(--chakra-radii-md);
    }
  `,
  mainSection: css`
    display: flex;
    gap: 1em;
    margin-bottom: 1em;
    align-items: center;

    ${styleUtils.mobile(css`
      justify-content: center;
      flex-direction: column-reverse;
      width: 100%;
    `)}
  `,

  mainImgContainer: css`
    display: flex;
    align-items: center;
    justify-content: center;

    ${styleUtils.mobile(css`
      scroll-margin-top: 60px;
      width: 100%;
      height: 500px;
    `)}

    ${styleUtils.desktop(css`
      scroll-margin-top: 115px;
      width: calc(60% - 1em);
      height: 750px;
    `)}

    img {
      object-fit: cover;

      ${styleUtils.mobile(css`
        max-width: 100%;
        max-height: 500px;
      `)}

      ${styleUtils.desktop(css`
        max-width: 100%;
        max-height: 750px;
      `)}
    }
  `,

  spielContainer: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    ${styleUtils.desktop(
      css`
        width: 40%;
      `
    )}
    ${styleUtils.mobile(
      css`
        width: 100%;
      `
    )}
  `,

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

  extendedInfo: css`
    ${styleUtils.shadow}
    margin-top: 2rem;
    padding: 1em 2em 2em 2em;
    ${styleUtils.mobile(
      css`
        padding: 0 1em 1em 1em;
      `
    )}
    border-radius: var(--chakra-radii-md);
    ol,
    ul {
      & > li {
        list-style-type: none;
        ${styleUtils.mobile(
          css`
            text-align: center;
          `
        )}
        &:nth-child(2n-1) {
          background: var(--primary-color);
        }
      }
    }
  `,
});

export default Page;
