"use client";

import { useTina } from "tinacms/dist/react";
import { ProductQuery } from "../../../../../.tina/__generated__/types";

export const ProductPageClient = ({
  query,
}: {
  query: Parameters<typeof useTina<ProductQuery>>[0];
}) => {
  const { data } = useTina<ProductQuery>(query);

  return <>{data.product.title}</>;
};
