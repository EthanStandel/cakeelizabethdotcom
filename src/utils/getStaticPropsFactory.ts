import { GetStaticProps } from "next";

const getStaticPropsFactory =
  <T>(content: T, pageTitle: string): GetStaticProps =>
  () => ({ props: { content, pageTitle } });

export default getStaticPropsFactory;
