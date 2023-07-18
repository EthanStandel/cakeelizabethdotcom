import { useTina } from "tinacms/dist/react";
import client from "../../.tina/__generated__/client";

type Queries = typeof client.queries;
type ContentType = keyof Queries;
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

const getContentMetadata = async <Type extends ContentTypeWithMetadata>(
  type: Type,
  key?: string
): Promise<PageWithMetadata["metadata"]> => {
  const data = (await getContent(type, key)).data as Record<Type, any>;

  if (!(type in data)) return {};

  if ("metadata" in data[type]) {
    return data[type].metadata;
  } else return {};
};

export const getPageMetadataGenerator =
  <Type extends ContentTypeWithMetadata>(type: Type, key?: string) =>
  () =>
    getContentMetadata(type, key);
