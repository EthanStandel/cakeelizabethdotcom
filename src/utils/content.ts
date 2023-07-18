import { useTina } from "tinacms/dist/react";
import client from "../../tina/__generated__/client";

type Queries = typeof client.queries;
export type ContentType = keyof Queries;
type CallResult<Type extends ContentType> = Awaited<ReturnType<Queries[Type]>>;
export type ContentData<Type extends ContentType> =
  CallResult<Type>["data"] extends Record<Type, infer Data>
    ? Data
    : CallResult<Type>["data"];
export type Content<Type extends ContentType> = {
  type: Type;
  query: CallResult<Type>["query"];
  variables: CallResult<Type>["variables"];
  data: CallResult<Type>["data"];
};

export const getContent = async <Type extends ContentType>(
  type: Type,
  key?: string
): Promise<Content<Type>> => ({
  ...(await client.queries[type]({
    relativePath: `${key ?? type}.md`,
  })),
  type,
});

export const getContentData = async <Type extends ContentType>(
  type: Type,
  key?: string
): Promise<ContentData<Type>> => {
  const { data } = await getContent(type, key);
  if (!(type in data)) throw new Error("Unexpected content model");
  return (data as Record<Type, any>)[type];
};

export const useContentData = <Type extends ContentType>({
  type,
  ...content
}: Content<Type>): ContentData<Type> => {
  const { data } = useTina(content);
  if (!(type in data)) throw new Error("Unexpected content model");
  return (data as Record<Type, any>)[type];
};

type PageWithMetadata = { metadata?: { title?: string; description?: string } };
type ContentTypeWithMetadata = {
  [K in keyof Queries]: ContentData<K> extends PageWithMetadata ? K : never;
}[keyof Queries];

export const getPageMetadataGenerator =
  <Type extends ContentTypeWithMetadata>(type: Type, key?: string) =>
  async () => {
    const data = (await getContentData(type, key)) as PageWithMetadata;
    const metadata = "metadata" in data ? data.metadata : {};
    return {
      ...metadata,
      title: (metadata.title ? `${metadata.title} | ` : "") + "Cake Elizabeth",
    };
  };
