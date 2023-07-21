"use client";

import { ReactElement } from "react";
import {
  Content,
  ContentData,
  OptionalContentMultiType,
  useContentData,
} from "../content";

export const LiveContentDataClient = <
  Type extends OptionalContentMultiType,
  Props extends { data: ContentData<Type> }
>({
  component: Component,
  content: contentInput,
  ...forwardProps
}: {
  component: (props: Props) => ReactElement;
  content: Content<Type>;
} & Omit<Props, "data">) => {
  const isTuple = Array.isArray(contentInput);
  const content = isTuple ? contentInput : [contentInput];

  // yes, I know this breaks the rules of hooks, don't @ me
  // the size of the content array will never change at runtime
  // and is type enforced to only be a ReadonlyArray when variadic
  const data = content.map((content) => useContentData(content));

  const props = {
    data: isTuple ? data : (data[0] as any),
    ...forwardProps,
  } as any as Props;

  return <Component {...props} />;
};
