# 005 — contact form email

| | |
| --- | --- |
| Status | Implemented |
| Depends on | [000](../000-initial/SPEC.md), [001](../001-design-v2-modules/SPEC.md), [002](../002-design-v2-header-footer/SPEC.md), [004](../004-module-transitions/SPEC.md) |
| Snapshot | 2026-10-12, commit `47a274a68d4d4dd7ee3c9818a22c9c161772e634` |

## Description

The contact form of [001§3.9](../001-design-v2-modules/SPEC.md#39-contact-form-module) validates what a visitor types and then only shows it in an `alert`. Where a request goes was left open in [001§4.2](../001-design-v2-modules/SPEC.md#42-contact-form-submission-and-sent-state). This spec decides it: a submitted form becomes an email to the studio, sent the way the previous site sent it. The email, its provider, and its configuration are carried over from that site. What the visitor sees afterwards is not: a successful submit shows the sent state of the v2 design, which was deferred with the sending.

## 1. Source behavior

The previous site's flow is in `src/app/(main)/contact/` on the `main` branch, and it is recorded here because that branch is what this one replaces ([000§1](../000-initial/SPEC.md#1-purpose-and-shape-of-the-project)).

Its form's submit handler called a server action, `sendContactFormEmail`, with the form's values. The action refused a request without a name, an email address, or a message, reported success without sending when `NO_MAIL` was set, and otherwise sent one email through SendGrid and reported whether SendGrid accepted it. The submit button showed a spinner while the action ran. The result was written to the URL as `?submission=success` or `?submission=error`, and the form was replaced by a box holding a message for that result.

| Previous site | Here |
| --- | --- |
| A server action called from the submit handler | A JSON request to an API route, made by the submit handler ([§2.1](#21-json-only)) |
| The request checked only for the presence of three values | The form's own rules, run again on the server ([§2.2](#22-handling)) |
| Nothing to tell a program from a visitor | A honeypot input ([§6](#6-honeypot)) |
| SendGrid, configured by `MAIL_API_KEY`, `MAIL_FROM`, `MAIL_TARGET`, and `NO_MAIL` | Kept, under the same names, with `NO_MAIL_DELAY` added ([§3](#3-provider-and-environment)) |
| A missing variable found only when a send failed | Checked when the site is built ([§3.1](#31-environment-check)) |
| An email of the name, email address, phone number, subject, and message | Kept, less the subject, and drawn to a new design ([§4](#4-the-email)) |
| A spinner in the submit button | Kept ([§5.1](#51-submitting)) |
| Success: a box in place of the form, held in the URL | The design's sent panel, held in the component ([§5.2](#52-sent)) |
| Failure: a box in place of the form, held in the URL | A message under the form, which stays ([§5.3](#53-failed)) |
| The form and the box fade and shrink into each other | The module motion ([§5.4](#54-motion)) |

## 2. Endpoint

The form's values are sent as JSON to an API route, `POST /api/contact`, in `src/routes/api/contact.ts`. It is the first API route in the project. The route only reads the request and answers it. What is done with the values is `sendContactFormEmail` in `src/modules/ContactFormModule/sendContactFormEmail.tsx`, which sits beside the rules and the email it uses.

### 2.1 JSON only

The submit handler makes the request with `fetch`, through `submitContactForm` in `src/modules/ContactFormModule/submitContactForm.ts`: a `POST` whose `Content-Type` is `application/json` and whose body is one JSON object, the four values of [001§3.9](../001-design-v2-modules/SPEC.md#39-contact-form-module) and the honeypot's ([§6](#6-honeypot)). The form has no `action`, and the handler always prevents the browser's own submission ([001§3.9](../001-design-v2-modules/SPEC.md#39-contact-form-module)). The values travel in the request's body and never in the URL.

The route takes that and nothing else. A request whose `Content-Type` is not `application/json` is answered `415` before its body is read. A body that is not JSON, or not an object of those five strings and no other key, is answered `400`. The shape is a Zod schema in `contactFormValidation.ts`, and the answer's shape is a second one beside it, which the submit handler reads the answer with.

This is why the endpoint is a route of its own and not a server function, which is what a server action of the previous site would otherwise have become. The previous site receives junk submissions posted the way a browser posts a form, and they have done no harm there. A server function would change that: SolidStart serves every server function from an endpoint that also takes `multipart/form-data` and `application/x-www-form-urlencoded` bodies, so that a form can post to one without script, and it would take them whether or not this form ever used it that way. A browser's form cannot send `application/json`, and a page on another origin cannot send it from script without a preflight request, which the route does not answer. What can reach the handler is therefore only a client that sets out to send this endpoint JSON.

For the same reason the form is given no way to work without script. An `action` for the browser to post to would have to be an endpoint that takes a form post, which is the thing ruled out here. A submit made before the page has hydrated therefore sends nothing, and that is the price of the rule and not an oversight.

### 2.2 Handling

`sendContactFormEmail` takes the parsed body and resolves to a boolean: whether the request was sent. It does four things, in order:

1. **Checks the honeypot.** A body whose `priceRange` is not empty resolves to `false` and sends nothing ([§6](#6-honeypot)).
2. **Validates.** It parses the body with `ContactFormValuesSchema` from `contactFormValidation.ts`, the rules the form runs ([§2.3](#23-rules-as-a-schema)), and goes on with what the schema returns: the four values, trimmed. A body that fails any rule resolves to `false` and sends nothing. The route is public and can be called without the form, so the form's checks are not a guarantee of what arrives. The rules are imported and not written a second time, so the two cannot drift apart.
3. **Stops when `NO_MAIL` is `true`.** It waits for `NO_MAIL_DELAY` and then resolves to `true` without sending ([§3](#3-provider-and-environment)). This is how the form's submitting and sent states are worked on without an account or an inbox: the `dev-no-mail` configuration in `.claude/launch.json` starts the dev server with `NO_MAIL` on and a `NO_MAIL_DELAY` of two seconds, whatever `.env` holds.
4. **Sends** the email of [§4](#4-the-email). A response with a 2xx status resolves to `true`. That status says SendGrid accepted the email and not that it arrived, and acceptance is taken as sent: every email goes to the one inbox of `MAIL_TARGET`, so delivery does not vary from one request to the next. Any other response, and anything thrown, is logged on the server as `Mailer failed` and resolves to `false`. What is logged of a thrown error is its message, its code, and the body of the provider's response, and not the error itself: a request that never reached SendGrid fails with an error that carries the request it was made with, and so the API key and the visitor's values.

The route answers `200` with `{ "sent": true }` or `{ "sent": false }`. The submit handler takes `sent: true` as sent and everything else as a failure: `sent: false`, any other status, and a request that gets no answer.

The result is a boolean and nothing more. A visitor is told the same thing whatever went wrong ([§5.3](#53-failed)), and the cause stays in the server's log, where the visitor's values are not written.

### 2.3 Rules as a schema

The rules of [001§3.9](../001-design-v2-modules/SPEC.md#39-contact-form-module) were a function written by hand. They are now a Zod schema, `ContactFormValuesSchema`, as every other shape in the project is ([000§2](../000-initial/SPEC.md#2-toolchain)): Zod's own checks are used where it has one, and a rule it has none for is written as a check inside the schema and not beside it. `contactFormValidation.ts` therefore holds two schemas for one request. `ContactFormRequestSchema` says what a body is, five strings, and failing it is a `400` ([§2.1](#21-json-only)). `ContactFormValuesSchema` says what a visitor may send, and failing it is `sent: false` ([§2.2](#22-handling)). They are kept apart so that the two answers stay apart.

The schema trims each value before it checks it, so the server sends the trimmed values without trimming them itself. Each rule's message is the name of the CMS field that holds the text for it, `requiredError` or `invalidError`. `validateContactForm` is still what the form calls, on every change as before: it parses the values and gives back, for each input, the message of its first failed rule, so an empty email is reported as required and not as invalid.

| Input | Rule |
| --- | --- |
| `name`, `description` | Not empty |
| `email` | Not empty, and an email address by Zod's `z.email()` with its `unicodeEmail` pattern |
| `phone` | Empty, or a US number, counted as before in a check of the project's own: Zod has no rule for a phone number as a visitor types one |

The email rule is the one whose result changes. Zod's default email check takes only ASCII addresses of a common form, and so refuses real ones: an accented name, a domain written in its own script, a `&` before the `@`. A visitor so refused cannot send the form at all, which costs more than a mistyped address getting through, so the rule uses the loosest pattern Zod ships, `z.regexes.unicodeEmail`: something without a space, an `@`, or a quotation mark, then an `@`, then something without a space or an `@`. Against the pattern it replaces, which took anything shaped like `x@y.zz`, it differs in two ways. It no longer asks for a dot and two characters after the `@`, so `ada@example` passes ([Known gaps](#known-gaps)). And it refuses a quotation mark before the `@`.

## 3. Provider and environment

The email is sent with `@sendgrid/mail`, added to the dependencies of [000§2](../000-initial/SPEC.md#2-toolchain). It is imported only by `sendContactFormEmail.tsx`, which only the route imports, so neither reaches the client bundle.

| Variable | Holds |
| --- | --- |
| `MAIL_API_KEY` | The SendGrid API key |
| `MAIL_FROM` | The address the email is sent from, which SendGrid must have verified |
| `MAIL_TARGET` | The studio's inbox |
| `NO_MAIL` | When `true`, nothing is sent and every valid request succeeds |
| `NO_MAIL_DELAY` | With `NO_MAIL`, how long a request waits before it succeeds, in milliseconds; `0` when unset |
| `SKIP_ENV_CHECK` | When `true`, the build does not check for the first three ([§3.1](#31-environment-check)) |

The first four names are the previous site's, so the values configured for it are used as they are.

`NO_MAIL` is for testing. Without it the sent panel ([§5.2](#52-sent)) is reached only by really sending an email, so the form could not be worked on without a SendGrid key. It is on only when its value is exactly `true`, as `SKIP_ENV_CHECK` is. The previous site took any value, under which `NO_MAIL=false` also turned sending off.

`NO_MAIL_DELAY` is new. A request that sends nothing is answered at once, so the form would go from idle to sent with its submitting state ([§5.1](#51-submitting)) never drawn. The delay stands in for the time a real send takes: the request waits that many milliseconds on the server and then succeeds. It is read only when `NO_MAIL` is on, and a value that is missing or is not a number is treated as `0`, so the request succeeds at once.

The mail variables are read from `process.env` when a request is handled. None has the `VITE_` prefix, so Vite never places one in the client bundle. One that is missing at that point makes the send fail, which is logged like any other failure; keeping a deployment from getting that far is the job of the check in [§3.1](#31-environment-check).

In development they are written in `.env`, which is gitignored, and never in `.env.local`, which is committed ([000§4.2](../000-initial/SPEC.md#42-environment-variables)). The previous site's instructions named `.env.local`; following them here would commit the API key. Vite reads both files but exposes only prefixed variables, on `import.meta.env`, and copies nothing into `process.env`; Nitro, which would load `.env`, runs only in a build. `vite.config.ts` therefore reads the variables whose names begin `MAIL_` or `NO_MAIL` with Vite's `loadEnv` and assigns them to `process.env`, where a value already in the environment wins over the file's. In production the host provides them.

`.env.example`, which is committed, lists every variable the project reads, without values: the six above and the three of [000§4.2](../000-initial/SPEC.md#42-environment-variables), `VITE_SERVER_URL`, `CMS_GITHUB_REPO`, and `CMS_GITHUB_BRANCH`.

### 3.1 Environment check

`scripts/validate-env.ts`, run as `npm run validate:env`, fails a build that is missing a variable the site needs. Without it a deployment with a missing or mistyped variable builds, starts, and renders its form, and the first sign of the fault is a visitor's failed submit; the studio sees only an inbox with nothing in it, which looks the same as a week without requests.

The script does three things, in order:

1. **Logs the state of `SKIP_ENV_CHECK`.** Its first line of output says whether the check is on or skipped, so a build's log always shows which it was.
2. **Stops when `SKIP_ENV_CHECK` is `true`.** It exits with success. Any other value, and no value, leaves the check on. Skipping is for a build that is not going to send anything: one made to look at the site, or one whose server is given its variables only when it runs.
3. **Expects the required variables.** `MAIL_API_KEY`, `MAIL_FROM`, and `MAIL_TARGET` must each be set to something; an empty value counts as missing, which is what a copy of `.env.example` holds. It prints the name of each one that is missing and exits non-zero, which stops the build, as `validate-content.ts` does for a content file ([000§6.8](../000-initial/SPEC.md#68-validation)).

The required variables are a list in the script, so a variable a later feature needs is added to it there.

The script reads the environment the way the build does. `tsx` does not load env files ([000§4.2](../000-initial/SPEC.md#42-environment-variables)), so the script calls Vite's `loadEnv`, as `vite.config.ts` does, and sees the env files and the shell's environment together, the shell's values winning.

It runs first in `prebuild`, before the three steps of [000§5](../000-initial/SPEC.md#5-build), so a build that is going to fail on its environment fails before anything is generated. It does not run in `predev`: in development a missing variable shows itself in the terminal at the first submit, to the person who can fix it.

## 4. The email

| Part | Value |
| --- | --- |
| From | `MAIL_FROM` |
| To | `MAIL_TARGET` |
| Reply-To | The visitor's name and email address |
| Subject | "`<name>` reached out via the contact form!" |

The Reply-To is what makes the flow useful: the studio answers a request by replying to the email, and the reply goes to the visitor.

The body is the `ContactEmail` component in `src/modules/ContactFormModule/ContactEmail.tsx`, rendered to a string by `renderToString` from `solid-js/web`, as the previous site rendered a React component. It is a component and not a template string so that what a visitor typed is escaped by the renderer and not by hand. It is rendered inside `NoHydration`, which leaves the hydration keys out of the markup. The renderer's comment markers around what it inserts stay in it, and a mail client ignores them.

### 4.1 Design

The email's design is the file `Cake Elizabeth Contact Email.html` in the Claude Design project of [001§1](../001-design-v2-modules/SPEC.md#1-source-design). It replaces the layout carried over from the previous site, a band in the primary color above plain lines of text. The design is itself an email, written the way a mail client needs one ([§4.2](#42-markup-for-a-mail-client)), so its markup and its sizes are taken as it writes them: nothing built on the site is a counterpart to follow.

The email holds, in order:

- **A preview line.** A mail client shows it beside the subject in its list of messages, and it is not drawn in the email itself: the heading, then the name, the email address, and the phone number when there is one.
- **A card** on a ground of the eggshell color, as wide as the design draws it and no wider, and as narrow as the window where the window is narrower.
- **The logo**, centered at the top of the card ([§4.3](#43-logo)), and under it the heading "A new contact is trying to reach out!" between two rules in the primary color, as an `Eyebrow` is drawn on the site ([000§12](../000-initial/SPEC.md#12-shared-components)).
- **Three rows** of a label beside its value, with a rule under each: "Name" and the name; "Email" and the email address as a `mailto:` link; "Phone number" and the phone number as a `tel:` link. The link's number is the visitor's digits in international form, with the country code `+1` in front when they did not type it, which the rule of [§2.3](#23-rules-as-a-schema) guarantees is all that can be missing. The row is left out when the visitor gave no number.
- **"Message"** and the description in a panel of the eggshell color, with each line break the visitor typed kept as a line break.
- **The site's name**, "Cake Elizabeth", under a rule in the primary color, as a signature.

The previous email's subject heading has no counterpart, because the form has no subject input ([001§3.9](../001-design-v2-modules/SPEC.md#39-contact-form-module)).

In a narrow window each label sits above its value in place of beside it. The design's rule for this leaves the label's own rule where it was, which draws a line between a label and the value it names. That reads as a mistake and not as a decision, so on a narrow window a label has no rule and each pair is closed by the one under its value.

The design's colors are read as the tokens of [000§11.1](../000-initial/SPEC.md#111-tokens), as [001§1](../001-design-v2-modules/SPEC.md#1-source-design) reads every design's. The design underlines a link in a darker green than the primary color; the email underlines it in the primary color, as the site underlines a link in markdown ([001§3.11](../001-design-v2-modules/SPEC.md#311-element-defaults-mobile-text-sizes-and-links)). Its fonts are the design's, Georgia and Helvetica, which a mail client has; the site's own fonts would have to be loaded, and most mail clients load none.

### 4.2 Markup for a mail client

This component differs from every other in `src/`, because of where it is read:

- **It is a whole document.** The component renders `<html>`, with a `<head>` and a `<body>`, where the email before it was a fragment. The `<head>` holds the title and the `<style>` block below, and it tells the client that the email has a light scheme only, so that a client in dark mode does not recolor it. The doctype is added in front of the rendered string, because JSX cannot write one.
- **It is laid out with tables.** Outlook on Windows draws an email with Word's engine, which lays out neither flex nor grid, so the card, the rows, and the panel are `table`s carrying `role="presentation"`, which tells assistive technology they are not data.
- **Its styles are inline `style` attributes with literal values.** A mail client loads no stylesheet, so no utility class and no token of [000§11.1](../000-initial/SPEC.md#111-tokens) reaches it. Each color is its token's value, written out once as a constant in the component.
- **It has one `<style>` block, for what an inline style cannot say.** That is the narrow window's rules, which need a media query, and the color of a link. The classes those rules name begin `ce-` and are the email's own; they are not utilities and nothing in `src/app.css` knows them. A client that drops the block shows the wide layout at every width, with its side padding, and loses nothing else.
- **The card's width is an attribute as well as a style.** The design holds the card to its width in Outlook with a conditional comment around it, and JSX cannot write a comment. The card's `table` carries the width as a `width` attribute, which Word's engine reads, beside the `width` and `max-width` styles that every other client reads.
- **Its strings are written in the component.** The subject, the title, the heading, the four labels, and the site's name are not CMS fields. The email is read by the studio and never by a visitor, and [GAC§1](../GLOBAL_ACCEPTANCE_CRITERIA.md) covers what a visitor can perceive.

### 4.3 Logo

The design draws the site's name as text where the logo goes, and says in a note that the logo's image takes its place. The logo is the one the site already has: `public/images/logo.svg`, the file the header and the footer draw ([002§2.1](../002-design-v2-header-footer/SPEC.md#21-logo)). The email links to it at `https://cakeelizabeth.com/images/logo.svg`, because an email needs an absolute URL. The previous email used a PNG of the same drawing, at `/resources/other/logo.png`, and that file is not carried over: the site keeps one logo file and not a second copy that exists only for the email. The SVG has no size of its own, so the email gives the image the width the design's note gives it and the height that width gives the drawing, worked out from the SVG's `viewBox`. Both are set outright, so the card is laid out the same whether or not the image loads.

The image's `alt` is the site's name, and the image carries the type the design sets that name in. A client that does not load the image, because it blocks remote images or because the address does not answer ([Known gaps](#known-gaps)), shows the name in its place in the design's type, inside the space the logo would have taken.

The address is written in the component, as the strings are, and is not read from the `logo` constant. A logo chosen in the CMS under another name therefore does not reach the email until the address is changed to match.

## 5. The form

`ContactFormModule.tsx` holds one more piece of state beside the values and the touched inputs of [001§3.9](../001-design-v2-modules/SPEC.md#39-contact-form-module): where the submission stands, one of idle, submitting, sent, or failed.

It is held in the component and not in the URL, where the previous site held it. A confirmation is not something a visitor shares or returns to ([GAC§7](../GLOBAL_ACCEPTANCE_CRITERIA.md)): `/contact?submission=success` opened from a link or a reload thanked a visitor for a request they had not made, and showed no form to make one with. The sent panel also greets the visitor by a name that is not in the URL and must not be.

### 5.1 Submitting

A submit that passes every rule makes the request of [§2.1](#21-json-only), in place of the `alert`. Until it is answered:

- The submit button's label is hidden and a spinner is drawn in its place, the `LoaderCircle` icon of `lucide-solid` with `animate-spin`. The label stays in the button, made transparent and not hidden, so the button keeps its size and its accessible name; the spinner is hidden from assistive technology and the button carries `aria-busy="true"`.
- Another submit is ignored. The previous site did not stop one, and a double click sent two emails.

A request that gets no answer, as when the network is down, is a failure like any other ([§2.2](#22-handling)).

### 5.2 Sent

When the answer is `sent: true`, the form is replaced by the sent panel of the design ([001§4.2](../001-design-v2-modules/SPEC.md#42-contact-form-submission-and-sent-state)): a panel bordered in the primary color that thanks the visitor by first name, promises a reply to their email address within 48 hours, and offers a button that shows the form again. The module's `heading` above and its `footnote` below stay where they are.

The design is the file `Cake Elizabeth All Pages v2.html` in the Claude Design project "Cake Elizabeth" (`https://claude.ai/design/p/7d1db719-b904-41d7-9765-c9131205684b`), the one the form itself was built from ([001§1](../001-design-v2-modules/SPEC.md#1-source-design)). The form on its Contact artboard is a working prototype, so the sent state is in the design's script as well as in what it draws. The panel's wording, its layout, and the variant of its button are read from there when the panel is built, on the terms of [001§1](../001-design-v2-modules/SPEC.md#1-source-design): the design's colors are read as the existing tokens, and spacing follows what is already built and not the design's pixel values.

`src/models/modules/ContactFormModule.shape.ts` gains a `sent` object for the panel's copy, a `fields.object` as the four inputs are ([000§6.1](../000-initial/SPEC.md#61-field-builders)):

| Field | Holds | Initial content |
| --- | --- | --- |
| `heading` | The panel's `h3` | "Thank you, {firstName}" |
| `body` | The line under it | "We’ve received your request and will be in touch at {email} within 48 hours with questions or a quote." |
| `resetLabel` | The button's text | "Send another" |

`{firstName}` and `{email}` are tokens. Wherever one appears in `heading` or `body`, it is replaced when the panel is drawn: `{firstName}` by the first word of the name the visitor typed, and `{email}` by their email address. The copy stays an editor's to change ([GAC§1](../GLOBAL_ACCEPTANCE_CRITERIA.md)), down to where in the sentence the name falls, and a string without a token is shown as it is written. So is anything else in braces: only the two tokens are replaced.

The panel is `ContactFormSentPanel` in `src/modules/ContactFormModule/ContactFormSentPanel.tsx`. Its heading is drawn as the flavor menu's category headings are ([000§13.2](../000-initial/SPEC.md#132-modules)), with the primary-colored bottom border, which here is as wide as the heading's text and not as the panel, as the design draws it.

The button is a `button` drawn as the `secondary` variant of `LinkButton` ([000§12](../000-initial/SPEC.md#12-shared-components)), the design's outlined button; `LinkButton.tsx` exports that variant's class as `secondaryLinkButtonClass`. It clears the four values and the touched inputs and shows the form again.

Replacing the form removes the element that had focus. Focus therefore moves to the panel's heading when the panel is shown, which also makes a screen reader announce it, and to the name input when the form returns.

### 5.3 Failed

On a failure, the form stays as it is, with everything the visitor typed, and a message is shown under the submit button. The previous site replaced the form with its message, which threw away what the visitor had written at the moment they were asked to send it another way.

The message is `failureMessage`, a new markdown field on the module. Its initial content is the previous site's: "Looks like something went wrong, so please just shoot an email with what you're looking for over to info@cakeelizabeth.com", the address a `mailto:` link. It is drawn in `--color-error` and carries `role="alert"`, so it is announced when it appears. The next submit removes it.

`sent` and `failureMessage` are required, as the module's other copy is, and `public/content/contact.md` gains both in the same change.

For click-to-edit ([GAC§2](../GLOBAL_ACCEPTANCE_CRITERIA.md)), the panel's heading, body, and button and the failure message each carry their field. None of them can be shown in the admin's preview, because the preview cancels every click ([000§8.4](../000-initial/SPEC.md#84-preview-side-behavior)), the submit button's included, and so never submits the form. An editor reaches them through the module's fields, and no email can be sent from the admin.

### 5.4 Motion

The previous site faded and shrank the form out and the box in. That was that site's motion and is not carried over. The sent panel arrives with the module motion of [004§2](../004-module-transitions/SPEC.md#2-the-motion): it is inserted in its settled state with a `@starting-style` of the hidden one, as a module is on a page load ([004§3](../004-module-transitions/SPEC.md#3-arriving-on-a-page-load)), so the browser plays the arrival and no script or timer takes part. The form arrives the same way when it returns, and only then: on a page load it is drawn settled, because its module is already arriving around it ([004§3](../004-module-transitions/SPEC.md#3-arriving-on-a-page-load)) and a second arrival inside the first would double the motion. `src/components/ModuleTransition/ModuleTransition.tsx` exports the arrival as `moduleArrivalClass`, built from the same class strings its own wrapper uses, so the panel, the form, and a module cannot drift apart. Nothing plays for what is removed, and a visitor who has asked for reduced motion gets neither arrival ([004§5](../004-module-transitions/SPEC.md#5-reduced-motion)).

## 6. Honeypot

The form holds a fifth input that no visitor fills in: `priceRange`, a text input. A program that fills in every input it finds on a page fills this one as well, and that is what tells it from a visitor. It is named for something a form like this one could really ask, so that a program has no reason to pass it over; a name such as `website` would also be one that a browser or a password manager holds a value for and might fill in for a visitor.

The name reads as a real field to a person working on the code as well, so the code says what it is wherever the name appears. The name is written once, as the `HONEYPOT_KEY` constant in `contactFormValidation.ts`, and the input is its own component, `ContactFormHoneypot` in `src/modules/ContactFormModule/ContactFormHoneypot.tsx`; each carries a comment saying that it is a honeypot and that nothing is collected through it. The JSON-only endpoint ([§2.1](#21-json-only)) keeps out what posts forms without running the page; the honeypot is for what drives a real browser through it.

- **It is hidden from visitors and not from programs.** It is moved out of sight and not removed with `display: none` or the `hidden` attribute, which a program can read as easily as a browser can: its wrapper is fixed beyond the left edge of the window and clipped to no size. The clipping is what holds while the form arrives ([§5.4](#54-motion)), when the form's own motion makes it, and not the window, what the wrapper is placed against. Its wrapper carries `aria-hidden="true"`, and the input `tabindex="-1"` and `autocomplete="off"`, so assistive technology, the Tab key, and the browser's autofill all pass it by.
- **It has no label and no text.** Nothing about it can be perceived, so it has no CMS field ([GAC§1](../GLOBAL_ACCEPTANCE_CRITERIA.md)) and nothing to click in the preview.
- **It is not one of the form's values.** It has no rule and no touched state ([001§3.9](../001-design-v2-modules/SPEC.md#39-contact-form-module)). The submit handler reads it from the input and sends it as `priceRange` beside the four.

A request with anything in `priceRange` is not sent, and is answered as a failure and not as a success ([§2.2](#22-handling)). Answering it as a success would tell a program nothing, but it would also thank a visitor whose browser or password manager had filled the input in spite of the above, for a request that was dropped. As a failure, that visitor is shown the message of [§5.3](#53-failed) and its email address, and still reaches the studio.

## Known gaps

- **Nothing limits how often the endpoint is called.** The JSON-only endpoint ([§2.1](#21-json-only)) and the honeypot ([§6](#6-honeypot)) turn away programs that post or fill in forms blindly. A client written to send this endpoint JSON is not stopped, and neither is one that repeats a valid request: there is no CAPTCHA and no rate limit. The next steps, if junk reaches the inbox, are a challenge such as Cloudflare Turnstile and a rate limit, which is better set at the host once one is chosen than built into the application.
- **A filled honeypot fails every retry.** A visitor whose browser filled the hidden input ([§6](#6-honeypot)) cannot see it to empty it, so each submit fails and the email address in the failure message is their only way through.
- **A submit before hydration sends nothing.** This is intended: the endpoint takes JSON from script and nothing a browser's form can post, so that junk form posts have nowhere to land ([§2.1](#21-json-only)). What it costs is that, until the page has hydrated, the browser submits the form itself: a `GET` of the same page with the four values in the query string, which is where [001§3.9](../001-design-v2-modules/SPEC.md#39-contact-form-module) says they never go. No email is sent and the visitor is shown the empty form.
- **The check vouches for the build and not for the server.** `validate:env` looks at the environment the build runs in ([§3.1](#31-environment-check)). Where the server is given a different one when it runs, or the build was made with `SKIP_ENV_CHECK`, a missing variable is still found by a visitor, who is shown the failure message as every visitor after them is. The check also only asks whether a variable is set, so a wrong key or an unverified sender passes it.
- **`NO_MAIL` left on in production is silent.** Every visitor is thanked and nothing is sent or logged ([§3](#3-provider-and-environment)). The environment check does not look at it, and it does not excuse the three mail variables: a build with `NO_MAIL` and no account also sets `SKIP_ENV_CHECK`.
- **The committed `.env.local` turns the check off.** It sets `SKIP_ENV_CHECK=true`, and Vite's `loadEnv` lets `.env.local` win over `.env` ([§3.1](#31-environment-check)), so a `SKIP_ENV_CHECK=false` written in `.env` changes nothing. Every build made from a checkout skips the check unless the shell that runs it sets `SKIP_ENV_CHECK` to something else, and a host that builds from the repository is such a checkout.
- **The endpoint has not been run in a built server.** `npm run build` succeeds, and the mail code is in the server's output and absent from the client's. The server it builds answers `500` to every rendered route, the pages as well as `/api/contact`, with an `Invalid URL` error raised before any route runs; only static files are served. The fault is in how the built server hands a request to the application and was there before this feature, but it means the endpoint, and the host providing the mail variables ([§3](#3-provider-and-environment)), have been confirmed in development only.
- **The logo's address answers only once this site is deployed.** `https://cakeelizabeth.com/images/logo.svg` is a path of this site and not of the previous one, so an email sent before this site is the one at that address, from development included, has no logo. And once it is, the previous site's `/resources/other/logo.png` is gone, so the emails already in the studio's inbox lose theirs.
- **An email address with no ending passes.** The email rule ([§2.3](#23-rules-as-a-schema)) asks only for something on each side of an `@`, so `ada@gmail`, typed without its `.com`, is accepted where the rule of [001§3.9](../001-design-v2-modules/SPEC.md#39-contact-form-module) refused it. The visitor is thanked and promised a reply at an address the studio cannot write to. The sent panel shows them the address they typed ([§5.2](#52-sent)), which is their one chance to notice.
- **The email's layout has been seen in two places.** It was checked against the design in a browser, at a wide and a narrow width, and in the one inbox the test emails went to. Outlook on Windows, which the tables, the `width` attribute, and the `mso-` styles are there for ([§4.2](#42-markup-for-a-mail-client)), has not been looked at, and neither has a client in dark mode.

## Accepted gaps

- **The tokens are not explained in the admin.** The field builders take no help text ([000§6.1](../000-initial/SPEC.md#61-field-builders)), so the initial content is the only thing that shows an editor `{firstName}` and `{email}` exist. An editor who deletes one has nothing to tell them how to put it back. _Accepted 2026-10-20:_ the initial content shows both tokens, which is enough until it causes trouble.
