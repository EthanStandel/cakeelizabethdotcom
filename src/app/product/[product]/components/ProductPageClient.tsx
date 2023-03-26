"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTina } from "tinacms/dist/react";
import { ProductQuery } from "../../../../../.tina/__generated__/types";
import { CardLink } from "../../../../components/CardLink";
import { Markdown } from "../../../../components/Markdown";
import { ImageCarousel } from "./ImageCarousel";

export const ProductPageClient = ({
  query,
}: {
  query: Parameters<typeof useTina<ProductQuery>>[0];
}) => {
  const { data } = useTina<ProductQuery>(query);
  const pathname = usePathname();

  return (
    <>
      <ImageCarousel images={data.product.images.map(({ image }) => image)} />
      <div className="px-4 desktop:px-28 py-4">
        <div className="desktop:grid desktop:grid-cols-2 flex flex-col-reverse gap-4 items-center py-4">
          <CardLink
            className=""
            href={{
              pathname,
              query: {
                carouselIndex: 0,
              },
            }}
          >
            <img
              src={data.product.images[0].image}
              alt=""
              aria-hidden
              className="w-full h-full"
            />
          </CardLink>
          <div>
            <h1 className="uppercase text-center text-4xl py-4">
              {data.product.title}
            </h1>
            <Markdown>{data.product.body}</Markdown>
          </div>
        </div>
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] place-items-center">
          {data.product.images.slice(1).map(({ image }, index) => (
            <CardLink
              key={index}
              href={{
                pathname,
                query: {
                  carouselIndex: index + 1,
                },
              }}
            >
              <Image src={image} width={150} height={150} alt="" aria-hidden />
            </CardLink>
          ))}
        </div>
      </div>
    </>
  );
};
