import client from "../../../.tina/__generated__/client";
import { FlavorsPageClient } from "./_components/FlavorsPageClient";

const Page = async () => {
  const { data, query, variables } = await client.queries.flavorPage({
    relativePath: "flavors.md",
  });

  return <FlavorsPageClient query={{ data, query, variables }} />;
};

export default Page;
