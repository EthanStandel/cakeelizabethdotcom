import type { CollectionDefinition, CmsFieldsMap } from "~/lib/cms/types";
import { PageShape } from "./Page.shape";
import { FlavorCategoriesShape } from "./FlavorCategories.shape";
import { GalleryItemsShape } from "./GalleryItems.shape";
import { TagsShape } from "./Tags.shape";
import { ConstantsShape } from "./Constants.shape";

export const collectionRegistry: CollectionDefinition<CmsFieldsMap>[] = [
  PageShape,
  FlavorCategoriesShape,
  TagsShape,
  GalleryItemsShape,
  ConstantsShape,
];

export {
  PageShape,
  FlavorCategoriesShape,
  GalleryItemsShape,
  TagsShape,
  ConstantsShape,
};
