import { Component, Show } from "solid-js";
import { GeneralModuleType } from "~/models/modules/GeneralModule.shape";
import { Content } from "~/components/Content";
import { ContentFor } from "~/components/ContentFor";
import { CtaList } from "~/components/CtaList";

export const GeneralModule: Component<{ shape: GeneralModuleType }> = (
  props
) => (
  <section>
    <ContentFor each={props.shape} field="submodules">
      {(item, index) => (
        <div class="not-first:pt-module-dsk-gap @max-dsk:not-first:pt-module-mbl-gap">
          <Show when={index() > 0}>
            <hr class="h-0.5 w-full bg-primary text-primary mb-module-dsk-gap @max-dsk:mb-module-mbl-gap" />
          </Show>
          <Content content={item} property="title" type="string">
            {(title, cmsProp) => <h2 {...cmsProp()}>{title()}</h2>}
          </Content>
          <Content content={item} property="heroImage" type="string">
            {(heroImage, cmsProp) => (
              <div class="max-h-32 bg-primary overflow-hidden flex justify-center not-first:mt-5">
                <img
                  class="object-contain"
                  src={heroImage()}
                  alt=""
                  {...cmsProp()}
                />
              </div>
            )}
          </Content>
          <Content content={item} property="body" type="markdown" />
          <CtaList each={item} />
        </div>
      )}
    </ContentFor>
  </section>
);
