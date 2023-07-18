import { getContent, getPageMetadataGenerator } from "../../utils/content";
import { ContactUsPageClient } from "./_components/ContactUsPageClient";

const Page = async () => (
  <ContactUsPageClient content={await getContent("ContactUsPageCollection")} />
);

export default Page;

export const generateMetadata = getPageMetadataGenerator(
  "ContactUsPageCollection"
);
