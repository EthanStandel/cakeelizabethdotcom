"use client";

import { PropsOf } from "../../../../../utils/PropsOf";
import { ProductPage } from "./ProductPage";

export const ProductPageClient = (props: PropsOf<typeof ProductPage>) => (
  <ProductPage {...props} />
);
