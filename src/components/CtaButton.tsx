import { Button, Spinner } from "@chakra-ui/react";

import classes from "../styles/components/CtaButton.module.sass";

type Props = Parameters<typeof Button>[0] & { loading?: boolean };

const CtaButton = ({
  loading = false,
  children,
  leftIcon,
  ...props
}: Props) => (
  <Button
    {...props}
    leftIcon={<span className={loading ? classes.hidden : ""}>{leftIcon}</span>}
    className={classes.root}
    size="lg"
    disabled={loading}
  >
    <span className={loading ? classes.hidden : ""}>{children}</span>
    {loading && <Spinner className={classes.spinner} />}
  </Button>
);

export default CtaButton;
