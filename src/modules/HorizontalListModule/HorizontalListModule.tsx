import { Component, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { HorizontalListModuleType } from "~/models/modules/HorizontalListModule.shape";
import { Content } from "~/components/Content";
import { ContentFor } from "~/components/ContentFor";

export const HorizontalListModule: Component<{
  shape: HorizontalListModuleType;
}> = (props) => (
  <section class="module-section">
    <div class="module-content">
      <Content content={props.shape} property="heading" type="string">
        {(heading, cmsProp) => <h2 {...cmsProp()}>{heading()}</h2>}
      </Content>
      <Dynamic
        component={props.shape?.enumerate ? "ol" : "ul"}
        role="list"
        class="block-padding list-none grid grid-flow-col auto-cols-fr gap-8 @max-dsk:grid-flow-row @max-dsk:gap-5"
      >
        <ContentFor each={props.shape} field="items">
          {(item, index) => (
            <li>
              <Content content={item} property="title" type="string">
                {(title, cmsProp) => (
                  <h3 class="border-primary border-b-2" {...cmsProp()}>
                    <Show when={props.shape?.enumerate}>
                      <span aria-hidden="true" class="italic">
                        {index() + 1}.
                      </span>{" "}
                    </Show>
                    {title()}
                  </h3>
                )}
              </Content>
              <Content content={item} property="description" type="string">
                {(description, cmsProp) => (
                  <p {...cmsProp()}>{description()}</p>
                )}
              </Content>
            </li>
          )}
        </ContentFor>
      </Dynamic>
    </div>
  </section>
);
