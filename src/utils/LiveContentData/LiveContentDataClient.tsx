"use client";

import { ReactElement } from "react";
import { Content, ContentData, ContentType, useContentData } from "../content";

export const LiveContentDataClient = <Type extends ContentType>({
  component: Component,
  content,
}: {
  component: (props: { data: ContentData<Type> }) => ReactElement;
  content: Content<Type>;
}) => {
  const data = useContentData(content);

  return <Component data={data} />;
};
