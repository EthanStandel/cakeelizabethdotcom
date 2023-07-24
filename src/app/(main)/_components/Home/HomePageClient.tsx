"use client";

import { PropsOf } from "../../../../utils/PropsOf";
import { HomePage } from "./HomePage";

export const HomePageClient = (props: PropsOf<typeof HomePage>) => (
  <HomePage {...props} />
);
