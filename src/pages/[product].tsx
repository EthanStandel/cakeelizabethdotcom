import React from "react";

import { styled } from "@stitches/react";
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
    <styles.ProductPage>
      <ImageCarouselOverlay images={images} />
      <styleUtils.ContentContainer>
        <styles.MainSection>
          <styles.MainImgContainer ref={mainImgRef}>
            <Link
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
              <a>
                <img alt={images[0].alt} src={images[0].src} />
              </a>
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
  ProductPage: styled(
    "div",
    {
      img: {
        borderRadius: "var(--card-border-radius)",
      },
    },
    styleUtils.pageContainer
  ),
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

    a: css(
      {
        borderRadius: "var(--card-border-radius)",
      },
      styleUtils.clickableShadow
    ),

    [styleUtils.mobile]: {
      scrollMarginTop: 60,
      width: "100%",
    },

    [styleUtils.desktop]: {
      scrollMarginTop: 115,
      width: "calc(50% - 1em)",
    },

    img: {
      objectFit: "cover",
      maxWidth: "100%",

      [styleUtils.mobile]: {
        maxHeight: 500,
      },

      [styleUtils.desktop]: {
        maxHeight: 750,
      },
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
