import { GetStaticProps } from "next";

import type content from "../../public/resources/pages/delivery-and-order-policies/content.json";
import staticContentClient from "../clients/staticContentClient";
import MdRenderer from "../components/MdRenderer";
import appClasses from "../styles/pages/app.module.sass";

type Content = typeof content & { bodyContent: string };

const Page = ({ bodyContent }: Content) => (
  <div className={appClasses.pageContainer}>
    <div className={appClasses.contentContainer}>
      <MdRenderer input={bodyContent} />
    </div>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const props = await staticContentClient.getContentForPage<Content>(
    "delivery-and-order-policies"
  );

  const bodyContent = await staticContentClient.getContentForPage<Content>(
    "delivery-and-order-policies",
    "body-content.md",
    "text"
  );
  return { props: { ...props, bodyContent } };
};

export default Page;
