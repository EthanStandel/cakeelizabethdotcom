import client from "../../../.tina/__generated__/client";
import { ContactUsPageClient } from "./_components/ContactUsPageClient";

const Page = async () => {
  const { data, query, variables } = await client.queries.contactUsPage({
    relativePath: "contactUsPage.md",
  });

  return <ContactUsPageClient query={{ data, query, variables }} />;
};

export default Page;
