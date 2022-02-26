import { GetStaticProps } from "next";

import MdRenderer from "../components/MdRenderer";
import styleUtils from "../utils/styleUtils";

import { allPageContents } from ".contentlayer/data";
import type { PageContent } from ".contentlayer/types";

const Page = ({ content }: { content: PageContent }) => (
  <div css={styleUtils.pageContainer}>
    <div css={styleUtils.contentContainer}>
      <MdRenderer input={content.body.raw} />
    </div>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const content = allPageContents.find(({ page }) => page === "order-policies");
  return { props: { content } };
};

export default Page;
