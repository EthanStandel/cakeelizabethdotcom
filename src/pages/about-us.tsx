import { GetStaticProps } from "next";

import type content from "../../public/resources/pages/about-us/content.json";
import staticContentClient from "../clients/staticContentClient";
import MdRenderer from "../components/MdRenderer";
import classes from "../styles/pages/about-us.module.sass";
import appClasses from "../styles/pages/app.module.sass";

type Content = typeof content & { founder: string; owner: string };

const Page = (content: Content) => (
  <div className={appClasses.pageContainer}>
    <div className={appClasses.contentContainer}>
      <div className={classes.storyGroup}>
        <div className={classes.text}>
          <MdRenderer input={content.owner} />
        </div>
        <div className={classes.image}>
          <img
            alt={content.kristinaImgAlt}
            src="/resources/pages/about-us/kristina.jpg"
          />
          <img
            alt={content.kristinaEthanImgAlt}
            src="/resources/pages/about-us/kristinaethan.jpg"
          />
        </div>
      </div>
      <div className={classes.storyGroup}>
        <div className={classes.image}>
          <img
            alt={content.pattyImgAlt}
            src="/resources/pages/about-us/patty.png"
          />
          <img
            alt={content.pattyGordonImgAlt}
            src="/resources/pages/about-us/pattygordon.png"
          />
        </div>
        <div className={classes.text}>
          <MdRenderer input={content.founder} />
        </div>
      </div>
    </div>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const props = await staticContentClient.getContentForPage<Content>(
    "about-us"
  );

  const owner = await staticContentClient.getContentForPage<Content>(
    "about-us",
    "owner.md",
    "text"
  );

  const founder = await staticContentClient.getContentForPage<Content>(
    "about-us",
    "founder.md",
    "text"
  );
  return { props: { ...props, owner, founder } };
};

export default Page;
