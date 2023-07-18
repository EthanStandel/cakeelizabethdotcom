import { getContent, getPageMetadataGenerator } from "../utils/content";
import { HomePageClient } from "./_components/Home/HomePageClient";

const Page = async () => {
  const [content, products] = await Promise.all([
    getContent("HomePageCollection"),
    getContent("ProductPageCollectionConnection"),
  ]);
  return <HomePageClient content={content} products={products} />;
};

export default Page;

export const generateMetadata = getPageMetadataGenerator("HomePageCollection");
