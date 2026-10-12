import { Component, Show } from "solid-js";
import { getCollectionItem } from "~/lib/content";
import type { CmsSource } from "~/lib/cms/CmsPathContext";
import { UniversalSuffixModuleShape } from "~/models";
import {
  contentQuery,
  createCmsContent,
} from "~/primitives/createContentFetch";
import { ModuleRegistry } from "~/modules/ModuleRegistry";
import { ContentFor } from "~/components/ContentFor";

const UNIVERSAL_SUFFIX_MODULE_SLUG = "main";

const universalSuffixModuleSource: CmsSource = {
  collection: UniversalSuffixModuleShape.name,
  slug: UNIVERSAL_SUFFIX_MODULE_SLUG,
};

const fetchUniversalSuffixModule = (slug: string) =>
  getCollectionItem(UniversalSuffixModuleShape, slug);

const getUniversalSuffixModule = contentQuery(
  UniversalSuffixModuleShape.name,
  fetchUniversalSuffixModule,
);

export const preloadUniversalSuffixModule = () =>
  void getUniversalSuffixModule(UNIVERSAL_SUFFIX_MODULE_SLUG);

export const UniversalSuffixModules: Component<{ pageSlug: string }> = (
  props,
) => {
  const content = createCmsContent(
    UniversalSuffixModuleShape,
    fetchUniversalSuffixModule,
    () => UNIVERSAL_SUFFIX_MODULE_SLUG,
  );
  const isExcluded = () =>
    content()?.excludedSlugs?.includes(props.pageSlug) ?? false;

  return (
    <Show when={!isExcluded()}>
      <ContentFor
        each={content()}
        field="modules"
        source={universalSuffixModuleSource}
      >
        {(module) => <ModuleRegistry module={module.type} shape={module} />}
      </ContentFor>
    </Show>
  );
};
