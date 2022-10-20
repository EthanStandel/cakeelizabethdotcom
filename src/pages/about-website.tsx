import { GetStaticProps, NextPage } from "next";
import sanitizeHtml from "sanitize-html";

import MdxRenderer from "../components/MdxRenderer";
import licenses from "../resources/licenses.html";
import styleUtils from "../utils/styleUtils";

import { allPageContents } from ".contentlayer/generated";
import type { PageContent } from ".contentlayer/generated/types";

type Props = {
  licenses: string;
  content: Omit<PageContent, "body"> & { body: string };
};

const Page: NextPage<Props> = ({ licenses, content }) => (
  <styleUtils.PageContainer>
    <styleUtils.ContentContainer css={styleUtils.htmlRoot}>
      <MdxRenderer input={content.body} />
      <styleUtils.HtmlRoot dangerouslySetInnerHTML={{ __html: licenses }} />
    </styleUtils.ContentContainer>
  </styleUtils.PageContainer>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = allPageContents.find(({ page }) => page === "about-website")!;
  return {
    props: {
      content: { ...content, body: content.body.raw },
      licenses: sanitizeHtml(licenses),
    },
  };
};

export default Page;
