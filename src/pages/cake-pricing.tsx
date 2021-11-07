import { GetStaticProps } from "next";

import type content from "../../public/resources/pages/cake-pricing/content.json";
import staticContentClient from "../clients/staticContentClient";
import MdRenderer from "../components/MdRenderer";
import appClasses from "../styles/pages/app.module.sass";
import classes from "../styles/pages/cake-pricing.module.sass";

type Content = typeof content & { bodyContent: string };

const Page = ({ bodyContent, imgAlt }: Content) => (
  <div className={appClasses.pageContainer}>
    <div className={appClasses.contentContainer}>
      <div className={classes.contentGroup}>
        <div className={classes.bodyContent}>
          <MdRenderer input={bodyContent} />
        </div>
        <div className={classes.imgContainer}>
          <img alt={imgAlt} src="/resources/pages/weddings/5.jpg" />
        </div>
      </div>
    </div>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const props = await staticContentClient.getContentForPage<Content>(
    "cake-pricing"
  );

  const bodyContent = await staticContentClient.getContentForPage<Content>(
    "cake-pricing",
    "body-content.md",
    "text"
  );
  return { props: { ...props, bodyContent } };
};

export default Page;
