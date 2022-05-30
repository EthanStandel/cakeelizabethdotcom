import { css } from "@emotion/react";
import { GetStaticProps, NextPage } from "next";

import MdxRenderer from "../components/MdxRenderer";
import styleUtils from "../utils/styleUtils";

import { allPageContents } from ".contentlayer/generated";
import type { PageContent } from ".contentlayer/generated/types";

type Props = { content: Omit<PageContent, "body"> & { body: string } };

const Page: NextPage<Props> = ({ content }) => (
  <div css={styleUtils.pageContainer}>
    <div css={styleUtils.contentContainer}>
      <div css={styles.contentGroup}>
        <div css={styles.bodyContent}>
          <MdxRenderer input={content.body} />
        </div>
        <div css={styles.imgContainer}>
          <img
            alt={content.data.imgAlt}
            src="/resources/pages/weddings/5.jpg"
          />
        </div>
      </div>
    </div>
  </div>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = allPageContents.find(({ page }) => page === "cake-pricing")!;
  return { props: { content: { ...content, body: content.body.raw } } };
};

const styles = Object.freeze({
  contentGroup: css`
    display: flex;
    gap: 2rem;
    width: 100%;
    ${styleUtils.mobile(
      css`
        flex-direction: column;
      `
    )}
    img {
      border-radius: var(--chakra-radii-md);
    }
  `,

  bodyContent: css`
    ${styleUtils.desktop(css`
      width: 60%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    `)}
  `,

  imgContainer: css`
    ${styleUtils.desktop(css`
      width: 40%;
      display: flex;
      align-items: center;
    `)}
  `,
});

export default Page;
