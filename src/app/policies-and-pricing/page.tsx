import client from "../../../.tina/__generated__/client";
import { PoliciesAndPricingPageClient } from "./_components/PoliciesAndPricingPageClient";

const Page = async () => {
  const { data, query, variables } =
    await client.queries.policiesAndPricingPage({
      relativePath: "policiesAndPricing.md",
    });

  return <PoliciesAndPricingPageClient query={{ data, query, variables }} />;
};

export default Page;
