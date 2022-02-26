import { Button, Spinner } from "@chakra-ui/react";
import { css } from "@emotion/react";

import styleUtils from "../utils/styleUtils";

type Props = Parameters<typeof Button>[0] & { loading?: boolean };

const CtaButton = ({
  loading = false,
  children,
  leftIcon,
  ...props
}: Props) => (
  <Button
    {...props}
    leftIcon={<span css={loading && styles.hidden}>{leftIcon}</span>}
    css={styles.root}
    size="lg"
    disabled={loading}
  >
    <span css={loading && styles.hidden}>{children}</span>
    {loading && <Spinner css={styles.spinner} />}
  </Button>
);

const styles = Object.freeze({
  root: css`
    ${styleUtils.clickableShadow}
    transition: all 0.15s;
    background: var(--primary-color) !important;
    &:hover,
    &:active,
    &:focus {
      background: var(--secondary-color) !important;
    }
  `,

  hidden: css`
    visibility: hidden;
  `,

  spinner: css`
    position: absolute;
  `,
});

export default CtaButton;
