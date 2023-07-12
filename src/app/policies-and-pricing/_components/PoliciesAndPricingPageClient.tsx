"use client";

import { useTina } from "tinacms/dist/react";
import { PoliciesAndPricingPageQuery } from "../../../../.tina/__generated__/types";
import { Markdown } from "../../../components/Markdown";
import { e } from "easy-tailwind";

export const PoliciesAndPricingPageClient = ({
  query,
}: {
  query: Parameters<typeof useTina<PoliciesAndPricingPageQuery>>[0];
}) => {
  const { data } = useTina<PoliciesAndPricingPageQuery>(query);

  return (
    <div className={e("px-4 py-4 justify-center", { desktop: "px-28" })}>
      <h1 className="text-center text-5xl pb-4">
        {data.policiesAndPricingPage.title}
      </h1>
      <Markdown>{data.policiesAndPricingPage.body}</Markdown>
    </div>
  );
};
