import { useRef, useState } from "react";

import { GetStaticProps, GetStaticPaths } from "next";
import Image from "next/image";

import { MdRenderer, MdxRenderer } from "../components/ContentRenderers";
import appClasses from "../styles/pages/app.module.sass";
import classes from "../styles/pages/product.module.sass";

import { allPageContents, allImageManifests } from ".contentlayer/data";
import type { PageContent } from ".contentlayer/types";

interface ProductPageProps {
  content: PageContent;
  images: Array<string>;
}

const Page = ({ content, images }: ProductPageProps) => {
  const [displayImg, _setDisplayImg] = useState(0);
  const mainImgRef = useRef<null | HTMLImageElement>(null);
  const setDisplayImg = (index: number) => {
    _setDisplayImg(index);
    mainImgRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  };

  return (
    <div className={`${appClasses.pageContainer} ${classes.root}`}>
      <div className={appClasses.contentContainer}>
        <div className={classes.mainSection}>
          <div ref={mainImgRef} className={classes.mainImgContainer}>
            <img
              alt={`Selected ${content.pageTitle} example`}
              src={images[displayImg]}
            />
          </div>
          <div className={classes.spielContainer}>
            <MdxRenderer input={content.body} />
          </div>
        </div>
        <div className={classes.imagesContainer}>
          {images.map((url, index) => (
            <button key={url} onClick={() => setDisplayImg(index)}>
              <Image
                alt={`${content.pageTitle} exmaple`}
                width={150}
                height={150}
                src={url}
              />
            </button>
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    if (!params?.product || typeof params.product !== "string") {
      throw new Error("Not a product page");
    }

    const content = allPageContents.find(({ page }) => page === params.product);
    const images = allImageManifests.find(
      ({ page }) => page === params.product
    )?.items;

    return {
      props: { content, images },
    };
  } catch {
    return { notFound: true };
  }
};

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [
    { params: { product: "birthday-cakes" } },
    { params: { product: "cake-pops-cookies" } },
    { params: { product: "childrens-cake" } },
    { params: { product: "cupcakes" } },
    { params: { product: "dessert-bars" } },
    { params: { product: "holiday-cakes" } },
    { params: { product: "naughty-cakes" } },
    { params: { product: "religious-cakes" } },
    { params: { product: "sculpted-cakes" } },
    { params: { product: "shower-cakes" } },
    { params: { product: "special-occasion-cakes" } },
    { params: { product: "weddings" } },
  ],
  fallback: false,
});

export default Page;
