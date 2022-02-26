import { css } from "@emotion/react";
import { GetStaticProps } from "next";

import MdRenderer from "../components/MdRenderer";
import styleUtils from "../utils/styleUtils";

import { allPageContents } from ".contentlayer/data";
import type { PageContent } from ".contentlayer/types";

const Page = ({ content }: { content: PageContent }) => (
  <div css={styleUtils.pageContainer}>
    <div css={styleUtils.contentContainer}>
      <div css={styles.contentGroup}>
        <div css={styles.bodyContent}>
          <MdRenderer input={content.body.raw} />
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

export const getStaticProps: GetStaticProps = async () => {
  const content = allPageContents.find(({ page }) => page === "cake-pricing");
  return { props: { content } };
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
