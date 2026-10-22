import { MetaContext, MetaProvider, type MetaContextType } from "@solidjs/meta";
import type { JSX, ParentComponent } from "solid-js";
import { escape, isServer, ssr, useAssets } from "solid-js/web";

type HeadTag = Parameters<MetaContextType["addTag"]>[0];

const CHILDREN_PROP = "children";
const TITLE_TAG = "title";

const escapeAttribute = (value: unknown) =>
  String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;");

const renderAttributes = (props: Record<string, unknown>) =>
  Object.keys(props)
    .filter((key) => key !== CHILDREN_PROP)
    .map((key) => ` ${key}="${escapeAttribute(props[key])}"`)
    .join("");

const renderChildren = (tag: HeadTag) => {
  const children = tag.props[CHILDREN_PROP];
  const text = String(
    (Array.isArray(children) ? children.join("") : children) ?? "",
  );
  return tag.setting?.escape ? escape(text) : text;
};

const renderTag = (tag: HeadTag) =>
  tag.setting?.close
    ? `<${tag.tag} data-sm="${tag.id}"${renderAttributes(tag.props)}>${renderChildren(tag)}</${tag.tag}>`
    : `<${tag.tag} data-sm="${tag.id}"${renderAttributes(tag.props)}/>`;

// A Suspense boundary re-renders its subtree on the server until its resources settle, and cleans up each discarded pass; @solidjs/meta's server provider ignores that cleanup, so the head kept every pass's tags. This one drops them, and keeps one title as the library does.
function createServerHead(): MetaContextType {
  const tags: HeadTag[] = [];
  useAssets(() => ssr(tags.map(renderTag).join("")) as unknown as JSX.Element);
  return {
    addTag(tag) {
      if (tag.tag === TITLE_TAG) {
        const previousTitle = tags.findIndex(({ tag }) => tag === TITLE_TAG);
        if (previousTitle !== -1) tags.splice(previousTitle, 1);
      }
      tags.push(tag);
      return tags.length;
    },
    removeTag(tag) {
      const index = tags.indexOf(tag);
      if (index !== -1) tags.splice(index, 1);
    },
  };
}

const ServerHeadProvider: ParentComponent = (props) => (
  <MetaContext.Provider value={createServerHead()}>
    {props.children}
  </MetaContext.Provider>
);

// The server provider sits one component deep, as MetaProvider does in the browser, because every component advances Solid's hydration key and the two trees must match.
export const HeadProvider: ParentComponent = (props) =>
  isServer ? (
    <ServerHeadProvider>{props.children}</ServerHeadProvider>
  ) : (
    <MetaProvider>{props.children}</MetaProvider>
  );
