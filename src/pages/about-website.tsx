import { GetStaticProps } from "next";
import sanitizeHtml from "sanitize-html";

import { MdxRenderer } from "../components/ContentRenderers";
import licenses from "../resources/licenses.html";
import appClasses from "../styles/pages/app.module.sass";

import { allPageContents } from ".contentlayer/data";
import type { PageContent } from ".contentlayer/types";

const Page = ({
  licenses,
  content,
}: {
  licenses: string;
  content: PageContent;
}) => (
  <div className={appClasses.pageContainer}>
    <div className={appClasses.contentContainer}>
      <MdxRenderer input={content.body} />
      <div
        className={appClasses.htmlRoot}
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
