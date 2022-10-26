import { FC } from "react";

import { css, styled } from "@stitches/react";

import styleUtils from "../utils/styleUtils";

export const FlavorGroup: FC<{
  title: string;
  flavors?: Array<string>;
  children?: string;
  leftAlign?: boolean;
  verticalOnly?: boolean;
}> = ({ title, flavors, children, leftAlign, verticalOnly }) => (
  <styles.FlavorGroup
    className={[
      !verticalOnly && styles.desktopGrid(),
      leftAlign && styles.leftAlign(),
    ].join(" ")}
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
  </styles.FlavorGroup>
);

const styles = {
  desktopGrid: css({
    [styleUtils.desktop]: {
      ul: {
        "grid-template-columns": "repeat(2, 1fr)",

        "> li": {
          "&:nth-child(2n)": {
            background: "unset",
            marginLeft: "unset",
            marginRight: "-2em",
            paddingRight: "2em",
            paddingLeft: "1em",
          },
          "&:nth-child(4n-3), &:nth-child(4n)": {
            background: "var(--primary-color)",
          },
          "&:nth-child(2n-1)": {
            "margin-left": "-2em",
            "padding-left": "2em",
            "padding-right": "1em",
          },
        },
      },
    },
  }),
  leftAlign: css({
    "ul > li": {
      display: "block",
      textAlign: "left",
    },
  }),
  FlavorGroup: styled(
    "div",
    {
      marginTop: "2em",
      width: "100%",
      padding: "2em",
      borderRadius: "var(--card-border-radius)",
      ul: {
        display: "grid",
        "> li": {
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          listStyleType: "none",
          [styleUtils.mobile]: {
            "&:nth-child(2n)": {
              background: "var(--primary-color)",
              marginLeft: "-2em",
              marginRight: "-2em",
              paddingLeft: "2em",
              paddingRight: "2em",
            },
          },
        },
      },
    },
    styleUtils.shadow
  ),
};
