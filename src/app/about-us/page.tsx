import client from "../../../.tina/__generated__/client";
import { AboutUsPageClient } from "./_components/AboutUsPageClient";

const Page = async () => {
  const { data, query, variables } = await client.queries.aboutUsPage({
    relativePath: "aboutUs.md",
  });

  return <AboutUsPageClient query={{ data, query, variables }} />;
};

export default Page;
