import { css } from "@emotion/react";
import { GetStaticProps, NextPage } from "next";

import { FlavorGroup } from "../components/FlavorGroup";
import MdRenderer from "../components/MdRenderer";
import styleUtils from "../utils/styleUtils";

import { allPageContents } from ".contentlayer/generated";
import type { PageContent } from ".contentlayer/generated/types";

type Props = { content: Omit<PageContent, "body"> & { body: string } };

const Page: NextPage<Props> = ({ content }) => (
  <div css={styleUtils.pageContainer}>
    <div css={styleUtils.contentContainer}>
      <div css={styles.splitGroup}>
        <div css={styles.leftPane}>
          <MdRenderer input={content.body} />
          <FlavorGroup {...content.data.flavorGroups.cakeFlavors} />
        </div>
        <div css={styles.rightPane}>
          <img
            src="/resources/pages/weddings/12.jpg"
            alt={content.data.imgAlt}
          />
        </div>
      </div>
      <div css={styles.splitGroup}>
        <FlavorGroup {...content.data.flavorGroups.cakeFilling} />
        <FlavorGroup {...content.data.flavorGroups.cakeIcing} />
      </div>
    </div>
  </div>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = allPageContents.find(({ page }) => page === "cake-flavors")!;
  return { props: { content: { ...content, body: content.body.raw } } };
};

const styles = Object.freeze({
  splitGroup: css`
    display: flex;
    gap: 1rem;
    ${styleUtils.mobile(
      css`
        flex-direction: column;
      `
    )}

    img {
      border-radius: var(--chakra-radii-md);
      object-fit: contain;
    }
  `,

  leftPane: css`
    width: 50%;
    ${styleUtils.mobile(
      css`
        width: 100%;
      `
    )}
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,

  rightPane: css`
    display: flex;
    justify-content: center;
    width: 50%;
    ${styleUtils.mobile(
      css`
        width: 100%;
      `
    )}
  `,
});

export default Page;
