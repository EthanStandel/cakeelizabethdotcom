import { getPageMetadataGenerator } from "../../../utils/content";
import { LiveContentData } from "../../../utils/LiveContentData";
import { ContactUsPage } from "./_components/ContactUsPage";
import { ContactUsPageClient } from "./_components/ContactUsPageClient";

const Page = () => (
  <LiveContentData
    component={ContactUsPage}
    clientWrapper={ContactUsPageClient}
    type="ContactUsPageCollection"
  />
);

export default Page;

export const generateMetadata = getPageMetadataGenerator(
  "ContactUsPageCollection",
  "/contact"
);
