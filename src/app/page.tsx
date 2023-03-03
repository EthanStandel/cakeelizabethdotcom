import client from "../../.tina/__generated__/client";
import { HomePageClient } from "./components/Home/HomePageClient";

const Page = async () => {
  const { data, query, variables } = await client.queries.homePage({
    relativePath: "home-page.md",
  });
  const {
    data: productData,
    query: productQuery,
    variables: productVariables,
  } = await client.queries.homePageProducts();

  return (
    <HomePageClient
      homePageQuery={{ data, query, variables }}
      productQuery={{
        data: productData,
        query: productQuery,
        variables: productVariables,
      }}
    />
  );
};

export default Page;
