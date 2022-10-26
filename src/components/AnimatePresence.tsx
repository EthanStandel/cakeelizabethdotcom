import { useEffect, useState } from "react";

import { styled } from "@stitches/react";

export const AnimatePresence = ({
  show: showProp,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) => {
  const [show, setShow] = useState(showProp);

  useEffect(() => {
    if (showProp) {
      setShow(showProp);
    } else {
      setTimeout(() => {
        setShow(showProp);
      }, 200);
    }
  }, [showProp]);

  return (
    <>
      {(show || showProp) && (
        <Animated in={showProp === show}>{children}</Animated>
      )}
    </>
  );
};

const Animated = styled("div", {
  transition: "opacity .2s ease, transform .2s ease",
  opacity: 0,
  transform: "scale(0.75)",
  variants: {
    in: {
      true: {
        opacity: 1,
        transform: "none",
      },
    },
  },
});
