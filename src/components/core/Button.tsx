import { ButtonHTMLAttributes, FC } from "react";

import SpinnerIcon from "@fortawesome/fontawesome-free/svgs/solid/spinner.svg";
import { styled } from "@stitches/react";

import styleUtils from "src/utils/styleUtils";

export type ButtonProps = {
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = ({ children, ...props }) => (
  <BaseButton {...props} disabled={props.loading || props.disabled}>
    <div>{children}</div>
    <img src={SpinnerIcon.src} alt="Loading" />
  </BaseButton>
);

export const BaseButton = styled("button", {
  height: "3em",
  lineHeight: "3em",
  borderRadius: "var(--card-border-radius)",
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  paddingLeft: "1.5em",
  paddingRight: "1.5em",
  background: "var(--primary-color)",
  color: "var(--text-color)",
  fontWeight: "bold",
  position: "relative",
  border: "1px solid white",
  transition: "box-shadow 0.2s ease, opacity 0.2s ease",
  "> div": {
    transition: "transform 0.2s ease, opacity 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1em",
    img: {
      width: "1em",
      height: "1em",
    },
  },
  "> img": {
    display: "none",
    position: "absolute",
    height: "1.5em",
    width: "1.5em",
    top: "0.75em",
    left: "calc(50% - .75em)",
    animation: `${styleUtils.spin} 1s linear infinite`,
  },
  "&:disabled": {
    cursor: "progress",
    opacity: 0.5,
  },
  "&:not(:disabled)": {
    "&:hover, &:focus-visible": {
      outline: "none",
      boxShadow: "0 0 5px 5px var(--primary-color)",
    },
    "&:active": {
      boxShadow: "none",
      "> div": {
        transform: "scale(0.8)",
      },
    },
  },
  variants: {
    loading: {
      true: {
        opacity: 0.5,
        "> div": {
          opacity: 0,
        },
        img: {
          display: "block",
        },
      },
    },
  },
});
