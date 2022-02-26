import { css } from "@emotion/react";
import { GetStaticProps } from "next";

import MdRenderer from "../components/MdRenderer";
import styleUtils from "../utils/styleUtils";

import { allPageContents } from ".contentlayer/data";
import type { PageContent } from ".contentlayer/types";

const Page = ({ content }: { content: PageContent }) => (
  <div css={styleUtils.pageContainer}>
    <div css={styleUtils.contentContainer}>
      <div css={styles.splitGroup}>
        <div css={styles.leftPane}>
          <MdRenderer input={content.body.raw} />
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

const FlavorGroup = ({
  name,
  flavors,
}: {
  name: string;
  flavors: Array<string>;
}) => (
  <div css={styles.flavorGroup}>
    <h2>{name}</h2>
    <ul css={styles.flavorList}>
      {flavors.map((flavor) => (
        <li key={flavor}>{flavor}</li>
      ))}
    </ul>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const content = allPageContents.find(({ page }) => page === "cake-flavors");
  return { props: { content } };
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

  flavorGroup: css`
    ${styleUtils.shadow}
    margin-top: 2em;
    width: 100%;
    padding: 2em;
    border-radius: var(--chakra-radii-md);
  `,
  flavorList: css`
    display: grid;
    ${styleUtils.desktop(
      css`
        grid-template-columns: repeat(2, 1fr);
      `
    )}
    > li {
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      list-style-type: none;
      ${styleUtils.mobile(css`
        &:nth-child(2n) {
          background: var(--primary-color);
        }
      `)}
      ${styleUtils.desktop(css`
        &:nth-child(4n-3),
        &:nth-child(4n) {
          background: var(--primary-color);
        }
      `)}
    }
  `,
});

export default Page;
