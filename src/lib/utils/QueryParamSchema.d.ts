import type { ZodType } from "zod";

export type QueryParamSchema<TKey extends string = string, TSchema extends ZodType = ZodType> = {
  readonly key: TKey;
  schema: TSchema;
};
