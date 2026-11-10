import { Component, For, JSX, Show } from "solid-js";
import type { ContactFormValues } from "./contactFormValidation";

const LOGO_URL = "https://cakeelizabeth.com/images/logo.svg";
const SITE_NAME = "Cake Elizabeth";
const HEADING = "A new contact is trying to reach out!";

const PRIMARY = "#65ffce";
const INK = "#181614";
const MUTED = "#444444";
const BORDER = "#e8e2da";
const EGGSHELL = "#f3f1ee";

const CARD_WIDTH_PX = 600;
const LOGO_WIDTH_PX = 220;
const LOGO_VIEW_BOX = { width: 653.34, height: 376.69 };
const LOGO_HEIGHT_PX = Math.round(
  (LOGO_WIDTH_PX * LOGO_VIEW_BOX.height) / LOGO_VIEW_BOX.width,
);
const LABEL_WIDTH_PX = 140;
const NARROW_MAX_WIDTH_PX = 620;

const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "Helvetica,Arial,sans-serif";

const US_COUNTRY_CODE = "1";
const US_PHONE_DIGIT_COUNT = 10;

const PAD_CLASS = "ce-pad";
const LABEL_CLASS = "ce-lbl";
const VALUE_CLASS = "ce-val";

const HEAD_STYLES = `
a{color:${INK}}
@media (max-width:${NARROW_MAX_WIDTH_PX}px){.${PAD_CLASS}{padding-left:24px!important;padding-right:24px!important}.${LABEL_CLASS}{display:block!important;width:auto!important;padding-bottom:2px!important;border-bottom:0!important}.${VALUE_CLASS}{display:block!important;width:auto!important;padding-top:0!important}}
:root{color-scheme:light only}
`;

type EmailStyle = JSX.CSSProperties & {
  [outlookProperty: `mso-${string}`]: string;
};

const exactLineHeight: EmailStyle = { "mso-line-height-rule": "exactly" };

const hiddenFromOutlook: EmailStyle = { "mso-hide": "all" };

const labelType: JSX.CSSProperties = {
  "font-family": SANS,
  "font-size": "11px",
  "line-height": "20px",
  "letter-spacing": "1.5px",
  "text-transform": "uppercase",
  color: MUTED,
};

const rowCell: JSX.CSSProperties = {
  padding: "14px 0",
  "border-bottom": `1px solid ${BORDER}`,
};

const valueType: JSX.CSSProperties = {
  "font-family": SANS,
  "font-size": "15px",
  "line-height": "20px",
};

const linkStyle: JSX.CSSProperties = {
  color: INK,
  "text-decoration": "underline",
  "text-decoration-color": PRIMARY,
};

const wordmarkType: JSX.CSSProperties = {
  "font-family": SERIF,
  "font-style": "italic",
  color: INK,
};

const FULL_WIDTH = "100%";

const presentationTable = (width?: string | number) =>
  ({
    role: "presentation",
    cellpadding: "0",
    cellspacing: "0",
    border: "0",
    width,
  }) as const;

// The rule of the form lets only a US number through, so the country code is all that can be missing.
const internationalNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return digits.length === US_PHONE_DIGIT_COUNT
    ? `+${US_COUNTRY_CODE}${digits}`
    : `+${digits}`;
};

const DetailRow: Component<{
  label: string;
  valueStyle?: JSX.CSSProperties;
  children: JSX.Element;
}> = (props) => (
  <tr>
    <td
      class={LABEL_CLASS}
      width={LABEL_WIDTH_PX}
      valign="top"
      style={{ width: `${LABEL_WIDTH_PX}px`, ...rowCell, ...labelType }}
    >
      {props.label}
    </td>
    <td
      class={VALUE_CLASS}
      valign="top"
      style={{ ...rowCell, ...valueType, ...props.valueStyle }}
    >
      {props.children}
    </td>
  </tr>
);

const previewOf = (values: ContactFormValues) =>
  [values.name, values.email, values.phone].filter(Boolean).join(" · ");

const Preview: Component<ContactFormValues> = (props) => (
  <span
    style={{
      display: "none",
      "max-height": "0",
      overflow: "hidden",
      opacity: "0",
      color: "transparent",
      ...hiddenFromOutlook,
    }}
  >
    {`${HEADING} ${previewOf(props)}`}
  </span>
);

const Header: Component = () => (
  <td
    class={PAD_CLASS}
    align="center"
    bgcolor="#ffffff"
    style={{ background: "#ffffff", padding: "36px 40px 0" }}
  >
    <img
      src={LOGO_URL}
      alt={SITE_NAME}
      width={LOGO_WIDTH_PX}
      height={LOGO_HEIGHT_PX}
      style={{
        display: "block",
        margin: "0 auto",
        border: "0",
        width: `${LOGO_WIDTH_PX}px`,
        height: `${LOGO_HEIGHT_PX}px`,
        ...wordmarkType,
        "font-size": "34px",
        "line-height": "40px",
      }}
    />
    <table {...presentationTable()} style={{ margin: "22px auto 0" }}>
      <tbody>
        <tr>
          <td
            style={{
              "border-top": `2px solid ${PRIMARY}`,
              "border-bottom": `2px solid ${PRIMARY}`,
              padding: "6px 2px",
              "font-family": SANS,
              "font-size": "13px",
              "line-height": "18px",
              ...exactLineHeight,
              "letter-spacing": "2px",
              "text-transform": "uppercase",
              color: INK,
            }}
          >
            {HEADING}
          </td>
        </tr>
      </tbody>
    </table>
  </td>
);

const Details: Component<ContactFormValues> = (props) => (
  <td class={PAD_CLASS} style={{ padding: "28px 40px 8px" }}>
    <table {...presentationTable(FULL_WIDTH)}>
      <tbody>
        <DetailRow
          label="Name"
          valueStyle={{
            "font-family": SERIF,
            "font-size": "20px",
            "line-height": "24px",
            color: INK,
          }}
        >
          {props.name}
        </DetailRow>
        <DetailRow label="Email">
          <a href={`mailto:${props.email}`} style={linkStyle}>
            {props.email}
          </a>
        </DetailRow>
        <Show when={props.phone}>
          <DetailRow label="Phone number">
            <a
              href={`tel:${internationalNumber(props.phone)}`}
              style={linkStyle}
            >
              {props.phone}
            </a>
          </DetailRow>
        </Show>
      </tbody>
    </table>
  </td>
);

const Message: Component<{ description: string }> = (props) => (
  <td class={PAD_CLASS} style={{ padding: "24px 40px 0" }}>
    <div style={{ ...labelType, "padding-bottom": "8px" }}>Message</div>
    <table {...presentationTable(FULL_WIDTH)}>
      <tbody>
        <tr>
          <td
            bgcolor={EGGSHELL}
            style={{
              background: EGGSHELL,
              "border-radius": "12px",
              padding: "20px 22px",
              "font-family": SANS,
              "font-size": "15px",
              "line-height": "24px",
              ...exactLineHeight,
              color: INK,
            }}
          >
            <For each={props.description.split("\n")}>
              {(line, index) => (
                <>
                  <Show when={index() > 0}>
                    <br />
                  </Show>
                  {line}
                </>
              )}
            </For>
          </td>
        </tr>
      </tbody>
    </table>
  </td>
);

const Signature: Component = () => (
  <td class={PAD_CLASS} style={{ padding: "32px 40px 36px" }}>
    <table {...presentationTable(FULL_WIDTH)}>
      <tbody>
        <tr>
          <td
            style={{
              "border-top": `2px solid ${PRIMARY}`,
              "padding-top": "18px",
              ...wordmarkType,
              "font-size": "18px",
              "line-height": "24px",
            }}
          >
            {SITE_NAME}
          </td>
        </tr>
      </tbody>
    </table>
  </td>
);

export const ContactEmail: Component<ContactFormValues> = (props) => (
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="color-scheme" content="light only" />
      <meta name="supported-color-schemes" content="light only" />
      <title>{HEADING}</title>
      <style innerHTML={HEAD_STYLES} />
    </head>
    <body style={{ margin: "0", padding: "0", background: EGGSHELL }}>
      <Preview {...props} />
      <table
        {...presentationTable(FULL_WIDTH)}
        style={{ background: EGGSHELL }}
      >
        <tbody>
          <tr>
            <td align="center" style={{ padding: "40px 12px" }}>
              <table
                {...presentationTable(CARD_WIDTH_PX)}
                style={{
                  width: FULL_WIDTH,
                  "max-width": `${CARD_WIDTH_PX}px`,
                  background: "#ffffff",
                  border: `1px solid ${BORDER}`,
                  "border-radius": "16px",
                  overflow: "hidden",
                }}
              >
                <tbody>
                  <tr>
                    <Header />
                  </tr>
                  <tr>
                    <Details {...props} />
                  </tr>
                  <tr>
                    <Message description={props.description} />
                  </tr>
                  <tr>
                    <Signature />
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
);
