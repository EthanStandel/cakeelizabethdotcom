import z from "zod";
import { defineQueryParams } from "./createQueryParamRouting";

const galleryModalSchema = z.object({
  type: z.literal("gallery"),
  payload: z.object({ imageUrl: z.string() }),
});

export const createQueryParamRouting = defineQueryParams({
  modal: {
    key: "modal",
    schema: z.discriminatedUnion("type", [galleryModalSchema]),
  },
  galleryFilterTag: {
    key: "galleryFilterTag",
    schema: z.string(),
  },
});
