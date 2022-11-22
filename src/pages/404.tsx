import React from "react";

import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";

import { allPageContents } from ".contentlayer/generated";
import type { PageContent } from ".contentlayer/generated/types";

import styleUtils from "../utils/styleUtils";

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
    <styleUtils.PageContainer>
      <styleUtils.ContentContainer>
        <h2>{content.data.text}</h2>
      </styleUtils.ContentContainer>
    </styleUtils.PageContainer>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = allPageContents.find(({ page }) => page === "404")!;

  return { props: { content } };
};

export default Page;
