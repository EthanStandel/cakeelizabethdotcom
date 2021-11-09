import { useEffect } from "react";

import { GetStaticProps } from "next";
import { useRouter } from "next/dist/client/router";

import type content from "../../public/resources/pages/404/content.json";
import staticPageContentClientFactory from "../clients/staticPageContentClientFactory";
import appClasses from "../styles/pages/app.module.sass";

type Content = typeof content;

const Page = (content: Content) => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  });

  // Adding content just in case someone has JS turned off
  // Can't use true redirect because SSR is not allowed for 404 component
  // and getStaticProps can't return redirect
  return (
    <div className={appClasses.pageContainer}>
      <div className={appClasses.contentContainer}>
        <h2>{content.text}</h2>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const client = staticPageContentClientFactory("404");
  const content = await client.getContent<Content>();

  return { props: { ...content } };
};

export default Page;
