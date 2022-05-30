import React from "react";

import { css } from "@emotion/react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { FlavorGroup } from "src/components/FlavorGroup";
import { ImageGallery } from "src/components/ImageGallery";
import MdxRenderer from "src/components/MdxRenderer";

import ImageCarouselOverlay, {
  imageCarouselRouting,
} from "../components/ImageCarouselOverlay";
import styleUtils from "../utils/styleUtils";

import {
  allPageContents,
  allImageManifests,
  allExtendedPageContents,
} from ".contentlayer/generated";
import type { PageContent } from ".contentlayer/generated/types";

interface Props {
  content: Omit<PageContent, "body"> & { body: string };
  extendedContentBody: string | null;
  images: Array<{ src: string; alt: string }>;
}

const Page: NextPage<Props> = ({ content, images, extendedContentBody }) => {
  const mainImgRef = React.useRef<null | HTMLImageElement>(null);
  const router = useRouter();

  return (
    <div css={[styleUtils.pageContainer, styles.root]}>
      <ImageCarouselOverlay images={images} />
      <div css={styleUtils.contentContainer}>
        <div css={styles.mainSection}>
          <div ref={mainImgRef} css={styles.mainImgContainer}>
            <Link
              scroll={false}
              href={{
                pathname: router.pathname,
                query: {
                  ...router.query,
                  ...imageCarouselRouting.queryBuilder(0),
                },
              }}
            >
              <a>
                <img alt={images[0].alt} src={images[0].src} />
              </a>
            </Link>
          </div>
          <div css={styles.spielContainer}>
            <div css={styleUtils.htmlRoot}>
              <h2>{content.pageTitle}</h2>
              <MdxRenderer input={content.body} />
            </div>
          </div>
        </div>
        <ImageGallery images={images} />
        {extendedContentBody && (
          <div css={[styleUtils.htmlRoot, styles.shadowPassthrough]}>
            <MdxRenderer
              input={extendedContentBody}
              components={{ FlavorGroup }}
            />
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

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  try {
    const content = allPageContents.find(
      ({ page }) => page === params?.product
    );

    const extendedContent = allExtendedPageContents.find(
      ({ page }) => page === params?.product
    );

    if (typeof params?.product !== "string" || !content) {
      throw new Error("Not a product page");
    }

    const images = allImageManifests
      .find(({ page }) => page === params.product)!
      .items.map((src) => ({ src, alt: `${content?.pageTitle} example` }));

    return {
      props: {
        content: { ...content!, body: content!.body.raw },
        images,
        extendedContentBody: extendedContent?.body.raw ?? null,
      },
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

    a {
      ${styleUtils.clickableShadow}
      border-radius: var(--chakra-radii-md);
    }

    ${styleUtils.mobile(css`
      scroll-margin-top: 60px;
      width: 100%;
    `)}

    ${styleUtils.desktop(css`
      scroll-margin-top: 115px;
      width: calc(50% - 1em);
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
        width: 50%;
      `
    )}
    ${styleUtils.mobile(
      css`
        width: 100%;
      `
    )}
  `,
  shadowPassthrough: css`
    overflow: visible;
  `,
});

export default Page;
