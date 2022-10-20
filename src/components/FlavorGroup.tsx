import { FC } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import styleUtils from "src/utils/styleUtils";

export const FlavorGroup: FC<{
  title: string;
  flavors?: Array<string>;
  children?: string;
  leftAlign?: boolean;
  verticalOnly?: boolean;
}> = ({ title, flavors, children, leftAlign, verticalOnly }) => (
  <styles.FlavorGroup
    css={[!verticalOnly && styles.desktopGrid, leftAlign && styles.leftAlign]}
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
  FlavorGroup: styled.div({
    "&": styleUtils.shadow,
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
        "&:nth-child(2n)": {
          background: "var(--primary-color)",
          marginLeft: "-2em",
          marginRight: "-2em",
          paddingLeft: "2em",
          paddingRight: "2em",
        },
      },
    },
  }),
};
