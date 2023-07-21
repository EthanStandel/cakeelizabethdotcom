import {
  getContentData,
  getPageMetadataGenerator,
} from "../../../utils/content";
import { LiveContentData } from "../../../utils/LiveContentData";
import { ProductPage } from "./_components/ProductPage";
import { ProductPageClient } from "./_components/ProductPageClient";

const Page = ({ params }) => (
  <LiveContentData
    component={ProductPage}
    clientWrapper={ProductPageClient}
    slug={params.product}
    type="ProductPageCollection"
    pathname={`/product/${params.product}`}
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
