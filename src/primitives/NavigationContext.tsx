import { createContext, useContext, ParentProps } from "solid-js";
import type { Accessor } from "solid-js";
import { getCollectionItem } from "~/lib/content";
import type { CmsSource } from "~/lib/cms/CmsPathContext";
import { NavigationShape } from "~/models";
import { createCmsContent } from "./createContentFetch";

const NAVIGATION_SLUG = "main";

export const navigationSource: CmsSource = {
  collection: NavigationShape.name,
  slug: NAVIGATION_SLUG,
};

const fetchNavigation = (slug: string) =>
  getCollectionItem(NavigationShape, slug);

export type Navigation = Awaited<ReturnType<typeof fetchNavigation>>;

const NavigationContext = createContext<Accessor<Navigation>>();

export const NavigationProvider = (props: ParentProps) => {
  const navigation = createCmsContent(
    NavigationShape,
    fetchNavigation,
    () => NAVIGATION_SLUG,
  );
  return (
    <NavigationContext.Provider value={navigation}>
      {props.children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): Accessor<Navigation> => {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return ctx;
};
