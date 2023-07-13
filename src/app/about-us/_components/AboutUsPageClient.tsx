"use client";

import { useTina } from "tinacms/dist/react";
import { AboutUsPageQuery } from "../../../../.tina/__generated__/types";
import { Markdown } from "../../../components/Markdown";
import { e } from "easy-tailwind";

export const AboutUsPageClient = ({
  query,
}: {
  query: Parameters<typeof useTina<AboutUsPageQuery>>[0];
}) => {
  const { data } = useTina<AboutUsPageQuery>(query);

  return (
    <div className={e("px-4 py-4 justify-center", { desktop: "px-28" })}>
      <h1 className="text-center text-5xl pb-4">{data.aboutUsPage.title}</h1>
      <section
        className={e("flex gap-8 flex-col mt-6", { desktop: "flex-row" })}
      >
        <div
          className={e("flex justify-center items-center", {
            desktop: "w-3/5",
          })}
        >
          <Markdown>{data.aboutUsPage.newOwnershipBody}</Markdown>
        </div>
        <ul
          className={e("flex flex-col gap-4 justify-center items-center", {
            desktop: "w-2/5",
          })}
        >
          {data.aboutUsPage.ownerPhotos.map(({ image }, index) => (
            <li className="rounded overflow-hidden w-full max-w-md" key={index}>
              <img className="w-full" src={image} />
            </li>
          ))}
        </ul>
      </section>
      <section
        className={e("flex flex-col gap-8 mt-6", {
          desktop: "flex-row-reverse",
        })}
      >
        <div
          className={e("flex justify-center items-center", {
            desktop: "w-3/5",
          })}
        >
          <Markdown>{data.aboutUsPage.aboutTheFounderBody}</Markdown>
        </div>
        <ul
          className={e("flex flex-col gap-4 justify-center items-center", {
            desktop: "w-2/5",
          })}
        >
          {data.aboutUsPage.founderPhotos.map(({ image }, index) => (
            <li className="rounded overflow-hidden w-full max-w-md" key={index}>
              <img className="w-full" src={image} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
