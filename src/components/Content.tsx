import type { JSX } from "solid-js";
import get from "lodash/get";
import { marked } from "marked";

interface ContentProps<T extends object> {
  content: T | undefined;
  property: keyof T & string;
  type: "string" | "markdown";
  children?: (element: JSX.Element, cmsField: string) => JSX.Element;
}

export function Content<T extends object>(props: ContentProps<T>) {
  const value = () =>
    props.content != null
      ? (get(props.content, props.property) as string | undefined)
      : undefined;

  const inner = (): JSX.Element =>
    props.type === "markdown" ? (
      <div innerHTML={marked(value() ?? "") as string} />
    ) : (
      <span>{value() ?? ""}</span>
    );

  if (props.children) {
    return <>{props.children(inner(), props.property)}</>;
  }

  return (
    <>
      {props.type === "markdown" ? (
        <div
          data-cms-field={props.property}
          innerHTML={marked(value() ?? "") as string}
        />
      ) : (
        <span data-cms-field={props.property}>{value() ?? ""}</span>
      )}
    </>
  );
}
