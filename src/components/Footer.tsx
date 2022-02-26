import { css } from "@emotion/react";
import { keyword } from "color-convert";

import classes from "../styles/components/Footer.module.sass";
import styleUtils from "../utils/styleUtils";

interface Props {
  content: { label: string };
}

const Footer = ({ content }: Props) => (
  <>
    <div css={styles.root}>
      <p>{content.label}</p>
    </div>
    <div css={styles.shadowCover} />
    <div css={styles.shadowFooter} />
  </>
);

const styles = Object.freeze({
  root: css`
    margin-top: 4em;
    z-index: 3;
    width: 100%;
    background-color: var(--primary-color);
    color: var(--text-color);
    display: flex;
    justify-content: space-around;
    box-shadow: none;

    > p {
      text-align: center;
      font-weight: 500;
      line-height: 2;
    }

    // sticky footer on desktop with shadow scroll
    ${styleUtils.desktop(css`
      position: sticky;
      bottom: 0;
    `)}
  `,
  shadowFooter: styleUtils.desktop(css`
    position: sticky;
    bottom: 0;
    background: var(--primary-color);
    height: 1px;
    transform: translateY(-1px);
    width: 100%;
    margin-bottom: -1px;
    box-shadow: 5px -1.5em 20px 5px rgba(${keyword.rgb("black").join(",")}, 0.5);
  `),
  shadowCover: styleUtils.desktop(css`
    transform: translateY(-2em);
    background: linear-gradient(
      0deg,
      rgba(${keyword.rgb("white").join(",")}, 1) 0%,
      rgba(${keyword.rgb("white").join(",")}, 0) 100%
    );
    z-index: 2;
    width: 100%;
    height: 2em;
    position: absolute;
    bottom: 0;
  `),
});

export default Footer;
