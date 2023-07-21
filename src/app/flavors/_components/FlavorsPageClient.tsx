"use client";

import { PropsOf } from "../../../utils/PropsOf";
import { FlavorsPage } from "./FlavorsPage";

export const FlavorsPageClient = (props: PropsOf<typeof FlavorsPage>) => (
  <FlavorsPage {...props} />
);
