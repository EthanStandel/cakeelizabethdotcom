import { batch, Component, createMemo, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { cx } from "cva";
import { LoaderCircle } from "lucide-solid";
import { ContactFormModuleType } from "~/models/modules/ContactFormModule.shape";
import { Content } from "~/components/Content";
import { primaryLinkButtonClass } from "~/components/LinkButton";
import { moduleArrivalClass } from "~/components/ModuleTransition";
import { useCmsFieldProps } from "~/lib/cms/CmsPathContext";
import { ContactFormField } from "./ContactFormField";
import { ContactFormHoneypot } from "./ContactFormHoneypot";
import { ContactFormSentPanel } from "./ContactFormSentPanel";
import {
  CONTACT_FORM_KEYS,
  ContactFormKey,
  ContactFormValues,
  HONEYPOT_KEY,
  validateContactForm,
} from "./contactFormValidation";
import { submitContactForm } from "./submitContactForm";

type SubmissionStatus = "idle" | "submitting" | "sent" | "failed";

const EMPTY_VALUES: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  description: "",
};

const UNTOUCHED: Record<ContactFormKey, boolean> = {
  name: false,
  email: false,
  phone: false,
  description: false,
};

export const ContactFormModule: Component<{ shape: ContactFormModuleType }> = (
  props,
) => {
  const [values, setValues] = createStore<ContactFormValues>({
    ...EMPTY_VALUES,
  });
  const [touched, setTouched] = createStore<Record<ContactFormKey, boolean>>({
    ...UNTOUCHED,
  });
  const [status, setStatus] = createSignal<SubmissionStatus>("idle");
  const [hasReturned, setHasReturned] = createSignal(false);
  const controls: Partial<Record<ContactFormKey, HTMLElement>> = {};
  let honeypot: HTMLInputElement | undefined;

  const isSubmitting = () => status() === "submitting";

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

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (isSubmitting()) return;
    CONTACT_FORM_KEYS.forEach((key) => setTouched(key, true));
    const firstInvalidKey = CONTACT_FORM_KEYS.find((key) => errors()[key]);
    if (firstInvalidKey) {
      setStatus("idle");
      controls[firstInvalidKey]?.focus();
      return;
    }
    setStatus("submitting");
    const isSent = await submitContactForm({
      ...values,
      [HONEYPOT_KEY]: honeypot?.value ?? "",
    });
    setStatus(isSent ? "sent" : "failed");
  };

  const showFormAgain = () => {
    batch(() => {
      setValues({ ...EMPTY_VALUES });
      setTouched({ ...UNTOUCHED });
      setHasReturned(true);
      setStatus("idle");
    });
    controls.name?.focus();
  };

  const submitCmsProp = useCmsFieldProps(() => "submitLabel");

  const ContactForm = () => (
    <form
      novalidate
      class={cx(
        "block-padding grid grid-cols-2 gap-x-4 gap-y-5 @max-dsk:grid-cols-1",
        hasReturned() && moduleArrivalClass,
      )}
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
      <ContactFormHoneypot
        inputRef={(input) => {
          honeypot = input;
        }}
      />
      <div class="col-span-full flex">
        <button
          type="submit"
          aria-busy={isSubmitting() ? "true" : undefined}
          class={cx(primaryLinkButtonClass, "relative cursor-pointer")}
          {...submitCmsProp()}
        >
          <span class={cx(isSubmitting() && "opacity-0")}>
            {props.shape?.submitLabel}
          </span>
          <Show when={isSubmitting()}>
            <LoaderCircle
              aria-hidden="true"
              class="absolute inset-0 m-auto animate-spin"
            />
          </Show>
        </button>
      </div>
      <Show when={status() === "failed"}>
        <Content
          content={props.shape}
          property="failureMessage"
          type="markdown"
        >
          {(message, cmsProp) => (
            <div
              role="alert"
              class="col-span-full [&_p]:text-error"
              {...cmsProp()}
            >
              {message()}
            </div>
          )}
        </Content>
      </Show>
    </form>
  );

  return (
    <section class="module-section">
      <div class="module-content">
        <Content content={props.shape} property="heading" type="string">
          {(heading, cmsProp) => <h2 {...cmsProp()}>{heading()}</h2>}
        </Content>
        <Show
          when={status() !== "sent"}
          fallback={
            <ContactFormSentPanel
              content={props.shape?.sent}
              name={values.name}
              email={values.email}
              onReset={showFormAgain}
            />
          }
        >
          <ContactForm />
        </Show>
        <Content content={props.shape} property="footnote" type="markdown" />
      </div>
    </section>
  );
};
