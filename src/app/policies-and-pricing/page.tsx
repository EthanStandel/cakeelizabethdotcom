import { PoliciesAndPricingPage } from "./_components/PoliciesAndPricingPage";
import { getPageMetadataGenerator } from "../../utils/content";
import { LiveContentData } from "../../utils/LiveContentData";
import { PoliciesAndPricingPageClient } from "./_components/PoliciesAndPricingPageClient";

const Page = async () => (
  <LiveContentData
    component={PoliciesAndPricingPage}
    clientWrapper={PoliciesAndPricingPageClient}
    type="PoliciesAndPricingPageCollection"
  />
);

export default Page;

export const generateMetadata = getPageMetadataGenerator(
  "PoliciesAndPricingPageCollection"
);
