import { HeroModuleType } from "~/models/modules/HeroModule.shape";
import { cx } from "cva";
import { Eyebrow } from "~/components/Eyebrow";
import { Content } from "~/components/Content";
import { Component, Show } from "solid-js";
import { CtaList } from "~/components/CtaList";

export const HeroModule: Component<{ shape: HeroModuleType }> = (props) => {
  const isCentered = () => props.shape?.alignment === "center";
  const hasRuleAbove = () =>
    props.shape?.ruleAbove && !props.shape?.backgroundImage;

  return (
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
            <div
              class={cx(
                "z-20 absolute inset-0",
                isCentered()
                  ? "bg-black/50"
                  : "@dsk:bg-linear-to-r bg-linear-to-t from-black/75 via-black/50 to-transparent"
              )}
            />
          </div>
        )}
        <Show when={hasRuleAbove()}>
          <div class="content-container">
            <hr class="h-0.5 w-full bg-primary text-primary" />
          </div>
        </Show>
        <div
          class={cx(
            "relative z-30 content-container px-min-mbl-padding @dsk:px-min-dsk-padding",
            props.shape?.backgroundImage
              ? "@dsk:py-30 pt-30 pb-5"
              : "@dsk:py-12 py-8"
          )}
        >
          <div
            class={cx(
              "@dsk:max-w-1/2 max-w-xl",
              isCentered() && "mx-auto text-center"
            )}
          >
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
            <CtaList
              each={props.shape}
              class={isCentered() && "justify-center"}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
