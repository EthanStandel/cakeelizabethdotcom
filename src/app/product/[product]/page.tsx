import {
  getContent,
  getContentData,
  getPageMetadataGenerator,
} from "../../../utils/content";
import { ProductPageClient } from "./_components/ProductPageClient";

const Page = async ({ params }) => (
  <ProductPageClient
    content={await getContent("ProductPageCollection", params.product)}
  />
);

export default Page;

export const generateMetadata = ({ params }) =>
  getPageMetadataGenerator("ProductPageCollection", params.product)();

export const generateStaticParams = async () => {
  const data = await getContentData("ProductPageCollectionConnection");
  return data.edges.map((page) => ({
    product: page.node._sys.filename,
  }));
};
