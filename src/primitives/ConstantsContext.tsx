import { createContext, useContext, ParentProps } from "solid-js";
import type { Accessor } from "solid-js";
import { getCollectionItem } from "~/lib/content";
import { ConstantsShape } from "~/models";
import { createCmsContent } from "./createContentFetch";

const CONSTANTS_SLUG = "main";

const fetchConstants = (slug: string) =>
  getCollectionItem(ConstantsShape, slug);

export type Constants = Awaited<ReturnType<typeof fetchConstants>>;

const ConstantsContext = createContext<Accessor<Constants>>();

export const ConstantsProvider = (props: ParentProps) => {
  const constants = createCmsContent(
    ConstantsShape,
    fetchConstants,
    () => CONSTANTS_SLUG,
  );
  return (
    <ConstantsContext.Provider value={constants}>
      {props.children}
    </ConstantsContext.Provider>
  );
};

export const useConstants = (): Accessor<Constants> => {
  const ctx = useContext(ConstantsContext);
  if (!ctx) {
    throw new Error("useConstants must be used within a ConstantsProvider");
  }
  return ctx;
};
