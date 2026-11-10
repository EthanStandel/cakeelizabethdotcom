import { Component } from "solid-js";
import { HONEYPOT_KEY } from "./contactFormValidation";

// HONEYPOT, NOT A REAL INPUT. It is kept out of sight, out of the Tab order, and away from assistive technology and autofill, so no visitor gives it a value; a program that fills in every input does, and the server drops that request. It is clipped and moved off screen instead of hidden with `display: none` or `hidden`, which a program can detect. Do not label it, validate it, or read it as form data.
export const ContactFormHoneypot: Component<{
  inputRef: (input: HTMLInputElement) => void;
}> = (props) => (
  <div
    aria-hidden="true"
    class="fixed top-0 right-full h-0 w-0 overflow-hidden"
  >
    <input
      ref={props.inputRef}
      type="text"
      name={HONEYPOT_KEY}
      tabindex={-1}
      autocomplete="off"
    />
  </div>
);
