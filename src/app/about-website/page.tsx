import { AboutWebsitePageClient } from "./_components/AboutWebsitePageClient";
import { getContent, getPageMetadataGenerator } from "../../utils/content";

const Page = async () => (
  <AboutWebsitePageClient
    content={await getContent("AboutThisWebsitePageCollection")}
  />
);

export default Page;

export const generateMetadata = getPageMetadataGenerator(
  "AboutThisWebsitePageCollection"
);
