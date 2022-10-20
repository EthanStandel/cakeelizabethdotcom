import { Button, Spinner } from "@chakra-ui/react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import styleUtils from "../utils/styleUtils";

type Props = Parameters<typeof Button>[0] & { loading?: boolean };

// TODO - add the icon back to the button content
const CtaButton = ({ loading = false, children, ...props }: Props) => (
  <styles.Button {...props} size="lg" disabled={loading}>
    <span css={loading && styles.hidden}>{children}</span>
    {loading && <styles.Spinner />}
  </styles.Button>
);

const styles = Object.freeze({
  Button: styled(Button)({
    "&": styleUtils.clickableShadow,
    background: "var(--primary-color) !important",
    "&:hover, &:active, &:focus": {
      background: "var(--primary-color) !important",
    },
  }),
  hidden: css({
    visibility: "hidden",
  }),
  Spinner: styled(Spinner)({
    position: "absolute",
  }),
});

export default CtaButton;
