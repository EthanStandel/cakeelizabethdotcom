import React from "react";

import { GetStaticProps } from "next";
import { useRouter } from "next/router";

import appClasses from "../styles/pages/app.module.sass";

import { allPageContents } from ".contentlayer/data";
import type { PageContent } from ".contentlayer/types";

const Page = ({ content }: { content: PageContent }) => {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/");
  });

  // Adding content just in case someone has JS turned off
  // Can't use true redirect because SSR is not allowed for 404 component
  // and getStaticProps can't return redirect
  return (
    <div className={appClasses.pageContainer}>
      <div className={appClasses.contentContainer}>
        <h2>{content.data.text}</h2>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const content = allPageContents.find(({ page }) => page === "404");

  return { props: { content } };
};

export default Page;
