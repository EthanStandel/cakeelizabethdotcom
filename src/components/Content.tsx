import type { JSX } from "solid-js";
import get from "lodash/get";
import { marked } from "marked";
import { useCmsPath } from "~/lib/cms/CmsPathContext";

interface ContentProps<
  Content extends object,
  Type extends "string" | "markdown"
> {
  content: Content | undefined;
  property: keyof Content & string;
  type: Type;
  children?: (
    element: () => Type extends "markdown" ? JSX.Element : string,
    cmsProp: () => { "data-cms-field": string }
  ) => JSX.Element;
}

export function Content<
  Content extends object,
  Type extends "string" | "markdown"
>(props: ContentProps<Content, Type>) {
  const cmsPath = useCmsPath();
  const fieldPath = () =>
    cmsPath ? `${cmsPath}.${props.property}` : props.property;

  const value = () =>
    props.content != null
      ? (get(props.content, props.property) as string | undefined)
      : undefined;

  return (
    <>
      {!value() ? null : props.type === "markdown" ? (
        props.children ? (
          props.children(
            () =>
              (
                <div
                  class="not-first:mt-5"
                  innerHTML={marked(value()!) as string}
                />
              ) as any,
            () => ({ "data-cms-field": fieldPath() })
          )
        ) : (
          <div
            data-cms-field={fieldPath()}
            class="not-first:mt-5"
            innerHTML={marked(value()!) as string}
          />
        )
      ) : props.children ? (
        props.children(value! as any, () => ({
          "data-cms-field": fieldPath(),
        }))
      ) : (
        <span data-cms-field={fieldPath()}>{value()}</span>
      )}
    </>
  );
}
