import { z } from "zod";
import type {
  CmsField,
  CmsFieldsMap,
  CollectionDefinition,
  DecapCollectionConfig,
  DecapFieldConfig,
} from "./types";

type ExtractShape<Z extends z.ZodTypeAny> = Z extends z.ZodObject<infer S>
  ? S
  : never;

type TypedListItem<T extends Record<string, CmsField>> = {
  [K in keyof T & string]: z.ZodObject<
    ExtractShape<T[K]["_zodSchema"]> & { type: z.ZodLiteral<K> }
  >;
}[keyof T & string];

function makeField<Z extends z.ZodTypeAny>(
  schema: Z,
  config: Omit<DecapFieldConfig, "name">
): CmsField<Z> {
  return { _zodSchema: schema, _decapConfig: config };
}

function applyRequired<Z extends z.ZodTypeAny, R extends boolean | undefined>(
  schema: Z,
  required: R
): R extends false ? z.ZodOptional<Z> : Z {
  return (required === false ? schema.optional() : schema) as never;
}

function listField<T extends Record<string, CmsField>>(opts: {
  label: string;
  required?: boolean;
  types: T;
}): CmsField<z.ZodArray<TypedListItem<T>>>;
function listField(opts: {
  label: string;
  required?: boolean;
  field?: CmsField;
  fields?: CmsFieldsMap;
}): CmsField<z.ZodArray<z.ZodTypeAny>>;
function listField(opts: {
  label: string;
  required?: boolean;
  field?: CmsField;
  fields?: CmsFieldsMap;
  types?: Record<string, CmsField>;
}): CmsField<z.ZodTypeAny> {
  if (opts.types) {
    const entries = Object.entries(opts.types);
    const extended = entries.map(([name, f]) =>
      (f._zodSchema as z.ZodObject<z.ZodRawShape>).extend({
        type: z.literal(name),
      })
    );
    const itemSchema: z.ZodTypeAny =
      extended.length === 0
        ? z.never()
        : extended.length === 1
        ? extended[0]
        : z.union([extended[0], extended[1], ...extended.slice(2)] as [
            z.ZodTypeAny,
            z.ZodTypeAny,
            ...z.ZodTypeAny[]
          ]);
    const decapTypes = entries.map(([name, f]) => ({
      name,
      label: `${f._decapConfig.label} [${name}]`,
      widget: "object" as const,
      fields: f._decapConfig.fields ?? [],
    }));
    return makeField(applyRequired(z.array(itemSchema), opts.required), {
      widget: "list",
      label: opts.label,
      required: opts.required ?? true,
      collapsed: false,
      types: decapTypes,
    });
  }

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
      label: `${f._decapConfig.label} [${name}]`,
    }));
  } else if (opts.field) {
    itemSchema = opts.field._zodSchema;
    decapField.field = { name: "item", ...opts.field._decapConfig };
  } else {
    itemSchema = z.string();
  }

  return makeField(applyRequired(z.array(itemSchema), opts.required), {
    widget: "list",
    label: opts.label,
    required: opts.required ?? true,
    collapsed: false,
    ...(decapField as Pick<DecapFieldConfig, "field" | "fields" | "types">),
  });
}

export const fields = {
  string(opts: { label: string; required?: boolean; default?: string }) {
    return makeField(applyRequired(z.string(), opts.required), {
      widget: "string",
      label: opts.label,
      required: opts.required ?? true,
      default: opts.default,
    });
  },

  text(opts: { label: string; required?: boolean; default?: string }) {
    return makeField(applyRequired(z.string(), opts.required), {
      widget: "text",
      label: opts.label,
      required: opts.required ?? true,
      default: opts.default,
    });
  },

  markdown(opts: { label: string; required?: boolean }) {
    return makeField(applyRequired(z.string(), opts.required), {
      widget: "markdown",
      label: opts.label,
      required: opts.required ?? true,
    });
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
    return makeField(applyRequired(schema, opts.required), {
      widget: "number",
      label: opts.label,
      required: opts.required ?? true,
      default: opts.default,
      value_type: opts.valueType,
      min: opts.min,
      max: opts.max,
      step: opts.step,
    });
  },

  boolean(opts: { label: string; required?: boolean; default?: boolean }) {
    return makeField(applyRequired(z.boolean(), opts.required), {
      widget: "boolean",
      label: opts.label,
      required: opts.required ?? true,
      default: opts.default,
    });
  },

  datetime(opts: { label: string; required?: boolean; default?: string }) {
    return makeField(applyRequired(z.string(), opts.required), {
      widget: "datetime",
      label: opts.label,
      required: opts.required ?? true,
      default: opts.default,
    });
  },

  image(opts: { label: string; required?: boolean }) {
    return makeField(applyRequired(z.string(), opts.required), {
      widget: "image",
      label: opts.label,
      required: opts.required ?? true,
    });
  },

  file(opts: { label: string; required?: boolean }) {
    return makeField(applyRequired(z.string(), opts.required), {
      widget: "file",
      label: opts.label,
      required: opts.required ?? true,
    });
  },

  select<const T extends readonly [string, ...string[]]>(opts: {
    label: string;
    options: T;
    required?: boolean;
    default?: T[number];
  }) {
    return makeField(applyRequired(z.enum(opts.options), opts.required), {
      widget: "select",
      label: opts.label,
      required: opts.required ?? true,
      options: [...opts.options],
      multiple: false,
      default: opts.default,
    });
  },

  list: listField,

  object<F extends CmsFieldsMap>(opts: {
    label: string;
    required?: boolean;
    fields: F;
  }) {
    type ObjSchema = z.ZodObject<{ [K in keyof F]: F[K]["_zodSchema"] }>;
    const shape = Object.fromEntries(
      Object.entries(opts.fields).map(([k, v]) => [k, v._zodSchema])
    ) as { [K in keyof F]: F[K]["_zodSchema"] };
    const decapFields: DecapFieldConfig[] = Object.entries(opts.fields).map(
      ([name, f]) => ({
        name,
        ...f._decapConfig,
        label: `${f._decapConfig.label} [${name}]`,
      })
    );
    return makeField(
      applyRequired(z.object(shape) as ObjSchema, opts.required),
      {
        widget: "object",
        label: opts.label,
        required: opts.required ?? true,
        collapsed: false,
        fields: decapFields,
      }
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
    Object.entries(opts.fields).map(([k, v]) => [
      k,
      v._decapConfig.widget === "list"
        ? v._zodSchema.optional().default([])
        : v._zodSchema.optional(),
    ])
  ) as { [K in keyof F]: z.ZodOptional<F[K]["_zodSchema"]> };

  const decapFields: DecapFieldConfig[] = Object.entries(opts.fields).map(
    ([name, f]) => ({
      name,
      ...f._decapConfig,
      label: `${f._decapConfig.label} [${name}]`,
    })
  );

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
