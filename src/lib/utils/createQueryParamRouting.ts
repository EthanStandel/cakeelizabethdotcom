import { createMemo, type Accessor } from "solid-js";
import { useLocation, useNavigate, useSearchParams } from "@solidjs/router";
import type { ZodType, output as ZodOutput } from "zod";
import type { QueryParamSchema } from "./QueryParamSchema";

const buildHref = <TKey extends string, TSchema extends ZodType>(
  param: QueryParamSchema<TKey, TSchema>
) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const currentValue = createMemo<ZodOutput<TSchema> | null>(() => {
    const raw = searchParams[param.key];
    if (typeof raw !== "string") return null;
    try {
      const result = param.schema.safeParse(JSON.parse(raw));
      return result.success ? result.data : null;
    } catch {
      return null;
    }
  });

  const getHref = (value: ZodOutput<TSchema> | nil): string => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams ?? {})) {
      if (typeof v === "string") params.set(k, v);
    }
    if (value != null) {
      params.set(param.key, JSON.stringify(value));
    } else {
      params.delete(param.key);
    }
    const query = params.toString();
    return `${location.pathname}${query ? `?${query}` : ""}`;
  };

  return { currentValue, getHref };
};

const href = <TKey extends string, TSchema extends ZodType>(
  param: QueryParamSchema<TKey, TSchema>
): Record<TKey, Accessor<ZodOutput<TSchema> | null>> &
  Record<`get${Capitalize<TKey>}Href`, (value: ZodOutput<TSchema> | nil) => string> => {
  const { currentValue, getHref } = buildHref(param);
  const capitalizedKey = (param.key.charAt(0).toUpperCase() + param.key.slice(1)) as Capitalize<TKey>;

  return {
    [param.key]: currentValue,
    [`get${capitalizedKey}Href`]: getHref,
  } as Record<TKey, Accessor<ZodOutput<TSchema> | null>> &
    Record<`get${Capitalize<TKey>}Href`, (value: ZodOutput<TSchema> | nil) => string>;
};

const navigate = <TKey extends string, TSchema extends ZodType>(
  param: QueryParamSchema<TKey, TSchema>
): Record<TKey, Accessor<ZodOutput<TSchema> | null>> &
  Record<`navigate${Capitalize<TKey>}`, (value: ZodOutput<TSchema> | nil) => void> => {
  const navigateFn = useNavigate();
  const { currentValue, getHref } = buildHref(param);
  const capitalizedKey = (param.key.charAt(0).toUpperCase() + param.key.slice(1)) as Capitalize<TKey>;

  return {
    [param.key]: currentValue,
    [`navigate${capitalizedKey}`]: (value: ZodOutput<TSchema> | nil) => navigateFn(getHref(value)),
  } as Record<TKey, Accessor<ZodOutput<TSchema> | null>> &
    Record<`navigate${Capitalize<TKey>}`, (value: ZodOutput<TSchema> | nil) => void>;
};

const defineQueryParam = <TKey extends string, TSchema extends ZodType>(
  param: QueryParamSchema<TKey, TSchema>
) => ({
  ...param,
  href: () => href(param),
  navigate: () => navigate(param),
});

type DefinedQueryParam<TKey extends string, TSchema extends ZodType> = ReturnType<
  typeof defineQueryParam<TKey, TSchema>
>;

export const defineQueryParams = <TRecord extends Record<string, QueryParamSchema>>(
  params: TRecord
): {
  [K in keyof TRecord]: TRecord[K] extends QueryParamSchema<infer TKey extends string, infer TSchema extends ZodType>
    ? DefinedQueryParam<TKey, TSchema>
    : never;
} =>
  Object.fromEntries(
    Object.entries(params).map(([k, param]) => [k, defineQueryParam(param)])
  ) as never;
