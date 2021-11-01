import { useRef, useState } from "react";

import { GetServerSideProps } from "next";
import Image from "next/image";

import contentClient from "../clients/contentClient";
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    if (!params?.product || typeof params.product !== "string") {
      throw new Error("Not a product page");
    }
    const content = await contentClient.getContentForPage<ProductContent>(
      params.product
    );

    const productDetailsMd = await contentClient.getContentForPage<string>(
      params.product,
      "product-details.md",
      "text"
    );

    const images = await contentClient.getImagesForPage(params.product);

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

export default Page;
