import { Component } from "solid-js";
import { useLocation } from "@solidjs/router";
import { cx } from "cva";
import { Content } from "~/components/Content";
import { ContentFor } from "~/components/ContentFor";
import {
  navigationSource,
  useNavigation,
} from "~/primitives/NavigationContext";

const withoutTrailingSlash = (path: string) =>
  path.length > 1 ? path.replace(/\/+$/, "") : path;

export const NavigationLinks: Component<{
  id?: string;
  class?: string;
  listClass?: string;
  itemClass?: string;
  onLinkClick?: () => void;
}> = (props) => {
  const navigation = useNavigation();
  const location = useLocation();
  const isCurrentPage = (url: string) =>
    withoutTrailingSlash(location.pathname) === withoutTrailingSlash(url);

  return (
    <nav id={props.id} class={props.class}>
      <ul role="list" class={cx("flex list-none gap-8", props.listClass)}>
        <ContentFor each={navigation()} field="links" source={navigationSource}>
          {(link, index) => (
            <Content content={link} property="label" type="string">
              {(label, cmsProp) =>
                link.url && link.label ? (
                  <li
                    class={props.itemClass}
                    style={{ "--navigation-link-index": index() }}
                  >
                    <a
                      href={link.url}
                      aria-current={
                        isCurrentPage(link.url) ? "page" : undefined
                      }
                      class="link-underline font-sans text-sm tracking-wide text-secondary-foreground uppercase @max-dsk:text-base"
                      onClick={() => props.onLinkClick?.()}
                      {...cmsProp()}
                    >
                      {label()}
                    </a>
                  </li>
                ) : null
              }
            </Content>
          )}
        </ContentFor>
      </ul>
    </nav>
  );
};
