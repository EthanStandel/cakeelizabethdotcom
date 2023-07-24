import { getPageMetadataGenerator } from "../../../utils/content";
import { LiveContentData } from "../../../utils/LiveContentData";
import { FlavorsPage } from "./_components/FlavorsPage";
import { FlavorsPageClient } from "./_components/FlavorsPageClient";

const Page = () => (
  <LiveContentData
    component={FlavorsPage}
    clientWrapper={FlavorsPageClient}
    type="FlavorPageCollection"
  />
);

export default Page;

export const generateMetadata = getPageMetadataGenerator(
  "FlavorPageCollection"
);
