import type { CollectionDefinition, CmsFieldsMap } from "~/lib/cms/types";
import { PageShape } from "./Page.shape";
import { FlavorCategoriesShape } from "./FlavorCategories.shape";
import { GalleryItemsShape } from "./GalleryItems.shape";
import { TagsShape } from "./Tags.shape";

export const collectionRegistry: CollectionDefinition<CmsFieldsMap>[] = [
  PageShape,
  FlavorCategoriesShape,
  TagsShape,
  GalleryItemsShape,
];

export { PageShape, FlavorCategoriesShape, GalleryItemsShape, TagsShape };
