import { Component } from "solid-js";
import { Content } from "~/components/Content";
import { HOME_PAGE_PATH } from "~/models/Page.shape";
import { useConstants } from "~/primitives/ConstantsContext";

export const Logo: Component<{ onClick?: () => void }> = (props) => {
  const constants = useConstants();

  return (
    <Content content={constants()} property="logo" type="string">
      {(logo, cmsProp) => (
        <a
          href={HOME_PAGE_PATH}
          class="shrink-0"
          onClick={() => props.onClick?.()}
        >
          <img
            src={logo()}
            alt={constants()?.siteName ?? "Cake Elizabeth"}
            class="h-12 w-auto"
            {...cmsProp()}
          />
        </a>
      )}
    </Content>
  );
};
