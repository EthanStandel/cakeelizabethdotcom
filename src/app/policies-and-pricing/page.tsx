import { PoliciesAndPricingPageClient } from "./_components/PoliciesAndPricingPageClient";
import { getContent, getPageMetadataGenerator } from "../../utils/content";

const Page = async () => (
  <PoliciesAndPricingPageClient
    content={await getContent("PoliciesAndPricingPageCollection")}
  />
);

export default Page;

export const generateMetadata = getPageMetadataGenerator(
  "PoliciesAndPricingPageCollection"
);
