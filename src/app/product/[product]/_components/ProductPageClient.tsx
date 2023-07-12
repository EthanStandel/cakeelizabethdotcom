"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { useTina } from "tinacms/dist/react";
import { ProductQuery } from "../../../../../.tina/__generated__/types";
import { CardLink } from "../../../../components/CardLink";
import { Markdown } from "../../../../components/Markdown";
import { ImageCarousel } from "./ImageCarousel";
import { e } from "easy-tailwind";

export const ProductPageClient = ({
  query,
}: {
  query: Parameters<typeof useTina<ProductQuery>>[0];
}) => {
  const { data } = useTina<ProductQuery>(query);
  const pathname = usePathname();

  return (
    <>
      <Suspense fallback={null}>
        <ImageCarousel images={data.product.images.map(({ image }) => image)} />
      </Suspense>
      <div className={e("px-4 py-4", { desktop: "px-28" })}>
        <div
          className={e("flex flex-col-reverse gap-4 items-center py-4", {
            desktop: "grid grid-cols-2",
          })}
        >
          <CardLink
            className=""
            scroll={false}
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
              scroll={false}
              href={{
                pathname,
                query: {
                  carouselIndex: index + 1,
                },
              }}
            >
              <Image
                src={image}
                width={150}
                height={150}
                alt=""
                className="w-[150px] h-[150px]"
                aria-hidden
              />
            </CardLink>
          ))}
        </div>
      </div>
    </>
  );
};
