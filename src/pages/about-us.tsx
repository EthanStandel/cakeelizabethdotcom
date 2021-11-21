import { GetStaticProps } from "next";

import { MdRenderer } from "../components/ContentRenderers";
import classes from "../styles/pages/about-us.module.sass";
import appClasses from "../styles/pages/app.module.sass";

import { allPageContents } from ".contentlayer/data";
import type { PageContent } from ".contentlayer/types";

const Page = ({ content }: { content: PageContent }) => (
  <div className={appClasses.pageContainer}>
    <div className={appClasses.contentContainer}>
      <div className={classes.storyGroup}>
        <div className={classes.text}>
          <MdRenderer input={content.data.owner} />
        </div>
        <div className={classes.image}>
          <img
            alt={content.data.kristinaImgAlt}
            src="/resources/pages/about-us/kristina.jpg"
          />
          <img
            alt={content.data.kristinaEthanImgAlt}
            src="/resources/pages/about-us/kristinaethan.jpg"
          />
        </div>
      </div>
      <div className={classes.storyGroup}>
        <div className={classes.image}>
          <img
            alt={content.data.pattyImgAlt}
            src="/resources/pages/about-us/patty.png"
          />
          <img
            alt={content.data.pattyGordonImgAlt}
            src="/resources/pages/about-us/pattygordon.png"
          />
        </div>
        <div className={classes.text}>
          <MdRenderer input={content.data.founder} />
        </div>
      </div>
    </div>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const content = allPageContents.find(({ page }) => page === "about-us");

  return { props: { content } };
};

export default Page;
