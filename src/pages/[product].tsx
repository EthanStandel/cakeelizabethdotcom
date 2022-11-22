import React from "react";

import { styled, css } from "@stitches/react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  allPageContents,
  allImageManifests,
  allExtendedPageContents,
} from ".contentlayer/generated";
import type { PageContent } from ".contentlayer/generated/types";

import { FlavorGroup } from "../components/FlavorGroup";
import ImageCarouselOverlay, {
  imageCarouselRouting,
} from "../components/ImageCarouselOverlay";
import { ImageGallery } from "../components/ImageGallery";
import MdxRenderer from "../components/MdxRenderer";
import styleUtils from "../utils/styleUtils";

interface Props {
  content: Omit<PageContent, "body"> & { body: string };
  extendedContentBody: string | null;
  images: Array<{ src: string; alt: string }>;
}

const Page: NextPage<Props> = ({ content, images, extendedContentBody }) => {
  const mainImgRef = React.useRef<null | HTMLImageElement>(null);
  const router = useRouter();

  return (
    <styles.ProductPage>
      <ImageCarouselOverlay images={images} />
      <styleUtils.ContentContainer>
        <styles.MainSection>
          <styles.MainImgContainer ref={mainImgRef}>
            <Link
              className={styles.heroImageLink()}
              scroll={false}
              replace
              href={{
                pathname: router.pathname,
                query: {
                  ...router.query,
                  ...imageCarouselRouting.queryBuilder(0),
                },
              }}
            >
              <img alt={images[0].alt} src={images[0].src} />
            </Link>
          </styles.MainImgContainer>
          <styles.SpielContainer>
            <styleUtils.HtmlRoot>
              <h2>{content.pageTitle}</h2>
              <MdxRenderer input={content.body} />
            </styleUtils.HtmlRoot>
          </styles.SpielContainer>
        </styles.MainSection>
        <ImageGallery images={images} />
        {extendedContentBody && (
          <styles.ShadowPassthrough>
            <MdxRenderer
              input={extendedContentBody}
              components={{ FlavorGroup }}
            />
          </styles.ShadowPassthrough>
        )}
      </styleUtils.ContentContainer>
    </styles.ProductPage>
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
  heroImageLink: css(
    {
      borderRadius: "1.5em",
      overflow: "hidden",
      maxWidth: "100%",
      display: "flex",

      [styleUtils.mobile]: {
        maxHeight: 500,
      },

      [styleUtils.desktop]: {
        maxHeight: 750,
      },

      img: {
        flexGrow: 1,
        objectFit: "cover",
        height: "100%",
        width: "100%",
      },
    },
    styleUtils.clickableShadow
  ),
  ProductPage: styled("div", styleUtils.pageContainer),
  MainSection: styled("div", {
    display: "flex",
    gap: "1em",
    marginBottom: "1em",
    alignItems: "center",
    [styleUtils.mobile]: {
      justifyContent: "center",
      flexDirection: "column-reverse",
      width: "100%",
    },
  }),
  MainImgContainer: styled("div", {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    [styleUtils.mobile]: {
      scrollMarginTop: 60,
      width: "100%",
    },

    [styleUtils.desktop]: {
      scrollMarginTop: 115,
      width: "calc(50% - 1em)",
    },
  }),
  SpielContainer: styled("div", {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    [styleUtils.desktop]: {
      width: "50%",
    },
    [styleUtils.mobile]: {
      width: "100%",
    },
  }),
  ShadowPassthrough: styled(
    "div",
    {
      overflow: "visible",
    },
    styleUtils.htmlRoot
  ),
});

export default Page;
