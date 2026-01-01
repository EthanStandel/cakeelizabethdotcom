import { Metadata } from "next";
import {
  getContentData,
  getPageMetadataGenerator,
} from "../../../../utils/content";
import { LiveContentData } from "../../../../utils/LiveContentData";
import { ProductPage } from "./_components/ProductPage";
import { ProductPageClient } from "./_components/ProductPageClient";

const Page = async (props: { params: Promise<Record<string, string>> }) => {
  const params = await props.params;

  return (
    <LiveContentData
      component={ProductPage}
      clientWrapper={ProductPageClient}
      slug={params.product}
      type="ProductPageCollection"
      pathname={`/product/${params.product}`}
    />
  );
};

export default Page;

export const generateMetadata = async (props: {
  params: Promise<Record<string, string>>;
}): Promise<Metadata> => {
  const params = await props.params;
  return getPageMetadataGenerator(
    "ProductPageCollection",
    "/product",
    params.product
  )();
};

export const generateStaticParams = async () => {
  const data = await getContentData("ProductPageCollectionConnection");
  return data.edges.map((page) => ({
    product: page.node._sys.filename,
  }));
};
