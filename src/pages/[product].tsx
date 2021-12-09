import React from "react";

import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import ImageCarouselOverlay, {
  imageCarouselRouting,
} from "../components/ImageCarouselOverlay";
import MdRenderer from "../components/MdRenderer";
import appClasses from "../styles/pages/app.module.sass";
import classes from "../styles/pages/product.module.sass";

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
    <div className={`${appClasses.pageContainer} ${classes.root}`}>
      <ImageCarouselOverlay images={images} />
      <div className={appClasses.contentContainer}>
        <div className={classes.mainSection}>
          <div ref={mainImgRef} className={classes.mainImgContainer}>
            <img alt={images[0].alt} src={images[0].src} />
          </div>
          <div className={classes.spielContainer}>
            <MdRenderer input={content.body.raw} />
          </div>
        </div>
        <div className={classes.imagesContainer}>
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
          <div className={classes.extendedInfo}>
            <MdRenderer input={content.data.extendedContent} />
          </div>
        )}
      </div>
    </div>
  );
};

// This could be getStaticProps w/ getStaticPaths but it would break the image carousel when JS is turned off
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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

export default Page;
