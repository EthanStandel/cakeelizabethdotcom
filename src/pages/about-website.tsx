import { GetStaticProps } from "next";

import type content from "../../public/resources/pages/about-website/content.json";
import staticContentClient from "../clients/staticContentClient";

type Content = typeof content;

const Page = () => <></>;

export const getStaticProps: GetStaticProps = async () => {
  const props = await staticContentClient.getContentForPage<Content>(
    "about-website"
  );
  return { props };
};

export default Page;
