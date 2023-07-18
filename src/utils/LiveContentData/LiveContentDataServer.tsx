import { draftMode } from "next/dist/client/components/headers";
import { ReactElement } from "react";
import { asyncComponent } from "../asyncComponent";
import {
  ContentData,
  ContentType,
  getContent,
  getContentData,
} from "../content";
import { LiveContentDataClient } from "./LiveContentDataClient";

export const LiveContentDataServer = asyncComponent(
  async <Type extends ContentType>({
    server: Component,
    client,
    type,
    key,
  }: {
    server: (props: { data: ContentData<Type> }) => ReactElement;
    client: (props: { data: ContentData<Type> }) => ReactElement;
    type: Type;
    key?: string;
  }) => {
    const isDraftMode = draftMode().isEnabled;

    if (isDraftMode) {
      return (
        <LiveContentDataClient
          content={await getContent(type, key)}
          component={client}
        />
      );
    } else {
      return <Component data={await getContentData(type, key)} />;
    }
  }
);
