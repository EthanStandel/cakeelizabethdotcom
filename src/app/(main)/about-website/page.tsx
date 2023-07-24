import { getPageMetadataGenerator } from "../../../utils/content";
import { LiveContentData } from "../../../utils/LiveContentData";
import { AboutWebsitePage } from "./_components/AboutWebsitePage";
import { AboutWebsitePageClient } from "./_components/AboutWebsitePageClient";

const Page = () => (
  <LiveContentData
    type="AboutThisWebsitePageCollection"
    component={AboutWebsitePage}
    clientWrapper={AboutWebsitePageClient}
  />
);

export default Page;

export const generateMetadata = getPageMetadataGenerator(
  "AboutThisWebsitePageCollection"
);
