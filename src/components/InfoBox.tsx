import React from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { keyword } from "color-convert";

interface Props {
  children: React.ReactChild;
  state: "error" | "success";
}

const InfoBox = ({ children, state = "success" }: Props) => (
  <styles.Box
    css={[
      state === "success" && styles.success,
      state === "error" && styles.error,
    ]}
  >
    {children}
  </styles.Box>
);

const styles = Object.freeze({
  Box: styled.div({
    width: "100%",
    border: "solid 2px black",
    padding: "1em",
    borderRadius: "var(--card-border-radius)",
    margin: "1em 0",
  }),
  success: css({
    borderColor: "springgreen",
    background: `rgba(${keyword.rgb("springgreen").join(",")}, 0.2)`,
  }),
  error: css({
    borderColor: "red",
    background: `rgba(${keyword.rgb("red").join(",")}, 0.2)`,
  }),
});

export default InfoBox;
