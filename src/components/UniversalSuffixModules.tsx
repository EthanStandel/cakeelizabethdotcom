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
import { ModuleTransition } from "~/components/ModuleTransition";

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

export const UniversalSuffixModules: Component<{
  pageSlug: string;
  transitionIndexOffset: number;
}> = (props) => {
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
        {(module, index) => (
          <ModuleTransition index={props.transitionIndexOffset + index()}>
            <ModuleRegistry module={module} />
          </ModuleTransition>
        )}
      </ContentFor>
    </Show>
  );
};
