import { Component } from "solid-js";
import { GeneralModuleType } from "~/models/modules/GeneralModule.shape";
import { Content } from "~/components/Content";
import { ContentFor } from "~/components/ContentFor";
import { Eyebrow } from "~/components/Eyebrow";
import { LinkButton } from "~/components/LinkButton";

export const GeneralModule: Component<{ shape: GeneralModuleType }> = (
  props
) => (
  <section class="not-first:pt-10">
    <ContentFor each={props.shape} field="submodules">
      {(item) => (
        <div class="not-first:pt-10 @dsk:not-first:pt-12 group/submodule">
          <hr class="group-first/submodule:hidden h-0.5 w-full bg-primary text-primary mb-10 @dsk:mb-12" />
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
          <ContentFor each={item} field="ctaList">
            {(cta) => (
              <Content content={cta} property="label" type="string">
                {(label, cmsProp) =>
                  cta.url && cta.label ? (
                    <LinkButton
                      href={cta.url}
                      variant={cta.variant}
                      class="not-first:mt-5"
                      {...cmsProp()}
                    >
                      {label()}
                    </LinkButton>
                  ) : null
                }
              </Content>
            )}
          </ContentFor>
        </div>
      )}
    </ContentFor>
  </section>
);
