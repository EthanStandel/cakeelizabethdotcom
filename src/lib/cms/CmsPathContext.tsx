import { createContext, useContext, ParentProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export interface CmsSource {
  collection: string;
  slug: string;
}

interface CmsContextValue {
  path: string;
  source?: CmsSource;
}

const CmsContext = createContext<CmsContextValue>({ path: "" });

export const useCmsPath = () => useContext(CmsContext).path;
export const useCmsSource = () => useContext(CmsContext).source;

export const CmsPathContextProvider = (
  props: ParentProps<{ value: string }>
): JSX.Element => {
  const ctx = useContext(CmsContext);
  const resolved = ctx.path ? `${ctx.path}.${props.value}` : props.value;
  return (
    <CmsContext.Provider value={{ path: resolved, source: ctx.source }}>
      {props.children}
    </CmsContext.Provider>
  );
};

export const CmsSourceContextProvider = (
  props: ParentProps<{ collection: string; slug: string }>
): JSX.Element => (
  <CmsContext.Provider
    value={{ path: "", source: { collection: props.collection, slug: props.slug } }}
  >
    {props.children}
  </CmsContext.Provider>
);
