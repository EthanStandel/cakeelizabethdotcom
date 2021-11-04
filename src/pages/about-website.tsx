import { GetStaticProps } from "next";

import type content from "../../public/resources/pages/about-website/content.json";
import contentClient from "../clients/contentClient";

type Content = typeof content;

const Page = () => <></>;

export const getStaticProps: GetStaticProps = async () => {
  const props = await contentClient.getContentForPage<Content>("about-website");
  return { props };
};

export default Page;
