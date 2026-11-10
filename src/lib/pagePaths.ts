export const PAGE_COLLECTION_NAME = "page";
export const HOME_PAGE_SLUG = "home";
export const HOME_PAGE_PATH = "/";

export const getPagePath = (slug: string) =>
  slug === HOME_PAGE_SLUG ? HOME_PAGE_PATH : `/${slug}`;
