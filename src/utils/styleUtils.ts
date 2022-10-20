import { css } from "@emotion/react";
import { keyword } from "color-convert";

const boxShadowWeight = `rgba(${keyword
  .rgb("black")
  .join(",")}, var(--box-shadow-density))`;
const shadow = css({
  "--box-shadow-density": 0.25,
  boxShadow: `5px 5px 10px 5px ${boxShadowWeight} !important`,
});

export const mobileMax = 1260;
const desktop = `@media only screen and (min-width: ${mobileMax + 1}px)`;
const mobile = `@media only screen and (max-width: ${mobileMax}px)`;

const contentContainerParent = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const contentContainerFullWidth = css({
  width: "var(--app-width)",
});

const styleUtils = {
  desktop,
  mobile,
  desktopOnly: {
    [mobile]: {
      display: "none",
    },
  },
  mobileOnly: {
    [desktop]: {
      display: "none",
    },
  },
  shadow,
  contentContainerFullWidth,
  clickableShadow: css({
    "&": shadow,
    transition: "box-shadow 0.15s",
    outline: "none !important",

    "&:hover, &:focus-within": {
      "--box-shadow-density": 0.5,
    },

    "&:active": {
      "--box-shadow-density": 0.75,
    },
  }),
  contentContainerParent,
  pageContainer: css({
    width: "100%",
    "margin-top": "1rem",
    "margin-bottom": "2rem",
    "&": contentContainerParent,
  }),
  contentContainer: css({
    "&": contentContainerFullWidth,
    [mobile]: {
      maxWidth: 800,
    },
  }),
  center: css({
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  }),
  htmlRoot: css({
    overflow: "hidden",
    maxWidth: "100vw",
    // nth-child starts with 1
    // but n starts with 0 so
    // his is every element except
    // the first element
    "&:nth-child(n + 2)": {
      marginTop: "1rem",
    },
    h2: {
      textTransform: "uppercase",
      fontSize: "2em",
      margin: "1rem auto",
      textAlign: "center",
    },
    h3: {
      margin: "1em 0",
      fontSize: "1.4em",
    },
    h4: {
      fontWeight: "bold",
      fontSize: "1.2em",
      margin: "1em 0",
    },
    h5: {
      margin: "1em 0",
      fontSize: "1.2em",
      textTransform: "uppercase",
    },
    p: {
      textAlign: "justify",
    },
    "p, ol, ul": {
      marginTop: "1em",
      marginBottom: "1em",
    },
    "ol, ul": {
      listStyle: "inside",
    },
    "ol, ol > li": {
      listStyleType: "decimal",
    },
    "ul, ul > li": {
      listStyleType: "disc",
    },
    a: {
      color: "blue",
      textDecoration: "underline",

      "&:active": {
        color: "red",
      },
      "&:visited": {
        color: "purple",
      },
    },
  }),
};

export default styleUtils;
