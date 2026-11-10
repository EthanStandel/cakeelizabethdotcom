import { Component } from "solid-js";
import { VerticalStepperModuleType } from "~/models/modules/VerticalStepperModule.shape";
import { Content } from "~/components/Content";
import { ContentFor } from "~/components/ContentFor";

export const VerticalStepperModule: Component<{
  shape: VerticalStepperModuleType;
}> = (props) => (
  <section class="module-section">
    <div class="module-content">
      <Content content={props.shape} property="heading" type="string">
        {(heading, cmsProp) => <h2 {...cmsProp()}>{heading()}</h2>}
      </Content>
      <ol role="list" class="block-padding list-none grid gap-8">
        <ContentFor each={props.shape} field="steps">
          {(step, index) => (
            <li class="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
              <span
                aria-hidden="true"
                class="w-14 font-serif italic text-4xl leading-none text-primary-foreground"
              >
                {index() + 1}.
              </span>
              <div>
                <Content content={step} property="title" type="string">
                  {(title, cmsProp) => <h3 {...cmsProp()}>{title()}</h3>}
                </Content>
                <Content content={step} property="description" type="string">
                  {(description, cmsProp) => (
                    <p class="mt-1" {...cmsProp()}>
                      {description()}
                    </p>
                  )}
                </Content>
              </div>
            </li>
          )}
        </ContentFor>
      </ol>
    </div>
  </section>
);
