import { css, SerializedStyles } from "@emotion/react";
import { keyword } from "color-convert";

const shadow = css`
  --box-shadow-density: 0.25;
  box-shadow: 5px 5px 10px 5px
    rgba(${keyword.rgb("black").join(",")}, var(--box-shadow-density)) !important;
`;

const styleUtils = {
  desktop: (style: SerializedStyles) => css`
    @media only screen and (min-width: 1024px) {
      ${style}
    }
  `,

  mobile: (style: SerializedStyles) => css`
    @media only screen and (max-width: 1023px) {
      ${style}
    }
  `,

  shadow,

  clickableShadow: css`
    ${shadow}
    transition: box-shadow 0.15s;
    outline: none !important;

    &:hover,
    &:focus-within {
      --box-shadow-density: 0.5;
    }

    &:active {
      --box-shadow-density: 0.75;
    }
  `,

  pageContainer: css`
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 2rem;
  `,

  contentContainer: css`
    margin-left: calc((100% - var(--app-width)) / 2);
    width: var(--app-width);
  `,
  center: css`
    display: flex;
    justify-content: space-around;
    align-items: center;
  `,

  htmlRoot: css`
    overflow: hidden;
    max-width: 100vw;
    // nth-child starts with 1
    // but n starts with 0 so
    // his is every element except
    // the first element
    &:nth-child(n + 2) {
      margin-top: 1rem;
    }
    h2 {
      text-transform: uppercase;
      font-size: 2em;
      margin: 1rem auto;
      text-align: center;
    }
    h3 {
      margin: 1em 0;
      font-size: 1.4em;
    }
    h4 {
      font-weight: bold;
      font-size: 1.2em;
      margin: 1em 0;
    }
    h5 {
      margin: 1em 0;
      font-size: 1.2em;
      text-transform: uppercase;
    }
    p,
    ol,
    ul {
      margin-top: 1em;
      margin-bottom: 1em;
    }
    ol,
    ul {
      list-style: inside;
    }
    ol,
    ol > li {
      list-style-type: decimal;
    }
    ul,
    ul > li {
      list-style-type: disc;
    }
    a {
      color: blue;
      text-decoration: underline;

      &:active {
        color: red;
      }

      &:visited {
        color: purple;
      }
    }
  `,
};

export default styleUtils;
