import { styled, css } from "@stitches/react";
import { GetStaticProps, NextPage } from "next";

import { allPageContents } from ".contentlayer/generated";
import type { PageContent } from ".contentlayer/generated/types";

import MdxRenderer from "../components/MdxRenderer";
import styleUtils from "../utils/styleUtils";

type Props = { content: PageContent };

const Page: NextPage<Props> = ({ content }) => (
  <styleUtils.PageContainer>
    <styleUtils.ContentContainer>
      <styles.StoryGroup>
        <styles.Text>
          <MdxRenderer input={content.data.owner} />
        </styles.Text>
        <styles.Image>
          <img
            alt={content.data.kristinaImgAlt}
            src="/resources/pages/about-us/kristina.jpg"
          />
          <img
            alt={content.data.kristinaEthanImgAlt}
            src="/resources/pages/about-us/kristinaethan.jpg"
          />
        </styles.Image>
      </styles.StoryGroup>
      <styles.StoryGroup>
        <styles.Image>
          <img
            alt={content.data.pattyImgAlt}
            src="/resources/pages/about-us/patty.png"
            loading="lazy"
          />
          <img
            alt={content.data.pattyGordonImgAlt}
            src="/resources/pages/about-us/pattygordon.png"
            loading="lazy"
          />
        </styles.Image>
        <styles.Text>
          <MdxRenderer input={content.data.founder} />
        </styles.Text>
      </styles.StoryGroup>
    </styleUtils.ContentContainer>
  </styleUtils.PageContainer>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = allPageContents.find(({ page }) => page === "about-us")!;

  return { props: { content } };
};

const imageAndTextStyles = css({
  display: "flex",
  gap: "1em",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

const styles = Object.freeze({
  StoryGroup: styled("div", {
    display: "flex",
    gap: "1em",
    [styleUtils.mobile]: {
      flexDirection: "column",
    },

    "&:last-child": {
      marginTop: "2em",
      [styleUtils.mobile]: {
        flexDirection: "column-reverse",
      },
    },
  }),
  Text: styled(
    "div",
    {
      width: "60%",
      [styleUtils.mobile]: {
        width: "100%",
      },
    },
    imageAndTextStyles,
    styleUtils.htmlRoot
  ),

  Image: styled(
    "div",
    {
      width: "40%",

      maxHeight: "100%",
      [styleUtils.mobile]: {
        width: "100%",
      },
      "> img": {
        width: "100%",
        borderRadius: "var(--card-border-radius)",
      },
    },
    imageAndTextStyles
  ),
});

export default Page;
