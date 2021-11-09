import { GetStaticProps } from "next";
import sanitizeHtml from "sanitize-html";

import type content from "../../public/resources/pages/about-website/content.json";
import staticPageContentClientFactory from "../clients/staticPageContentClientFactory";
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
  const client = staticPageContentClientFactory("about-website");
  const props = await client.getContent<Content>();
  const bodyContent = await client.getContent<string>("body-content.md");
  // sanitze because this comes from a generator package and comes with bleh styles
  const licenses = sanitizeHtml(
    await client.getContent<string>("licenses.html")
  );

  return { props: { ...props, licenses, bodyContent } };
};

export default Page;
