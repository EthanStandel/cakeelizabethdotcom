import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const usePathChange = (callback: () => void) => {
  const pathname = usePathname();

  useEffect(() => {
    callback();
  }, [pathname]);
};
