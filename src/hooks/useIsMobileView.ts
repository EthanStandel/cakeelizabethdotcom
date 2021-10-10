import { useEffect, useState } from "react";

import { useMediaQuery } from "@chakra-ui/media-query";

const useIsMobileView = () => {
  // we know that the server says false
  const [isMobileView, setIsMobileView] = useState(false);
  const [isMobileViewQuery] = useMediaQuery("(max-width: 750px)");

  // This helps the Next SSR/hydration cycle
  useEffect(() => {
    setIsMobileView(isMobileViewQuery);
  }, [isMobileViewQuery]);

  return isMobileView;
};

export default useIsMobileView;
