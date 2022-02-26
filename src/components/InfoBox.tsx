import React from "react";

import { css } from "@emotion/react";
import { keyword } from "color-convert";

interface Props {
  children: React.ReactChild;
  state: "error" | "success";
}

const InfoBox = ({ children, state = "success" }: Props) => (
  <div
    css={[
      styles.box,
      state === "success" && styles.success,
      state === "error" && styles.error,
    ]}
  >
    {children}
  </div>
);

const styles = Object.freeze({
  box: css`
    width: 100%;
    border: solid 2px black;
    padding: 1em;
    border-radius: var(--chakra-radii-md);
    margin: 1em 0;
  `,

  success: css`
    border-color: springgreen;
    background: rgba(${keyword.rgb("springgreen").join(",")}, 0.2);
  `,
  error: css`
    border-color: red;
    background: rgba(${keyword.rgb("red").join(",")}, 0.2);
  `,
});

export default InfoBox;
