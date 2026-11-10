import { vi } from "vitest";
import { testScreenshot } from "~/test/utils";
import type { GalleryModuleType } from "~/models/modules/GalleryModule.shape";
import { GalleryItemsShape } from "~/models/GalleryItems.shape";
import { TagsShape } from "~/models/Tags.shape";
import { GalleryModule } from "./GalleryModule";

const TAGS = ["Birthday", "Wedding", "Cupcakes"];

const galleryContent: Record<string, unknown> = {
  [GalleryItemsShape.name]: {
    _slug: "main",
    name: "Gallery Items",
    items: Array.from({ length: 8 }, (_, index) => ({
      image: `/test/test.png?item=${index}`,
      title: `Cake ${index + 1}`,
      description: "A test cake.",
      date: `2024-01-${String(index + 1).padStart(2, "0")}`,
      tags: [TAGS[index % TAGS.length]],
    })),
  },
  [TagsShape.name]: { _slug: "main", name: "Tags", tags: TAGS },
};

vi.mock(import("~/lib/content"), async (importOriginal) => {
  const content = await importOriginal();
  return {
    ...content,
    getCollectionItem: async (collection, slug) =>
      (galleryContent[collection.name] as never) ??
      content.getCollectionItem(collection, slug),
  };
});

testScreenshot("allTags", () => (
  <GalleryModule shape={{ heading: "Gallery" } as GalleryModuleType} />
));

testScreenshot("presetTag", () => (
  <GalleryModule
    shape={{ heading: "Wedding gallery", tag: "Wedding" } as GalleryModuleType}
  />
));
