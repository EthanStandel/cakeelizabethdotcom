import { getPageMetadataGenerator } from "../utils/content";
import { LiveContentData } from "../utils/LiveContentData";
import { HomePage } from "./_components/Home/HomePage";
import { HomePageClient } from "./_components/Home/HomePageClient";

const Page = () => (
  <LiveContentData
    component={HomePage}
    clientWrapper={HomePageClient}
    type={["HomePageCollection", "ProductPageCollectionConnection"] as const}
  />
);

export default Page;

export const generateMetadata = getPageMetadataGenerator("HomePageCollection");
