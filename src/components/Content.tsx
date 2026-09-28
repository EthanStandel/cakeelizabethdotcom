import type { JSX } from "solid-js";
import get from "lodash/get";
import { marked } from "marked";
import { CmsProp, useCmsFieldProps } from "~/lib/cms/CmsPathContext";

interface ContentProps<
  Content extends object,
  Type extends "string" | "markdown",
> {
  content: Content | undefined;
  property: keyof Content & string;
  type: Type;
  children?: (
    element: () => Type extends "markdown" ? JSX.Element : string,
    cmsProp: CmsProp,
  ) => JSX.Element;
}

export function Content<
  Content extends object,
  Type extends "string" | "markdown",
>(props: ContentProps<Content, Type>) {
  const cmsProp = useCmsFieldProps(() => props.property);

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
            cmsProp,
          )
        ) : (
          <div
            {...cmsProp()}
            class="not-first:mt-5"
            innerHTML={marked(value()!) as string}
          />
        )
      ) : props.children ? (
        props.children(value! as any, cmsProp)
      ) : (
        <span {...cmsProp()}>{value()}</span>
      )}
    </>
  );
}
