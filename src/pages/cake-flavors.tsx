import styled from "@emotion/styled";
import { GetStaticProps, NextPage } from "next";

import { FlavorGroup } from "../components/FlavorGroup";
import MdxRenderer from "../components/MdxRenderer";
import styleUtils from "../utils/styleUtils";

import { allPageContents } from ".contentlayer/generated";
import type { PageContent } from ".contentlayer/generated/types";

type Props = { content: Omit<PageContent, "body"> & { body: string } };

const Page: NextPage<Props> = ({ content }) => (
  <styleUtils.PageContainer>
    <styleUtils.ContentContainer>
      <styles.SplitGroup>
        <styles.LeftPane>
          <MdxRenderer input={content.body} />
          <FlavorGroup {...content.data.flavorGroups.cakeFlavors} />
        </styles.LeftPane>
        <styles.RightPane>
          <img
            src="/resources/pages/weddings/12.jpg"
            alt={content.data.imgAlt}
          />
        </styles.RightPane>
      </styles.SplitGroup>
      <styles.SplitGroup>
        <FlavorGroup {...content.data.flavorGroups.cakeFilling} />
        <FlavorGroup {...content.data.flavorGroups.cakeIcing} />
      </styles.SplitGroup>
    </styleUtils.ContentContainer>
  </styleUtils.PageContainer>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = allPageContents.find(({ page }) => page === "cake-flavors")!;
  return { props: { content: { ...content, body: content.body.raw } } };
};

const styles = Object.freeze({
  SplitGroup: styled.div({
    display: "flex",
    gap: "1rem",
    [styleUtils.mobile]: {
      flexDirection: "column",
    },
    img: {
      borderRadius: "var(--card-border-radius)",
      objectFit: "contain",
    },
  }),
  LeftPane: styled.div({
    width: "50%",
    [styleUtils.mobile]: {
      width: "100%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }),
  RightPane: styled.div({
    display: "flex",
    justifyContent: "center",
    width: "50%",
    [styleUtils.mobile]: {
      width: "100%",
    },
  }),
});

export default Page;
