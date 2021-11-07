import { GetStaticProps } from "next";
import sanitizeHtml from "sanitize-html";

import type content from "../../public/resources/pages/about-website/content.json";
import staticContentClient from "../clients/staticContentClient";
import MdRenderer from "../components/MdRenderer";
import appClasses from "../styles/pages/app.module.sass";

type Content = typeof content & { licenses: string; bodyContent: string };

const Page = ({ licenses, bodyContent }: Content) => (
  <div className={appClasses.pageContainer}>
    <div className={appClasses.contentContainer}>
      <MdRenderer input={bodyContent} />
      <div
        className={appClasses.htmlRoot}
        dangerouslySetInnerHTML={{ __html: licenses }}
      />
    </div>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const props = await staticContentClient.getContentForPage<Content>(
    "about-website"
  );

  // sanitze because this comes from a generator package and comes with bleh styles
  const bodyContent = await staticContentClient.getContentForPage<string>(
    "about-website",
    "body-content.md",
    "text"
  );

  // sanitze because this comes from a generator package and comes with bleh styles
  const licenses = sanitizeHtml(
    await staticContentClient.getContentForPage<string>(
      "about-website",
      "licenses.html",
      "text"
    )
  );
  return { props: { ...props, licenses, bodyContent } };
};

export default Page;
