import { HeroModuleType } from "~/models/modules/HeroModule.shape";
import { cx } from "cva";
import { Eyebrow } from "~/components/Eyebrow";
import { Content } from "~/components/Content";
import { Component } from "solid-js";
import { LinkButton } from "~/components/LinkButton";
import { ContentFor } from "~/components/ContentFor";

export const HeroModule: Component<{ shape: HeroModuleType }> = (props) => (
  <section class="@dsk:m-10 m-4">
    <div
      class={cx(
        "page-container relative",
        props.shape?.backgroundImage && "dark"
      )}
    >
      {props.shape?.backgroundImage && (
        <div class="absolute inset-0 size-full overflow-hidden">
          {props.shape?.backgroundImage && (
            <Content
              content={props.shape}
              property="backgroundImage"
              type="string"
            >
              {(backgroundImage, cmsProp) => (
                <img
                  src={backgroundImage()}
                  alt=""
                  class="absolute inset-0 size-full z-10 object-cover"
                  {...cmsProp()}
                />
              )}
            </Content>
          )}
          <div class="z-20 absolute inset-0 @dsk:bg-linear-to-r bg-linear-to-t from-black/75 via-black/50 to-transparent" />
        </div>
      )}
      <div
        class={cx(
          "relative z-30 content-container px-min-mbl-padding @dsk:px-min-dsk-padding",
          props.shape?.backgroundImage
            ? "@dsk:py-30 pt-30 pb-5"
            : "@dsk:py-12 py-8"
        )}
      >
        <div class="@dsk:max-w-1/2 max-w-xl">
          <Content content={props.shape} property="eyebrow" type="string">
            {(eyebrow, cmsProp) => (
              <div>
                <Eyebrow class="inline" {...cmsProp()}>
                  {eyebrow()}
                </Eyebrow>
              </div>
            )}
          </Content>
          <Content content={props.shape} property="content" type="markdown" />
          <div class="flex gap-2 not-first:mt-5">
            <ContentFor each={props.shape} field="ctaList">
              {(cta) => (
                <Content content={cta} property="label" type="string">
                  {(label, cmsProp) =>
                    cta.url && cta.label ? (
                      <LinkButton
                        href={cta.url}
                        variant={cta.variant}
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
        </div>
      </div>
    </div>
  </section>
);
