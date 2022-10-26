import React, { useEffect } from "react";

import { mobileMax } from "src/utils/styleUtils";

const mobileMediaQuery =
  typeof window !== "undefined" &&
  window.matchMedia(`(max-width: ${mobileMax}px)`);

const useIsMobileView = () => {
  // we know that the server says false
  const [isMobileView, setIsMobileView] = React.useState(false);

  // This helps the Next SSR/hydration cycle
  useEffect(() => {
    if (mobileMediaQuery) {
      const callback = (e: MediaQueryListEvent) => {
        setIsMobileView(e.matches);
      };
      mobileMediaQuery.addEventListener("change", callback);
      return () => mobileMediaQuery.removeEventListener("change", callback);
    }
  }, []);

  return isMobileView;
};

export default useIsMobileView;
