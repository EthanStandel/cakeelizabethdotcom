import { draftMode } from "next/headers";
import { FC } from "react";
import { asyncComponent } from "../asyncComponent";
import {
  ContentData,
  ContentTypes,
  getContent,
  getContentData,
  OptionalContentMultiType,
} from "../content";
import { LiveContentDataClient } from "./LiveContentDataClient";

export const LiveContentDataServer = asyncComponent(
  async <
    Type extends OptionalContentMultiType,
    Props extends { data: ContentData<Type> }
  >({
    component: Component,
    clientWrapper = Component,
    type,
    slug,
    ...props
  }: {
    component: FC<Props>;
    clientWrapper?: FC<Props>;
    type: Type;
    slug?: Type extends ContentTypes ? ReadonlyArray<string> : string;
  } & Omit<Props, "data">) =>
    draftMode().isEnabled ? (
      <LiveContentDataClient
        content={await getContent(type, slug)}
        component={clientWrapper}
        {...(props as any)}
      />
    ) : (
      <Component data={await getContentData(type, slug)} {...(props as any)} />
    )
);
