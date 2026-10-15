import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import { Component } from "solid-js";
import { getCollectionItem } from "~/lib/content";
import { NotFoundShape } from "~/models";
import {
  contentQuery,
  createCmsContent,
} from "~/primitives/createContentFetch";
import { CmsSourceContextProvider } from "~/lib/cms/CmsPathContext";
import { Content } from "~/components/Content";
import { CtaList } from "~/components/CtaList";
import { Eyebrow } from "~/components/Eyebrow";
import { ModuleTransition } from "~/components/ModuleTransition";

const NOT_FOUND_ENTRY_SLUG = "main";
const NOT_FOUND_STATUS = 404;

const fetchNotFound = (slug: string) => getCollectionItem(NotFoundShape, slug);

const getNotFound = contentQuery(NotFoundShape.name, fetchNotFound);

export const preloadNotFound = () => void getNotFound(NOT_FOUND_ENTRY_SLUG);

export const NotFound: Component = () => {
  const content = createCmsContent(
    NotFoundShape,
    fetchNotFound,
    () => NOT_FOUND_ENTRY_SLUG,
  );

  return (
    <>
      <Title>{content()?.title}</Title>
      <HttpStatusCode code={NOT_FOUND_STATUS} />
      <main class="flex grow flex-col justify-center py-module-dsk-gap @max-dsk:py-module-mbl-gap">
        <ModuleTransition index={0}>
          <CmsSourceContextProvider
            collection={NotFoundShape.name}
            slug={NOT_FOUND_ENTRY_SLUG}
          >
            <section class="page-container">
              <div class="content-container">
                <div class="mx-auto max-w-xl text-center">
                  <Content content={content()} property="eyebrow" type="string">
                    {(eyebrow, cmsProp) => (
                      <div>
                        <Eyebrow class="inline" {...cmsProp()}>
                          {eyebrow()}
                        </Eyebrow>
                      </div>
                    )}
                  </Content>
                  <Content content={content()} property="code" type="string">
                    {(code, cmsProp) => (
                      <p
                        class="font-serif text-[12.5rem] leading-none text-primary-foreground italic @max-dsk:text-9xl"
                        {...cmsProp()}
                      >
                        {code()}
                      </p>
                    )}
                  </Content>
                  <Content content={content()} property="heading" type="string">
                    {(heading, cmsProp) => <h1 {...cmsProp()}>{heading()}</h1>}
                  </Content>
                  <CtaList each={content()} class="justify-center" />
                </div>
              </div>
            </section>
          </CmsSourceContextProvider>
        </ModuleTransition>
      </main>
    </>
  );
};
