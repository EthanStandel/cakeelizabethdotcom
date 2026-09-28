import { Accessor, Component, Show } from "solid-js";
import { Mail } from "lucide-solid";
import { GalleryItemsType } from "~/models/GalleryItems.shape";
import { ConstantsShape } from "~/models";
import { Content } from "~/components/Content";
import { ContentFor } from "~/components/ContentFor";
import { Eyebrow } from "~/components/Eyebrow";
import { LinkButton } from "~/components/LinkButton";
import { ListItemChip } from "~/components/ListItemChip";
import { useCmsFieldProps } from "~/lib/cms/CmsPathContext";
import { useConstants } from "~/primitives/ConstantsContext";

export type GalleryItem = NonNullable<GalleryItemsType["items"]>[number];

interface GalleryModalContentProps {
  item: Accessor<GalleryItem | null>;
}

const formatGalleryDate = (date: string): string =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

export const GalleryModalContent: Component<GalleryModalContentProps> = (
  props,
) => {
  const constants = useConstants();
  const inquireCmsProp = useCmsFieldProps(() => "inquireLabel", {
    collection: ConstantsShape.name,
    slug: "main",
  });
  return (
    <div class="p-5 gap-5 flex flex-col justify-between h-full">
      <div class="flex-1">
        <Content
          content={props.item() ?? undefined}
          property="date"
          type="string"
        >
          {(date, cmsProp) => (
            <Eyebrow class="text-center mb-2" {...cmsProp()}>
              {formatGalleryDate(date())}
            </Eyebrow>
          )}
        </Content>
        <Content
          content={props.item() ?? undefined}
          property="title"
          type="string"
        >
          {(title, cmsProp) => (
            <>
              <h2 class="text-center" {...cmsProp()}>
                {title()}
              </h2>
            </>
          )}
        </Content>
        <hr class="group-first/submodule:@dsk:hidden h-0.5 w-full bg-primary text-primary my-5" />
        <Content
          content={props.item() ?? undefined}
          property="description"
          type="string"
        >
          {(description, cmsProp) => (
            <p
              class="text-sm leading-relaxed text-secondary-foreground text-center"
              {...cmsProp()}
            >
              {description()}
            </p>
          )}
        </Content>
      </div>

      <div class="grow flex flex-col justify-end">
        <hr class="group-first/submodule:@dsk:hidden h-0.5 w-full bg-primary text-primary mb-5" />
        <Show when={props.item()?.tags?.length}>
          <ul class="flex flex-wrap justify-center gap-2 mb-5">
            <ContentFor each={props.item()} field="tags">
              {(tag, _index, cmsProp) => (
                <ListItemChip {...cmsProp()}>{tag}</ListItemChip>
              )}
            </ContentFor>
          </ul>
          <hr class="group-first/submodule:@dsk:hidden h-0.5 w-full bg-primary text-primary mb-5" />
        </Show>
        <LinkButton class="w-full" href="/contact" {...inquireCmsProp()}>
          <Mail size={16} />
          {constants()?.inquireLabel ?? "Inquire"}
        </LinkButton>
      </div>
    </div>
  );
};
