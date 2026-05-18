import { createContext, useContext, ParentProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

const CmsPathContext = createContext("");
export const useCmsPath = () => useContext(CmsPathContext);
export const CmsPathProvider = CmsPathContext.Provider;

export const CmsPathContextProvider = (
  props: ParentProps<{ value: string }>
): JSX.Element => {
  const current = useCmsPath();
  const resolved = current ? `${current}.${props.value}` : props.value;
  return (
    <CmsPathContext.Provider value={resolved}>
      {props.children}
    </CmsPathContext.Provider>
  );
};
