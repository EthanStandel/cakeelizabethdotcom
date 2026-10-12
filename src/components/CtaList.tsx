import { Component, Show } from "solid-js";
import { cx } from "cva";
import { Content } from "~/components/Content";
import { ContentFor } from "~/components/ContentFor";
import { LinkButton } from "~/components/LinkButton";
import { LinkType } from "~/models/components/Link.shape";

export const CtaList: Component<{
  each: { ctaList?: LinkType[] } | nil;
  class?: string | false;
}> = (props) => (
  <Show when={props.each?.ctaList?.length}>
    <div class={cx("flex flex-wrap gap-2 not-first:mt-5", props.class)}>
      <ContentFor each={props.each} field="ctaList">
        {(cta) => (
          <Content content={cta} property="label" type="string">
            {(label, cmsProp) =>
              cta.url && cta.label ? (
                <LinkButton href={cta.url} variant={cta.variant} {...cmsProp()}>
                  {label()}
                </LinkButton>
              ) : null
            }
          </Content>
        )}
      </ContentFor>
    </div>
  </Show>
);
