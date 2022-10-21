import { FC } from "react";

import { Button, ButtonProps, Spinner } from "@chakra-ui/react";
import { css, styled } from "@stitches/react";

import styleUtils from "../utils/styleUtils";

type Props = Parameters<typeof Button>[0] & { loading?: boolean };

// TODO - add the icon back to the button content
const CtaButton = ({ loading = false, children, ...props }: Props) => (
  <styles.Button {...props} size="lg" disabled={loading}>
    <span className={loading ? styles.hidden() : ""}>{children}</span>
    {loading && <styles.Spinner />}
  </styles.Button>
);

const styles = Object.freeze({
  Button: styled(
    Button,
    {
      background: "var(--primary-color) !important",
      "&:hover, &:active, &:focus": {
        background: "var(--secondary-color) !important",
      },
    },
    styleUtils.clickableShadow
  ) as FC<ButtonProps>,
  hidden: css({
    visibility: "hidden",
  }),
  Spinner: styled(Spinner, {
    position: "absolute",
  }),
});

export default CtaButton;
