import { Metadata } from "next";
import { useTina } from "tinacms/dist/react";
import client from "../../tina/__generated__/client";

type Queries = typeof client.queries;
export type ContentType = keyof Queries;
export type ContentTypes = ReadonlyArray<ContentType>;
export type OptionalContentMultiType = ContentType | ContentTypes;
type CallResult<Type extends ContentType> = Awaited<ReturnType<Queries[Type]>>;
type ContentDataSingle<Type extends ContentType> =
  CallResult<Type>["data"] extends Record<Type, infer Data>
    ? Data
    : CallResult<Type>["data"];
type ContentDataMulti<Types extends ContentTypes> = {
  [K in keyof Types]: ContentDataSingle<Types[K]>;
};
export type ContentData<Type extends OptionalContentMultiType> =
  Type extends ContentType
    ? ContentDataSingle<Type>
    : Type extends ContentTypes
    ? ContentDataMulti<Type>
    : never;
type ContentSingle<Type extends ContentType> = {
  type: Type;
  query: CallResult<Type>["query"];
  variables: CallResult<Type>["variables"];
  data: CallResult<Type>["data"];
};
type ContentMulti<Types extends ContentTypes> = {
  [K in keyof Types]: ContentSingle<Types[K]>;
};
export type Content<Type extends OptionalContentMultiType> =
  Type extends ContentType
    ? ContentSingle<Type>
    : Type extends ContentTypes
    ? ContentMulti<Type>
    : never;
export const getContent = async <Types extends OptionalContentMultiType>(
  typesInput: Types,
  slugsInput?: Types extends ContentTypes ? ReadonlyArray<string> : string
): Promise<Content<Types>> => {
  const isTuple = Array.isArray(typesInput);
  const types = isTuple ? typesInput : [typesInput];
  const slugs = isTuple ? slugsInput : [slugsInput];
  const result = await Promise.all(
    types.map(async (type, index) => ({
      ...(await client.queries[type]({
        relativePath: `${slugs?.[index] ?? type}.md`,
      })),
      type,
    }))
  );

  //@ts-expect-error Ignore this, allow blackbox
  return isTuple ? result : result[0];
};

export const getContentData = async <Types extends OptionalContentMultiType>(
  typesInput: Types,
  slugsInput?: Types extends ContentTypes ? ReadonlyArray<string> : string
): Promise<ContentData<Types>> => {
  const content = await getContent(typesInput, slugsInput);
  const isTuple = Array.isArray(content);
  const types = (isTuple ? typesInput : [typesInput]) as ContentTypes;
  const contents = (
    isTuple ? content : [content]
  ) as ContentMulti<ContentTypes>;
  const result = contents.map(({ data }, index) => {
    if (!(types[index] in data)) throw new Error("Unexpected content model");
    return (data as any)[types[index]];
  });

  //@ts-expect-error Ignore this, allow blackbox
  return isTuple ? result : result[0];
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
  <Type extends ContentTypeWithMetadata>(
    type: Type,
    path: string,
    slug?: string
  ) =>
  async (): Promise<Metadata> => {
    const data = (await getContentData(type, slug as any)) as PageWithMetadata;
    const metadata = "metadata" in data ? data.metadata : {};
    return {
      ...metadata,
      title: (metadata.title ? `${metadata.title} | ` : "") + "Cake Elizabeth",
      alternates: {
        canonical: `${path}${slug ? `/${slug}` : ""}`,
      },
    };
  };
