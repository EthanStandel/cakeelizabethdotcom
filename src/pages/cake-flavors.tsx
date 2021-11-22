import { GetStaticProps } from "next";

import MdRenderer from "../components/MdRenderer";
import appClasses from "../styles/pages/app.module.sass";
import classes from "../styles/pages/cake-flavors.module.sass";

import { allPageContents } from ".contentlayer/data";
import type { PageContent } from ".contentlayer/types";

const Page = ({ content }: { content: PageContent }) => (
  <div className={appClasses.pageContainer}>
    <div className={appClasses.contentContainer}>
      <div className={classes.splitGroup}>
        <div className={classes.leftPane}>
          <MdRenderer input={content.body.raw} />
          <FlavorGroup {...content.data.flavorGroups.cakeFlavors} />
        </div>
        <div className={classes.rightPane}>
          <img
            src="/resources/pages/weddings/12.jpg"
            alt={content.data.imgAlt}
          />
        </div>
      </div>
      <div className={classes.splitGroup}>
        <FlavorGroup {...content.data.flavorGroups.cakeFilling} />
        <FlavorGroup {...content.data.flavorGroups.cakeIcing} />
      </div>
    </div>
  </div>
);

const FlavorGroup = ({
  name,
  flavors,
}: {
  name: string;
  flavors: Array<string>;
}) => (
  <div className={classes.flavorGroup}>
    <h2>{name}</h2>
    <ul className={classes.flavorList}>
      {flavors.map((flavor) => (
        <li key={flavor}>{flavor}</li>
      ))}
    </ul>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const content = allPageContents.find(({ page }) => page === "cake-flavors");
  return { props: { content } };
};

export default Page;
