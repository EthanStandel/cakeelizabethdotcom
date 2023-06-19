"use client";

import { useTina } from "tinacms/dist/react";
import { AboutUsPageQuery } from "../../../../.tina/__generated__/types";

export const AboutUsPageClient = ({
  query,
}: {
  query: Parameters<typeof useTina<AboutUsPageQuery>>[0];
}) => {
  const { data } = useTina<AboutUsPageQuery>(query);

  return (
    <code>
      <pre>{JSON.stringify(data, undefined, 2)}</pre>
    </code>
  );
};
