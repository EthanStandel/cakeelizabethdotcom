"use client";

import Image from "next/image";
import Link from "next/link";
import { useTina } from "tinacms/dist/react";
import {
  HomePageProductsQuery,
  HomePageQuery,
} from "../../../../.tina/__generated__/types";
import { Markdown } from "../../../components/Markdown";

export const HomePageClient = ({
  homePageQuery,
  productQuery,
}: {
  homePageQuery: Parameters<typeof useTina<HomePageQuery>>[0];
  productQuery: Parameters<typeof useTina<HomePageProductsQuery>>[0];
}) => {
  const { data } = useTina<HomePageQuery>(homePageQuery);
  const { data: productData } = useTina<HomePageProductsQuery>(productQuery);

  return (
    <>
      <img
        className="w-full max-h-80 object-cover"
        src={data.homePage.heroImage}
      />
      <div className="px-4 desktop:px-28">
        <Markdown className="my-12">{data.homePage.body}</Markdown>
      </div>
      <div className="w-full px-4 desktop:px-28 grid gap-5 grid-cols-[repeat(auto-fill,minmax(320px,1fr))] justify-items-center">
        {productData.productConnection.edges
          .filter(({ node }) => !node.hidden)
          .map(({ node }) => (
            <Link
              key={node._sys.filename}
              href={`/${node._sys.filename}`}
              className="bg-white shadow hover:shadow-primary focus-visible:shadow-primary active:shadow-none transition-[box-shadow,border-color] rounded w-80 overflow-hidden text-text border border-gray-400 hover:border-primary focus-visible:border-primary active:border-primary"
            >
              <Image
                src={node.images[0].image}
                width={320}
                height={320}
                alt={node.title}
              />
              <div className="p-3 flex flex-col items-center font-semibold gap-2">
                {node.title}
                <div className="w-full rounded-full font-bold bg-primary uppercase tracking-widerest py-4 flex justify-center items-center">
                  {data.homePage.cta}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
};
