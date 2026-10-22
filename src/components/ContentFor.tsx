import { For, Accessor, JSX } from "solid-js";
import {
  CmsPathContextProvider,
  CmsProp,
  CmsSource,
  CmsSourceContextProvider,
  useCmsFieldProps,
} from "~/lib/cms/CmsPathContext";

type ArrayField<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends readonly any[] ? K : never;
}[keyof T];

type ArrayItem<T, K extends keyof T> = NonNullable<
  T[K]
> extends readonly (infer U)[]
  ? U
  : never;

type ContentForProps<TParent, TField extends ArrayField<TParent>> = {
  each: TParent | null | undefined;
  field: TField;
  source?: CmsSource;
  fallback?: JSX.Element;
  children: (
    item: NonNullable<ArrayItem<TParent, TField>>,
    index: Accessor<number>,
    cmsProp: CmsProp
  ) => JSX.Element;
};

export function ContentFor<TParent, TField extends ArrayField<TParent>>(
  props: ContentForProps<TParent, TField>
): JSX.Element {
  return (
    <For
      each={(props.each?.[props.field] as readonly any[] | undefined) ?? []}
      fallback={props.fallback}
    >
      {(item, index) => {
        const pathValue = `${String(props.field)}.${index()}`;
        const cmsProp: CmsProp = useCmsFieldProps(
          () => pathValue,
          props.source
        );
        return props.source ? (
          <CmsSourceContextProvider
            collection={props.source.collection}
            slug={props.source.slug}
          >
            <CmsPathContextProvider value={pathValue}>
              {props.children(item, index, cmsProp)}
            </CmsPathContextProvider>
          </CmsSourceContextProvider>
        ) : (
          <CmsPathContextProvider value={pathValue}>
            {props.children(item, index, cmsProp)}
          </CmsPathContextProvider>
        );
      }}
    </For>
  );
}
