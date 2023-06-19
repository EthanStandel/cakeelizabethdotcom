"use client";

import { useTina } from "tinacms/dist/react";
import { ContactUsPageQuery } from "../../../../.tina/__generated__/types";

export const ContactUsPageClient = ({
  query,
}: {
  query: Parameters<typeof useTina<ContactUsPageQuery>>[0];
}) => {
  const { data } = useTina<ContactUsPageQuery>(query);

  return (
    <code>
      <pre>{JSON.stringify(data, undefined, 2)}</pre>
    </code>
  );
};
