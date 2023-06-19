import client from "../../../.tina/__generated__/client";
import { AboutWebsitePageClient } from "./_components/AboutWebsitePageClient";

const Page = async () => {
  const { data, query, variables } = await client.queries.aboutThisWebsite({
    relativePath: "aboutThisWebsite.md",
  });

  return <AboutWebsitePageClient query={{ data, query, variables }} />;
};

export default Page;
