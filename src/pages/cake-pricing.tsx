import { GetStaticProps } from "next";

import { MdxRenderer } from "../components/ContentRenderers";
import appClasses from "../styles/pages/app.module.sass";
import classes from "../styles/pages/cake-pricing.module.sass";

import { allPageContents } from ".contentlayer/data";
import type { PageContent } from ".contentlayer/types";

const Page = ({ content }: { content: PageContent }) => (
  <div className={appClasses.pageContainer}>
    <div className={appClasses.contentContainer}>
      <div className={classes.contentGroup}>
        <div className={classes.bodyContent}>
          <MdxRenderer input={content.body} />
        </div>
        <div className={classes.imgContainer}>
          <img
            alt={content.data.imgAlt}
            src="/resources/pages/weddings/5.jpg"
          />
        </div>
      </div>
    </div>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const content = allPageContents.find(({ page }) => page === "cake-pricing");
  return { props: { content } };
};

export default Page;
