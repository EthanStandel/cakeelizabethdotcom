import type { z } from "zod";

export type DecapWidget =
  | "string"
  | "text"
  | "markdown"
  | "number"
  | "boolean"
  | "datetime"
  | "image"
  | "file"
  | "select"
  | "list"
  | "object"
  | "relation";

export interface DecapFieldConfig {
  label: string;
  name: string;
  widget: DecapWidget;
  required?: boolean;
  default?: unknown;
  options?: string[] | Array<{ label: string; value: string }>;
  multiple?: boolean;
  field?: DecapFieldConfig;
  fields?: DecapFieldConfig[];
  value_type?: "int" | "float";
  min?: number;
  max?: number;
  step?: number;
  collection?: string;
  search_fields?: string[];
  value_field?: string;
  display_fields?: string[];
}

export interface CmsField<Z extends z.ZodTypeAny = z.ZodTypeAny> {
  readonly _zodSchema: Z;
  readonly _decapConfig: Omit<DecapFieldConfig, "name">;
}

export type CmsFieldsMap = Record<string, CmsField>;

export type InferFields<F extends CmsFieldsMap> = {
  [K in keyof F]: z.infer<F[K]["_zodSchema"]>;
};

export interface DecapCollectionConfig {
  name: string;
  label: string;
  folder: string;
  create: boolean;
  identifier_field: string;
  slug: string;
  extension?: string;
  format?: string;
  fields: DecapFieldConfig[];
}

export interface CollectionDefinition<F extends CmsFieldsMap> {
  name: string;
  schema: z.ZodObject<{ [K in keyof F]: F[K]["_zodSchema"] }>;
  collectionConfig: DecapCollectionConfig;
  previewPath: (slug: string) => string;
}
