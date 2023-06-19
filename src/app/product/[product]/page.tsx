import client from "../../../../.tina/__generated__/client";
import { ProductPageClient } from "./_components/ProductPageClient";

const Page = async ({ params }) => {
  const { data, query, variables } = await client.queries.product({
    relativePath: `${params.product}.md`,
  });

  return <ProductPageClient query={{ data, query, variables }} />;
};

export default Page;
