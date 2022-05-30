import { GetStaticProps, NextPage } from "next";

import MdxRenderer from "../components/MdxRenderer";
import styleUtils from "../utils/styleUtils";

import { allPageContents } from ".contentlayer/generated";
import type { PageContent } from ".contentlayer/generated/types";

type Props = { content: Omit<PageContent, "body"> & { body: string } };

const Page: NextPage<Props> = ({ content }) => (
  <div css={styleUtils.pageContainer}>
    <div css={[styleUtils.contentContainer, styleUtils.htmlRoot]}>
      <MdxRenderer input={content.body} />
    </div>
  </div>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = allPageContents.find(
    ({ page }) => page === "order-policies"
  )!;
  return { props: { content: { ...content, body: content.body.raw } } };
};

export default Page;
