import { css, keyframes, styled, globalCss } from "@stitches/react";

const shadow = css({
  "--box-shadow-density": 0.5,
  boxShadow: `3px 3px 5px 5px rgba(0, 0, 0, var(--box-shadow-density)) !important`,
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

const htmlRoot = css({
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
});

const pageContainer = css(
  {
    width: "100%",
    "margin-top": "1rem",
    "margin-bottom": "2rem",
  },
  contentContainerParent
);

const contentContainer = css(
  {
    [mobile]: {
      maxWidth: 800,
    },
  },
  contentContainerFullWidth
);

const clickableShadow = css(shadow, {
  transition: "box-shadow 0.15s, border-color 0.15s",
  outline: "none !important",
  "--box-shadow-density": 0.3,
  border: "4px solid var(--border-color)",

  "&:hover, &:focus-within, &:focus-visible": {
    "--box-shadow-density": 0.5,
    borderColor: "var(--primary-color)",
  },

  "&:active": {
    "--box-shadow-density": 0,
  },
});

const center = css({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
});

const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

const global = globalCss({
  html: {
    "--card-border-radius": "1.5em",
    "--app-width": "80%",
    "--primary-color": "#65ffce",
    "--secondary-color": "springgreen",
    "--text-color": "#555555",
    "--border-color": "#aaaaaa",
    "--transparent-primary": "rgba(127, 255, 212, 0.5)",

    body: {
      margin: 0,
    },

    "button, ul, a": {
      all: "unset",
    },

    "button, a": {
      cursor: "pointer",
      "&:focus-visible": {
        outline: "2px solid var(--text-color)",
      },
    },

    "p, h1, h2, h3, h4, h5, h6, ul, ol, li": {
      margin: 0,
    },

    img: {
      maxWidth: "100%",
      maxHeight: "100%",
    },

    [mobile]: {
      "--app-width": "95%",
    },

    "*": {
      boxSizing: "border-box",
      fontFamily: "Montserrat, sans-serif",
    },

    h2: {
      textTransform: "uppercase",
      fontSize: "2em",
      margin: "1rem auto",
      textAlign: "center",
      fontWeight: "normal",
    },

    h3: {
      fontWeight: "normal",
    },

    p: {
      lineHeight: "1.5em",
    },

    "#nprogress": {
      ".bar": {
        background: "var(--text-color) !important",
      },
      ".spinner-icon": {
        borderTopColor: "var(--text-color) !important",
        borderLeftColor: "var(--text-color) !important",
      },
    },
  },
})();

const styleUtils = {
  global,
  desktop,
  mobile,
  desktopOnly: css({ [mobile]: { display: "none !important" } }),
  mobileOnly: css({ [desktop]: { display: "none !important" } }),
  shadow,
  contentContainerFullWidth,
  ContentContainerFullWidth: styled("div", contentContainerFullWidth),
  clickableShadow,
  ClickableShadow: styled("div", clickableShadow),
  htmlRoot,
  HtmlRoot: styled("div", htmlRoot),
  contentContainerParent,
  ContentContainerParent: styled("div", contentContainerParent),
  pageContainer,
  PageContainer: styled("div", pageContainer),
  contentContainer,
  ContentContainer: styled("div", contentContainer),
  center,
  Center: styled("div", center),
  spin,
};

export default styleUtils;
