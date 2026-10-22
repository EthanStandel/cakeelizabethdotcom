import { Component, onMount } from "solid-js";
import { cx } from "cva";
import { ContactFormModuleType } from "~/models/modules/ContactFormModule.shape";
import { Content } from "~/components/Content";
import { secondaryLinkButtonClass } from "~/components/LinkButton";
import { moduleArrivalClass } from "~/components/ModuleTransition";
import { CmsPathContextProvider } from "~/lib/cms/CmsPathContext";
import { fillTokens } from "~/lib/utils/fillTokens";

type SentPanelTokens = Record<"firstName" | "email", string>;

interface ContactFormSentPanelProps {
  content: NonNullable<ContactFormModuleType>["sent"] | undefined;
  name: string;
  email: string;
  onReset: () => void;
}

const firstWordOf = (name: string) => name.trim().split(/\s+/)[0];

const ContactFormSentPanelBody: Component<ContactFormSentPanelProps> = (
  props,
) => {
  let heading: HTMLHeadingElement | undefined;

  const tokens = (): SentPanelTokens => ({
    firstName: firstWordOf(props.name),
    email: props.email.trim(),
  });

  onMount(() => heading?.focus());

  return (
    <div
      class={cx(
        "block-padding rounded-2xl border-2 border-primary p-5",
        moduleArrivalClass,
      )}
    >
      <Content content={props.content} property="heading" type="string">
        {(text, cmsProp) => (
          <h3
            ref={heading}
            tabindex={-1}
            class="inline-block border-b-2 border-primary outline-none"
            {...cmsProp()}
          >
            {fillTokens(text(), tokens())}
          </h3>
        )}
      </Content>
      <Content content={props.content} property="body" type="string">
        {(text, cmsProp) => (
          <p {...cmsProp()}>{fillTokens(text(), tokens())}</p>
        )}
      </Content>
      <Content content={props.content} property="resetLabel" type="string">
        {(label, cmsProp) => (
          <div class="flex flex-wrap gap-2 not-first:mt-5">
            <button
              type="button"
              class={cx(secondaryLinkButtonClass, "cursor-pointer")}
              onClick={props.onReset}
              {...cmsProp()}
            >
              {label()}
            </button>
          </div>
        )}
      </Content>
    </div>
  );
};

export const ContactFormSentPanel: Component<ContactFormSentPanelProps> = (
  props,
) => (
  <CmsPathContextProvider value="sent">
    <ContactFormSentPanelBody {...props} />
  </CmsPathContextProvider>
);
