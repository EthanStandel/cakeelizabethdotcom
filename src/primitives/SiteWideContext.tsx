import { createAsync } from "@solidjs/router";
import { createContext, useContext, ParentProps } from "solid-js";
import type { Accessor } from "solid-js";
import { getCollectionItem } from "~/lib/content";
import type { CmsSource } from "~/lib/cms/CmsPathContext";
import { getSiteUrl } from "~/lib/siteUrl";
import { ConstantsShape, NavigationShape, SeoShape } from "~/models";
import { createCmsContent } from "./createContentFetch";

const CONSTANTS_SLUG = "main";
const NAVIGATION_SLUG = "main";
const SEO_SLUG = "main";

export const navigationSource: CmsSource = {
  collection: NavigationShape.name,
  slug: NAVIGATION_SLUG,
};

const fetchConstants = (slug: string) =>
  getCollectionItem(ConstantsShape, slug);

const fetchNavigation = (slug: string) =>
  getCollectionItem(NavigationShape, slug);

const fetchSeo = (slug: string) => getCollectionItem(SeoShape, slug);

export type Constants = Awaited<ReturnType<typeof fetchConstants>>;
export type Navigation = Awaited<ReturnType<typeof fetchNavigation>>;
export type Seo = Awaited<ReturnType<typeof fetchSeo>>;

type SiteWide = {
  constants: Accessor<Constants>;
  navigation: Accessor<Navigation>;
  seo: Accessor<Seo>;
  siteUrl: Accessor<string | undefined>;
};

const SiteWideContext = createContext<SiteWide>();

export const SiteWideProvider = (props: ParentProps) => {
  const siteWide: SiteWide = {
    constants: createCmsContent(
      ConstantsShape,
      fetchConstants,
      () => CONSTANTS_SLUG,
    ),
    navigation: createCmsContent(
      NavigationShape,
      fetchNavigation,
      () => NAVIGATION_SLUG,
    ),
    seo: createCmsContent(SeoShape, fetchSeo, () => SEO_SLUG),
    siteUrl: createAsync(() => getSiteUrl()),
  };
  return (
    <SiteWideContext.Provider value={siteWide}>
      {props.children}
    </SiteWideContext.Provider>
  );
};

type SiteWideKey = keyof SiteWide;

type SiteWideValues<TKeys extends readonly SiteWideKey[]> = {
  [Index in keyof TKeys]: SiteWide[TKeys[Index]];
};

export const useSiteWide = <const TKeys extends readonly SiteWideKey[]>(
  ...keys: TKeys
): SiteWideValues<TKeys> => {
  const ctx = useContext(SiteWideContext);
  if (!ctx) {
    throw new Error("useSiteWide must be used within a SiteWideProvider");
  }
  return keys.map((key) => ctx[key]) as SiteWideValues<TKeys>;
};
