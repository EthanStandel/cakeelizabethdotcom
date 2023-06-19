"use client";

import { useTina } from "tinacms/dist/react";
import { AboutThisWebsiteQuery } from "../../../../.tina/__generated__/types";

export const AboutWebsitePageClient = ({
  query,
}: {
  query: Parameters<typeof useTina<AboutThisWebsiteQuery>>[0];
}) => {
  const { data } = useTina<AboutThisWebsiteQuery>(query);

  return (
    <code>
      <pre>{JSON.stringify(data, undefined, 2)}</pre>
    </code>
  );
};
