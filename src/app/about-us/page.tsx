import { AboutUsPage } from "./_components/AboutUsPage";
import { getPageMetadataGenerator } from "../../utils/content";
import { LiveContentData } from "../../utils/LiveContentData";
import { AboutUsPageClient } from "./_components/AboutUsPageClient";

const Page = async () => (
  <LiveContentData
    type="AboutUsPageCollection"
    server={AboutUsPage}
    client={AboutUsPageClient}
  />
);

export default Page;

export const generateMetadata = getPageMetadataGenerator(
  "AboutUsPageCollection"
);
