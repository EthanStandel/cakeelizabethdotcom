import { z } from "zod";
import type {
  CmsField,
  CmsFieldsMap,
  CollectionDefinition,
  DecapCollectionConfig,
  DecapFieldConfig,
} from "./types";

function makeField<Z extends z.ZodTypeAny>(
  schema: Z,
  config: Omit<DecapFieldConfig, "name">
): CmsField<Z> {
  return { _zodSchema: schema, _decapConfig: config };
}

function applyRequired<Z extends z.ZodTypeAny>(
  schema: Z,
  required: boolean | undefined
): z.ZodTypeAny {
  return required === false ? schema.optional() : schema;
}

export const fields = {
  string(opts: { label: string; required?: boolean; default?: string }) {
    return makeField(
      applyRequired(z.string(), opts.required) as z.ZodString | z.ZodOptional<z.ZodString>,
      { widget: "string", label: opts.label, required: opts.required ?? true, default: opts.default }
    );
  },

  text(opts: { label: string; required?: boolean; default?: string }) {
    return makeField(
      applyRequired(z.string(), opts.required) as z.ZodString | z.ZodOptional<z.ZodString>,
      { widget: "text", label: opts.label, required: opts.required ?? true, default: opts.default }
    );
  },

  markdown(opts: { label: string; required?: boolean }) {
    return makeField(
      applyRequired(z.string(), opts.required) as z.ZodString | z.ZodOptional<z.ZodString>,
      { widget: "markdown", label: opts.label, required: opts.required ?? true }
    );
  },

  number(opts: {
    label: string;
    required?: boolean;
    default?: number;
    valueType?: "int" | "float";
    min?: number;
    max?: number;
    step?: number;
  }) {
    let schema = z.number();
    if (opts.min !== undefined) schema = schema.min(opts.min);
    if (opts.max !== undefined) schema = schema.max(opts.max);
    return makeField(
      applyRequired(schema, opts.required) as z.ZodNumber | z.ZodOptional<z.ZodNumber>,
      {
        widget: "number",
        label: opts.label,
        required: opts.required ?? true,
        default: opts.default,
        value_type: opts.valueType,
        min: opts.min,
        max: opts.max,
        step: opts.step,
      }
    );
  },

  boolean(opts: { label: string; required?: boolean; default?: boolean }) {
    return makeField(
      applyRequired(z.boolean(), opts.required) as z.ZodBoolean | z.ZodOptional<z.ZodBoolean>,
      { widget: "boolean", label: opts.label, required: opts.required ?? true, default: opts.default }
    );
  },

  datetime(opts: { label: string; required?: boolean; default?: string }) {
    return makeField(
      applyRequired(z.string(), opts.required) as z.ZodString | z.ZodOptional<z.ZodString>,
      { widget: "datetime", label: opts.label, required: opts.required ?? true, default: opts.default }
    );
  },

  image(opts: { label: string; required?: boolean }) {
    return makeField(
      applyRequired(z.string(), opts.required) as z.ZodString | z.ZodOptional<z.ZodString>,
      { widget: "image", label: opts.label, required: opts.required ?? true }
    );
  },

  file(opts: { label: string; required?: boolean }) {
    return makeField(
      applyRequired(z.string(), opts.required) as z.ZodString | z.ZodOptional<z.ZodString>,
      { widget: "file", label: opts.label, required: opts.required ?? true }
    );
  },

  select<const T extends readonly [string, ...string[]]>(opts: {
    label: string;
    options: T;
    required?: boolean;
    multiple?: boolean;
    default?: T[number];
  }) {
    const baseSchema = opts.multiple ? z.array(z.enum(opts.options)) : z.enum(opts.options);
    return makeField(
      applyRequired(baseSchema, opts.required),
      {
        widget: "select",
        label: opts.label,
        required: opts.required ?? true,
        options: [...opts.options],
        multiple: opts.multiple,
        default: opts.default,
      }
    );
  },

  list(opts: {
    label: string;
    required?: boolean;
    field?: CmsField;
    fields?: CmsFieldsMap;
  }) {
    let itemSchema: z.ZodTypeAny;
    let decapField: Pick<DecapFieldConfig, "field" | "fields"> = {};

    if (opts.fields) {
      const shape = Object.fromEntries(
        Object.entries(opts.fields).map(([k, v]) => [k, v._zodSchema])
      );
      itemSchema = z.object(shape as Record<string, z.ZodTypeAny>);
      decapField.fields = Object.entries(opts.fields).map(([name, f]) => ({
        name,
        ...f._decapConfig,
      }));
    } else if (opts.field) {
      itemSchema = opts.field._zodSchema;
      decapField.field = { name: "item", ...opts.field._decapConfig };
    } else {
      itemSchema = z.string();
    }

    return makeField(
      applyRequired(z.array(itemSchema), opts.required),
      { widget: "list", label: opts.label, required: opts.required ?? true, ...decapField }
    );
  },

  object<F extends CmsFieldsMap>(opts: { label: string; required?: boolean; fields: F }) {
    const shape = Object.fromEntries(
      Object.entries(opts.fields).map(([k, v]) => [k, v._zodSchema])
    ) as { [K in keyof F]: F[K]["_zodSchema"] };
    const objSchema = z.object(shape);
    const decapFields: DecapFieldConfig[] = Object.entries(opts.fields).map(([name, f]) => ({
      name,
      ...f._decapConfig,
    }));
    return makeField(
      applyRequired(objSchema, opts.required),
      { widget: "object", label: opts.label, required: opts.required ?? true, fields: decapFields }
    );
  },
};

export function defineCollection<F extends CmsFieldsMap>(opts: {
  name: string;
  label: string;
  folder: string;
  create?: boolean;
  identifierField?: string;
  slug?: string;
  extension?: string;
  previewPath?: (slug: string) => string;
  fields: F;
}): CollectionDefinition<F> {
  const zodShape = Object.fromEntries(
    Object.entries(opts.fields).map(([k, v]) => [k, v._zodSchema.optional()])
  ) as { [K in keyof F]: z.ZodOptional<F[K]["_zodSchema"]> };

  const decapFields: DecapFieldConfig[] = Object.entries(opts.fields).map(([name, f]) => ({
    name,
    ...f._decapConfig,
  }));

  const collectionConfig: DecapCollectionConfig = {
    name: opts.name,
    label: opts.label,
    folder: opts.folder,
    create: opts.create ?? true,
    identifier_field: opts.identifierField ?? "title",
    slug: opts.slug ?? "{{slug}}",
    ...(opts.extension ? { extension: opts.extension } : {}),
    fields: decapFields,
  };

  return {
    name: opts.name,
    schema: z.object(zodShape),
    collectionConfig,
    previewPath: opts.previewPath ?? ((slug) => `/${slug}`),
  };
}
