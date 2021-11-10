import { GetStaticProps } from "next";

import type content from "../../public/resources/pages/order-policies/content.json";
import staticPageContentClientFactory from "../clients/staticPageContentClientFactory";
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
  const client = staticPageContentClientFactory("order-policies");
  const content = await client.getContent<Content>();
  const bodyContent = await client.getContent<string>("body-content.md");

  return { props: { ...content, bodyContent } };
};

export default Page;
