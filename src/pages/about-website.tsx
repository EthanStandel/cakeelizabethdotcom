import { GetStaticProps, NextPage } from "next";
import sanitizeHtml from "sanitize-html";

import MdRenderer from "../components/MdRenderer";
import licenses from "../resources/licenses.html";
import styleUtils from "../utils/styleUtils";

import { allPageContents } from ".contentlayer/generated";
import type { PageContent } from ".contentlayer/generated/types";

type Props = {
  licenses: string;
  content: Omit<PageContent, "body"> & { body: string };
};

const Page: NextPage<Props> = ({ licenses, content }) => (
  <div css={styleUtils.pageContainer}>
    <div css={styleUtils.contentContainer}>
      <MdRenderer input={content.body} />
      <div
        css={styleUtils.htmlRoot}
        dangerouslySetInnerHTML={{ __html: licenses }}
      />
    </div>
  </div>
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
