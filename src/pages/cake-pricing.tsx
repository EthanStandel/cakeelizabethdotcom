import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { GetStaticProps, NextPage } from "next";

import MdxRenderer from "../components/MdxRenderer";
import styleUtils from "../utils/styleUtils";

import { allPageContents } from ".contentlayer/generated";
import type { PageContent } from ".contentlayer/generated/types";

type Props = { content: Omit<PageContent, "body"> & { body: string } };

const Page: NextPage<Props> = ({ content }) => (
  <div css={styleUtils.pageContainer}>
    <div css={styleUtils.contentContainer}>
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
    </div>
  </div>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = allPageContents.find(({ page }) => page === "cake-pricing")!;
  return { props: { content: { ...content, body: content.body.raw } } };
};

const styles = Object.freeze({
  ContentGroup: styled.div({
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
  BodyContent: styled.div({
    "&": styleUtils.htmlRoot,
    [styleUtils.desktop]: {
      width: "60%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
  }),
  ImgContainer: styled.div({
    [styleUtils.desktop]: {
      width: "40%",
      display: "flex",
      alignItems: "center",
    },
  }),
});

export default Page;
