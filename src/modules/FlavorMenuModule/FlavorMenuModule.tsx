import { Component, Show, Suspense } from "solid-js";
import { Dynamic } from "solid-js/web";
import { cx } from "cva";
import { FlavorMenuModuleType } from "~/models/modules/FlavorMenuModule.shape";
import { FlavorCategoriesShape } from "~/models/FlavorCategories.shape";
import { getCollectionItem } from "~/lib/content";
import { createContentFetch } from "~/primitives/createContentFetch";
import { Content } from "~/components/Content";
import { ContentFor } from "~/components/ContentFor";
import { ListItemChip } from "~/components/ListItemChip";

export const FlavorMenuModule: Component<{ shape: FlavorMenuModuleType }> = (
  props,
) => {
  const flavorData = createContentFetch(FlavorCategoriesShape.name, () =>
    getCollectionItem(FlavorCategoriesShape, "main"),
  );

  return (
    <section class="module-section">
      <div class="module-content">
        <Content content={props.shape} property="heading" type="string">
          {(heading, cmsProp) => <h2 {...cmsProp()}>{heading()}</h2>}
        </Content>
        <Suspense>
          <Show when={flavorData()}>
            {(data) => (
              <ul
                class={cx(
                  "block-padding grid",
                  props.shape?.layout === "columns"
                    ? "grid-cols-3 gap-10 @max-dsk:grid-cols-1 @max-dsk:gap-5"
                    : "gap-5",
                )}
              >
                <ContentFor
                  each={data()}
                  field="categories"
                  source={{
                    collection: FlavorCategoriesShape.name,
                    slug: "main",
                  }}
                >
                  {(category) => (
                    <li>
                      <Content content={category} property="name" type="string">
                        {(name, cmsProp) => (
                          <Dynamic
                            component={props.shape?.heading ? "h3" : "h2"}
                            class="heading-3 border-primary border-b-2"
                            {...cmsProp()}
                          >
                            {name()}
                          </Dynamic>
                        )}
                      </Content>
                      <ul class="flex flex-wrap gap-2 mt-5">
                        <ContentFor each={category} field="flavors">
                          {(flavor) => (
                            <Content
                              content={flavor}
                              property="name"
                              type="string"
                            >
                              {(name, cmsProp) => (
                                <ListItemChip {...cmsProp()}>
                                  {name()}
                                </ListItemChip>
                              )}
                            </Content>
                          )}
                        </ContentFor>
                      </ul>
                    </li>
                  )}
                </ContentFor>
              </ul>
            )}
          </Show>
        </Suspense>
        <Content content={props.shape} property="footnote" type="string">
          {(footnote, cmsProp) => <p {...cmsProp()}>{footnote()}</p>}
        </Content>
      </div>
    </section>
  );
};
