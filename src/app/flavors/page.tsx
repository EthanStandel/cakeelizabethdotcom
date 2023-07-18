import { getContent, getPageMetadataGenerator } from "../../utils/content";
import { FlavorsPageClient } from "./_components/FlavorsPageClient";

const Page = async () => (
  <FlavorsPageClient content={await getContent("FlavorPageCollection")} />
);

export default Page;

export const generateMetadata = getPageMetadataGenerator(
  "FlavorPageCollection"
);
