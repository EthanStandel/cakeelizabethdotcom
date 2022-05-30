import { FC } from "react";

import { css } from "@emotion/react";

import styleUtils from "src/utils/styleUtils";

export const FlavorGroup: FC<{
  title: string;
  flavors?: Array<string>;
  children?: string;
  leftAlign?: boolean;
  verticalOnly?: boolean;
}> = ({ title, flavors, children, leftAlign, verticalOnly }) => (
  <div
    css={[
      styles.flavorGroup,
      !verticalOnly && styles.desktopGrid,
      leftAlign && styles.leftAlign,
    ]}
  >
    {title && <h2>{title}</h2>}
    {flavors && (
      <ul>
        {flavors.map((flavor) => (
          <li key={flavor}>{flavor}</li>
        ))}
      </ul>
    )}
    {children}
  </div>
);

const styles = {
  desktopGrid: styleUtils.desktop(css`
    ul {
      grid-template-columns: repeat(2, 1fr);

      > li {
        &:nth-child(2n) {
          background: unset;
          margin-left: unset;
          margin-right: unset;
          padding-left: unset;
          padding-right: unset;
        }
        &:nth-child(4n-3),
        &:nth-child(4n) {
          background: var(--primary-color);
        }
        &:nth-child(2n-1) {
          margin-left: -2em;
          padding-left: 2em;
          padding-right: 1em;
        }
        &:nth-child(2n) {
          margin-right: -2em;
          padding-right: 2em;
          padding-left: 1em;
        }
      }
    }
  `),
  leftAlign: css`
    ul > li {
      display: block;
      text-align: left;
    }
  `,
  flavorGroup: css`
    ${styleUtils.shadow}
    margin-top: 2em;
    width: 100%;
    padding: 2em;
    border-radius: var(--chakra-radii-md);

    ul {
      display: grid;
      > li {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        list-style-type: none;
        &:nth-child(2n) {
          background: var(--primary-color);
          margin-left: -2em;
          margin-right: -2em;
          padding-left: 2em;
          padding-right: 2em;
        }
      }
    }
  `,
};
