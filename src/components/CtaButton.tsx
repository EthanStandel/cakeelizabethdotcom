import { Button } from "@chakra-ui/react";

import classes from "../styles/components/CtaButton.module.scss";

const CtaButton = (props: Parameters<typeof Button>[0]) => (
  <Button {...props} className={classes.root} />
);

export default CtaButton;
