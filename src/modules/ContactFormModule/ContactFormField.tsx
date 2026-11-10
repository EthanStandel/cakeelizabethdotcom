import { Component, createUniqueId, Show } from "solid-js";
import { cx } from "cva";
import { Content } from "~/components/Content";
import {
  CmsPathContextProvider,
  useCmsFieldProps,
} from "~/lib/cms/CmsPathContext";
import type {
  ContactFormErrorField,
  ContactFormKey,
} from "./contactFormValidation";

type ContactFormFieldContent = Partial<
  Record<
    | "label"
    | "optionalLabel"
    | "placeholder"
    | "hint"
    | "requiredError"
    | "invalidError",
    string
  >
>;

type ContactFormControl = HTMLInputElement | HTMLTextAreaElement;

interface ContactFormFieldProps {
  name: ContactFormKey;
  content: ContactFormFieldContent | undefined;
  type?: "text" | "email" | "tel";
  autocomplete?: string;
  required?: boolean;
  multiline?: boolean;
  class?: string;
  value: string;
  error: ContactFormErrorField | undefined;
  onInput: (value: string) => void;
  onBlur: () => void;
  controlRef: (control: ContactFormControl) => void;
}

const TEXTAREA_ROWS = 7;

const ContactFormFieldBody: Component<ContactFormFieldProps> = (props) => {
  const controlId = createUniqueId();
  const errorId = createUniqueId();
  const hintId = createUniqueId();
  const placeholderCmsProp = useCmsFieldProps(() => "placeholder");

  const describedBy = () =>
    props.error ? errorId : props.content?.hint ? hintId : undefined;

  const controlProps = () => ({
    id: controlId,
    name: props.name,
    required: props.required,
    placeholder: props.content?.placeholder,
    value: props.value,
    "aria-invalid": props.error ? ("true" as const) : undefined,
    "aria-describedby": describedBy(),
    class: cx(
      "w-full rounded-xl border bg-white px-3.5 py-3 font-sans text-base text-primary-foreground outline-none transition-colors focus:ring-3 focus:ring-primary/35",
      props.error ? "border-error" : "border-border focus:border-primary",
    ),
    ...(props.content?.placeholder ? placeholderCmsProp() : {}),
  });

  return (
    <div class={cx("flex flex-col gap-1.5", props.class)}>
      <Content content={props.content} property="label" type="string">
        {(label, cmsProp) => (
          <label
            for={controlId}
            class="text-xs @max-dsk:text-sm uppercase tracking-widest text-secondary-foreground"
            {...cmsProp()}
          >
            {label()}
            <Content
              content={props.content}
              property="optionalLabel"
              type="string"
            >
              {(optionalLabel, optionalCmsProp) => (
                <>
                  {" "}
                  <span
                    class="normal-case tracking-normal"
                    {...optionalCmsProp()}
                  >
                    {optionalLabel()}
                  </span>
                </>
              )}
            </Content>
          </label>
        )}
      </Content>
      <Show
        when={props.multiline}
        fallback={
          <input
            {...controlProps()}
            ref={props.controlRef}
            type={props.type ?? "text"}
            autocomplete={props.autocomplete}
            onInput={(event) => props.onInput(event.currentTarget.value)}
            onBlur={props.onBlur}
          />
        }
      >
        <textarea
          {...controlProps()}
          ref={props.controlRef}
          rows={TEXTAREA_ROWS}
          class={cx(controlProps().class, "resize-y")}
          onInput={(event) => props.onInput(event.currentTarget.value)}
          onBlur={props.onBlur}
        />
      </Show>
      <Show
        when={props.error}
        fallback={
          <Content content={props.content} property="hint" type="string">
            {(hint, cmsProp) => (
              <span
                id={hintId}
                class="text-sm @max-dsk:text-base text-secondary-foreground"
                {...cmsProp()}
              >
                {hint()}
              </span>
            )}
          </Content>
        }
      >
        {(errorField) => (
          <Content
            content={props.content}
            property={errorField()}
            type="string"
          >
            {(message, cmsProp) => (
              <span
                id={errorId}
                class="text-sm @max-dsk:text-base text-error"
                {...cmsProp()}
              >
                {message()}
              </span>
            )}
          </Content>
        )}
      </Show>
    </div>
  );
};

export const ContactFormField: Component<ContactFormFieldProps> = (props) => (
  <CmsPathContextProvider value={props.name}>
    <ContactFormFieldBody {...props} />
  </CmsPathContextProvider>
);
