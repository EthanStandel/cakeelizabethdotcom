import { Component } from "solid-js";
import { ConstantsShape } from "~/models";
import { Content } from "~/components/Content";
import { Logo } from "~/components/Logo";
import { CmsSourceContextProvider } from "~/lib/cms/CmsPathContext";
import { useConstants } from "~/primitives/ConstantsContext";

const telephoneHref = (phone: string) => `tel:${phone.replace(/\D/g, "")}`;

export const Footer: Component = () => {
  const constants = useConstants();

  return (
    <CmsSourceContextProvider collection={ConstantsShape.name} slug="main">
      <footer class="page-container w-full">
        <div class="content-container">
          <hr class="h-0.5 w-full bg-primary text-primary" />
          <div class="flex items-center justify-between gap-5 py-6 @max-dsk:flex-col @max-dsk:py-4">
            <Logo />
            <ul
              role="list"
              class="flex list-none gap-8 @max-dsk:flex-col @max-dsk:items-center @max-dsk:gap-5"
            >
              <Content content={constants()} property="phone" type="string">
                {(phone, cmsProp) => (
                  <li>
                    <a
                      href={telephoneHref(phone())}
                      class="underlined-link font-sans text-sm text-secondary-foreground"
                      {...cmsProp()}
                    >
                      {phone()}
                    </a>
                  </li>
                )}
              </Content>
              <Content content={constants()} property="email" type="string">
                {(email, cmsProp) => (
                  <li>
                    <a
                      href={`mailto:${email()}`}
                      class="underlined-link font-sans text-sm text-secondary-foreground"
                      {...cmsProp()}
                    >
                      {email()}
                    </a>
                  </li>
                )}
              </Content>
            </ul>
            <Content content={constants()} property="copyright" type="string">
              {(copyright, cmsProp) => (
                <p class="mt-0 text-xs" {...cmsProp()}>
                  {copyright()}
                </p>
              )}
            </Content>
          </div>
        </div>
      </footer>
    </CmsSourceContextProvider>
  );
};
