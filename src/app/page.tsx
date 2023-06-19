import client from "../../.tina/__generated__/client";
import { HomePageClient } from "./_components/Home/HomePageClient";

const Page = async () => {
  const { data, query, variables } = await client.queries.homePageData({
    relativePath: "home-page.md",
  });

  return <HomePageClient homePageQuery={{ data, query, variables }} />;
};

export default Page;
