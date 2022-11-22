import { styled } from "@stitches/react";
import { GetStaticProps, NextPage } from "next";

import { allPageContents } from ".contentlayer/generated";
import type { PageContent } from ".contentlayer/generated/types";

import MdxRenderer from "../components/MdxRenderer";
import styleUtils from "../utils/styleUtils";

type Props = { content: Omit<PageContent, "body"> & { body: string } };

const Page: NextPage<Props> = ({ content }) => (
  <styleUtils.PageContainer>
    <styleUtils.ContentContainer>
      <styles.ContentGroup>
        <styles.BodyContent>
          <MdxRenderer input={content.body} />
        </styles.BodyContent>
        <styles.ImgContainer>
          <img
            alt={content.data.imgAlt}
            src="/resources/pages/weddings/5.jpg"
          />
        </styles.ImgContainer>
      </styles.ContentGroup>
    </styleUtils.ContentContainer>
  </styleUtils.PageContainer>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = allPageContents.find(({ page }) => page === "cake-pricing")!;
  return { props: { content: { ...content, body: content.body.raw } } };
};

const styles = Object.freeze({
  ContentGroup: styled("div", {
    display: "flex",
    gap: "2rem",
    width: "100%",
    [styleUtils.mobile]: {
      flexDirection: "column",
    },

    img: {
      borderRadius: "var(--card-border-radius)",
    },
  }),
  BodyContent: styled(
    "div",
    {
      [styleUtils.desktop]: {
        width: "60%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      },
    },
    styleUtils.htmlRoot
  ),
  ImgContainer: styled("div", {
    [styleUtils.desktop]: {
      width: "40%",
      display: "flex",
      alignItems: "center",
    },
  }),
});

export default Page;
