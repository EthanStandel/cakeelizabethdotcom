import { Component } from "solid-js";
import { FlavorMenuModuleType } from "~/models/modules/FlavorMenuModule.shape";
import { Content } from "~/components/Content";
import { ContentFor } from "~/components/ContentFor";

export const FlavorMenuModule: Component<{ shape: FlavorMenuModuleType }> = (
  props
) => (
  <section>
    <Content content={props.shape} property="heading" type="string">
      {(heading, cmsProp) => <h2 {...cmsProp()}>{heading()}</h2>}
    </Content>
    <ul class="flex flex-col">
      <ContentFor each={props.shape} field="categories">
        {(category) => (
          <li class="pt-5">
            <Content content={category} property="name" type="string">
              {(name, cmsProp) => (
                <h3 class="border-primary border-b-2" {...cmsProp()}>
                  {name()}
                </h3>
              )}
            </Content>
            <ul class="flex flex-wrap gap-2 mt-5">
              <ContentFor each={category} field="flavors">
                {(flavor) => (
                  <Content content={flavor} property="name" type="string">
                    {(name, cmsProp) => (
                      <li
                        class="rounded-full border border-border bg-eggshell px-2 py-1 text-sm"
                        {...cmsProp()}
                      >
                        {name()}
                      </li>
                    )}
                  </Content>
                )}
              </ContentFor>
            </ul>
          </li>
        )}
      </ContentFor>
    </ul>
    <p>
      <Content content={props.shape} property="footnote" type="string" />
    </p>
  </section>
);
