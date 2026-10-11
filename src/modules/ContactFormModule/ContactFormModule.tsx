import { Component, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import { cx } from "cva";
import { ContactFormModuleType } from "~/models/modules/ContactFormModule.shape";
import { Content } from "~/components/Content";
import { primaryLinkButtonClass } from "~/components/LinkButton";
import { useCmsFieldProps } from "~/lib/cms/CmsPathContext";
import { ContactFormField } from "./ContactFormField";
import {
  CONTACT_FORM_KEYS,
  ContactFormKey,
  ContactFormValues,
  validateContactForm,
} from "./contactFormValidation";

export const ContactFormModule: Component<{ shape: ContactFormModuleType }> = (
  props,
) => {
  const [values, setValues] = createStore<ContactFormValues>({
    name: "",
    email: "",
    phone: "",
    description: "",
  });
  const [touched, setTouched] = createStore<Record<ContactFormKey, boolean>>({
    name: false,
    email: false,
    phone: false,
    description: false,
  });
  const controls: Partial<Record<ContactFormKey, HTMLElement>> = {};

  const errors = createMemo(() => validateContactForm({ ...values }));
  const shownError = (key: ContactFormKey) =>
    touched[key] ? errors()[key] : undefined;

  const fieldProps = (key: ContactFormKey) => ({
    name: key,
    get value() {
      return values[key];
    },
    get error() {
      return shownError(key);
    },
    onInput: (value: string) => setValues(key, value),
    onBlur: () => setTouched(key, true),
    controlRef: (control: HTMLElement) => {
      controls[key] = control;
    },
  });

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    CONTACT_FORM_KEYS.forEach((key) => setTouched(key, true));
    const firstInvalidKey = CONTACT_FORM_KEYS.find((key) => errors()[key]);
    if (firstInvalidKey) {
      controls[firstInvalidKey]?.focus();
      return;
    }
    const formData: ContactFormValues = { ...values };
    alert(JSON.stringify(formData, null, 2));
  };

  const submitCmsProp = useCmsFieldProps(() => "submitLabel");

  return (
    <section class="module-section">
      <div class="module-content">
        <Content content={props.shape} property="heading" type="string">
          {(heading, cmsProp) => <h2 {...cmsProp()}>{heading()}</h2>}
        </Content>
        <form
          novalidate
          class="block-padding grid grid-cols-2 gap-x-4 gap-y-5 @max-dsk:grid-cols-1"
          onSubmit={handleSubmit}
        >
          <ContactFormField
            {...fieldProps("name")}
            content={props.shape?.name}
            autocomplete="name"
            required
          />
          <ContactFormField
            {...fieldProps("email")}
            content={props.shape?.email}
            type="email"
            autocomplete="email"
            required
          />
          <ContactFormField
            {...fieldProps("phone")}
            content={props.shape?.phone}
            type="tel"
            autocomplete="tel"
            class="col-span-full"
          />
          <ContactFormField
            {...fieldProps("description")}
            content={props.shape?.description}
            multiline
            required
            class="col-span-full"
          />
          <div class="col-span-full flex">
            <button
              type="submit"
              class={cx(primaryLinkButtonClass, "cursor-pointer")}
              {...submitCmsProp()}
            >
              {props.shape?.submitLabel}
            </button>
          </div>
        </form>
        <Content content={props.shape} property="footnote" type="markdown" />
      </div>
    </section>
  );
};
