import type { CollectionDefinition, CmsFieldsMap } from "~/lib/cms/types";
import { pagesCollection } from "./pages";

export const collectionRegistry: CollectionDefinition<CmsFieldsMap>[] = [
  pagesCollection,
];

export { pagesCollection };
