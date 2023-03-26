import { useLayoutEffect as useLayoutEffectBase, useEffect } from "react";

// I don't care about the errors associated with this. I still want useLayoutEffect when I dynamically render content
// event if the server response is non-ideal
export const useLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffectBase : useEffect;
