import { GetStaticProps } from "next";
import sanitizeHtml from "sanitize-html";

import MdRenderer from "../components/MdRenderer";
import licenses from "../resources/licenses.html";
import styleUtils from "../utils/styleUtils";

import { allPageContents } from ".contentlayer/data";
import type { PageContent } from ".contentlayer/types";

const Page = ({
  licenses,
  content,
}: {
  licenses: string;
  content: PageContent;
}) => (
  <div css={styleUtils.pageContainer}>
    <div css={styleUtils.contentContainer}>
      <MdRenderer input={content.body.raw} />
      <div
        css={styleUtils.htmlRoot}
        dangerouslySetInnerHTML={{ __html: licenses }}
      />
    </div>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const content = allPageContents.find(({ page }) => page === "about-website");
  return { props: { content, licenses: sanitizeHtml(licenses) } };
};

export default Page;
