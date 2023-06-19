"use client";

import { useTina } from "tinacms/dist/react";
import { PoliciesAndPricingPageQuery } from "../../../../.tina/__generated__/types";

export const PoliciesAndPricingPageClient = ({
  query,
}: {
  query: Parameters<typeof useTina<PoliciesAndPricingPageQuery>>[0];
}) => {
  const { data } = useTina<PoliciesAndPricingPageQuery>(query);

  return (
    <code>
      <pre>{JSON.stringify(data, undefined, 2)}</pre>
    </code>
  );
};
