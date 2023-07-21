"use client";

import { PropsOf } from "../../../utils/PropsOf";
import { PoliciesAndPricingPage } from "./PoliciesAndPricingPage";

export const PoliciesAndPricingPageClient = (
  props: PropsOf<typeof PoliciesAndPricingPage>
) => <PoliciesAndPricingPage {...props} />;
