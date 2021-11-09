import { GetStaticProps } from "next";

import type content from "../../public/resources/pages/cake-flavors/content.json";
import staticPageContentClientFactory from "../clients/staticPageContentClientFactory";
import MdRenderer from "../components/MdRenderer";
import appClasses from "../styles/pages/app.module.sass";
import classes from "../styles/pages/cake-flavors.module.sass";

type Content = typeof content & {
  bodyContent: string;
};

const Page = (content: Content) => (
  <div className={appClasses.pageContainer}>
    <div className={appClasses.contentContainer}>
      <div className={classes.splitGroup}>
        <div className={classes.leftPane}>
          <MdRenderer input={content.bodyContent} />
          <FlavorGroup {...content.flavorGroups.cakeFlavors} />
        </div>
        <div className={classes.rightPane}>
          <img src="/resources/pages/weddings/12.jpg" alt={content.imgAlt} />
        </div>
      </div>
      <div className={classes.splitGroup}>
        <FlavorGroup {...content.flavorGroups.cakeFilling} />
        <FlavorGroup {...content.flavorGroups.cakeIcing} />
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
  const client = staticPageContentClientFactory("cake-flavors");
  const content = await client.getContent<Content>();
  const bodyContent = await client.getContent<string>("body-content.md");

  return { props: { ...content, bodyContent } };
};

export default Page;
