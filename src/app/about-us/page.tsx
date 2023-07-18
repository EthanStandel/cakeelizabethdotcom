import { AboutUsPageClient } from "./_components/AboutUsPageClient";
import { getContent, getPageMetadataGenerator } from "../../utils/content";

const Page = async () => (
  <AboutUsPageClient content={await getContent("AboutUsPageCollection")} />
);

export default Page;

export const generateMetadata = getPageMetadataGenerator(
  "AboutUsPageCollection"
);
