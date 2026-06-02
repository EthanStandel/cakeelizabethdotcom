import type { CollectionDefinition, CmsFieldsMap } from "~/lib/cms/types";
import { PageShape } from "./Page.shape";
import { FlavorCategoriesShape } from "./FlavorCategories.shape";

export const collectionRegistry: CollectionDefinition<CmsFieldsMap>[] = [
  PageShape,
  FlavorCategoriesShape,
];

export { PageShape, FlavorCategoriesShape };
