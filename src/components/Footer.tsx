import { styled } from "@stitches/react";
import { keyword } from "color-convert";

import styleUtils from "../utils/styleUtils";

interface Props {
  content: { label: string };
}

const Footer = ({ content }: Props) => (
  <>
    <styles.Footer>
      <p>{content.label}</p>
    </styles.Footer>
    <styles.ShadowCover />
    <styles.ShadowFooter />
  </>
);

const styles = Object.freeze({
  Footer: styled("div", {
    marginTop: "4em",
    zIndex: 3,
    width: "100%",
    background: "var(--primary-color)",
    color: "var(--text-color)",
    display: "flex",
    justifyContent: "space-around",
    boxShadow: "none",

    "& > p": {
      textAlign: "center",
      fontWeight: 500,
      lineHeight: 2,
    },

    [styleUtils.desktop]: {
      position: "sticky",
      bottom: 0,
    },
  }),
  ShadowFooter: styled("div", {
    [styleUtils.desktop]: {
      position: "sticky",
      bottom: 0,
      background: "var(--primary-color)",
      height: 1,
      transform: "translateY(-1px)",
      width: "100%",
      marginBottom: -1,
      boxShadow: `5px -1.5em 20px 5px rgba(${keyword
        .rgb("black")
        .join(",")}, 0.5)`,
    },
  }),
  ShadowCover: styled("div", {
    [styleUtils.desktop]: {
      transform: "translateY(-2em)",
      background: `linear-gradient(
        0deg,
        rgba(${keyword.rgb("white").join(",")}, 1) 0%,
        rgba(${keyword.rgb("white").join(",")}, 0) 100%
      )`,
      zIndex: 2,
      width: "100%",
      height: "2em",
      position: "absolute",
      bottom: 0,
    },
  }),
});

export default Footer;
