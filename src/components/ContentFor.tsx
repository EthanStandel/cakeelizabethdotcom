import { For, Accessor, JSX } from "solid-js";
import { CmsPathContextProvider } from "~/lib/cms/CmsPathContext";

type ArrayField<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends readonly any[] ? K : never;
}[keyof T];

type ArrayItem<T, K extends keyof T> =
  NonNullable<T[K]> extends readonly (infer U)[] ? U : never;

type ContentForProps<TParent, TField extends ArrayField<TParent>> = {
  each: TParent | null | undefined;
  field: TField;
  fallback?: JSX.Element;
  children: (
    item: NonNullable<ArrayItem<TParent, TField>>,
    index: Accessor<number>
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
      {(item, index) => (
        <CmsPathContextProvider value={`${String(props.field)}.${index()}`}>
          {props.children(item, index)}
        </CmsPathContextProvider>
      )}
    </For>
  );
}
