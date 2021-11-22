import React from "react";

import { useMediaQuery } from "@chakra-ui/media-query";

const useIsMobileView = () => {
  // we know that the server says false
  const [isMobileView, setIsMobileView] = React.useState(false);
  const [isMobileViewQuery] = useMediaQuery("(max-width: 1023px)");

  // This helps the Next SSR/hydration cycle
  React.useEffect(() => {
    setIsMobileView(isMobileViewQuery);
  }, [isMobileViewQuery]);

  return isMobileView;
};

export default useIsMobileView;
