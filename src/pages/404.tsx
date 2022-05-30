import React from "react";

import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";

import styleUtils from "../utils/styleUtils";

import { allPageContents } from ".contentlayer/generated";
import type { PageContent } from ".contentlayer/generated/types";

type Props = { content: PageContent };

const Page: NextPage<Props> = ({ content }) => {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/");
  });

  // Adding content just in case someone has JS turned off
  // Can't use true redirect because SSR is not allowed for 404 component
  // and getStaticProps can't return redirect
  return (
    <div css={styleUtils.pageContainer}>
      <div css={styleUtils.contentContainer}>
        <h2>{content.data.text}</h2>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = allPageContents.find(({ page }) => page === "404")!;

  return { props: { content } };
};

export default Page;
