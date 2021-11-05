import { useRef, useState } from "react";

import { GetStaticProps, GetStaticPaths } from "next";
import Image from "next/image";

import staticContentClient from "../clients/staticContentClient";
import MdRenderer from "../components/MdRenderer";
import appClasses from "../styles/pages/app.module.scss";
import classes from "../styles/pages/product.module.scss";

interface ProductContent {
  productTitle: string;
}
interface ProductPageProps {
  content: ProductContent;
  images: Array<string>;
  productDetailsMd: string;
}

const Page = ({ content, images, productDetailsMd }: ProductPageProps) => {
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
              alt={`Selected ${content.productTitle} example`}
              src={images[displayImg]}
            />
          </div>
          <div className={classes.spielContainer}>
            <MdRenderer input={productDetailsMd} />
          </div>
        </div>
        <div className={classes.imagesContainer}>
          {images.map((url, index) => (
            <button key={url} onClick={() => setDisplayImg(index)}>
              <Image
                alt={`${content.productTitle} exmaple`}
                width={150}
                height={150}
                src={url}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    if (!params?.product || typeof params.product !== "string") {
      throw new Error("Not a product page");
    }
    const content = await staticContentClient.getContentForPage<ProductContent>(
      params.product
    );

    const productDetailsMd =
      await staticContentClient.getContentForPage<string>(
        params.product,
        "product-details.md",
        "text"
      );

    const images = await staticContentClient.getImagesForPage(params.product);

    return {
      props: {
        content,
        productDetailsMd,
        images,
        pageTitle: content.productTitle,
      },
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
