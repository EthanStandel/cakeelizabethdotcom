import { Link, Meta, Title } from "@solidjs/meta";
import { createAsync } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { getCollectionItem } from "~/lib/content";
import { toAbsoluteUrl } from "~/lib/siteUrl";
import { fillTokens, toToken } from "~/lib/utils/fillTokens";
import { createQueryParamRouting } from "~/lib/utils/QueryParamSchemas";
import { GalleryItemsShape } from "~/models";
import { HOME_PAGE_PATH, type PageType } from "~/models/Page.shape";
import { contentQuery } from "~/primitives/createContentFetch";
import { useSiteWide, type Seo } from "~/primitives/SiteWideContext";

const GALLERY_ITEMS_SLUG = "main";
const TITLE_TOKEN = "title";
const OPEN_GRAPH_TYPE = "website";
const OPEN_GRAPH_LOCALE = "en_US";
const TWITTER_CARD = "summary_large_image";
const NOINDEX = "noindex";
const SCHEMA_CONTEXT = "https://schema.org";
const BUSINESS_TYPE = "Bakery";
const POSTAL_ADDRESS_TYPE = "PostalAddress";

export type PageSeo = NonNullable<PageType["seo"]>;

type SocialCard = {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
};

const getGalleryItems = contentQuery(GalleryItemsShape.name, () =>
  getCollectionItem(GalleryItemsShape, GALLERY_ITEMS_SLUG),
);

const applyTitleTemplate = (template: string | undefined, title: string) =>
  template?.includes(toToken(TITLE_TOKEN))
    ? fillTokens(template, { [TITLE_TOKEN]: title })
    : title;

// Read through `.latest`, which waits for the card on the server but not in the browser, so opening a modal does not hold the navigation's transition, and with it the modal's view transition, on this fetch.
function createGalleryModalCard() {
  const { modal } = createQueryParamRouting.modal.href();
  return createAsync(async (): Promise<SocialCard | undefined> => {
    const current = modal();
    if (current?.type !== "gallery") return undefined;
    const gallery = await getGalleryItems();
    const item = gallery?.items?.find(
      (galleryItem) => galleryItem.image === current.payload.imageUrl,
    );
    if (!item) return undefined;
    return {
      title: item.title,
      description: item.description,
      image: item.image,
      imageAlt: item.title,
    };
  });
}

const serializeJsonLd = (data: object) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

const toPostalAddress = (address: NonNullable<Seo>["address"]) =>
  address?.streetAddress
    ? { "@type": POSTAL_ADDRESS_TYPE, ...address }
    : undefined;

const BusinessStructuredData: Component = () => {
  const [constants, seo, siteUrl] = useSiteWide("constants", "seo", "siteUrl");

  const structuredData = () => {
    const origin = siteUrl();
    if (!origin) return undefined;
    const values = constants();
    return {
      "@context": SCHEMA_CONTEXT,
      "@type": BUSINESS_TYPE,
      name: values?.siteName || undefined,
      url: origin,
      logo: values?.logo ? toAbsoluteUrl(origin, values.logo) : undefined,
      telephone: values?.phone || undefined,
      email: values?.email || undefined,
      address: toPostalAddress(seo()?.address),
      areaServed: seo()?.areaServed || undefined,
      sameAs: seo()?.profiles?.length ? seo()?.profiles : undefined,
    };
  };

  return (
    <Show when={structuredData()} keyed>
      {(data) => (
        <script type="application/ld+json" innerHTML={serializeJsonLd(data)} />
      )}
    </Show>
  );
};

// Without a path the markup belongs to no address, as on the not-found view, so it carries no canonical, description or og:url; the structured data goes on the home page's path alone.
export const SeoMarkup: Component<{
  title?: string;
  seo?: PageSeo;
  path?: string;
}> = (props) => {
  const [constants, seo, siteUrl] = useSiteWide("constants", "seo", "siteUrl");
  const galleryModalCard = createGalleryModalCard();

  const searchTitle = () => props.seo?.title || props.title;
  const documentTitle = () => {
    const title = searchTitle();
    return title ? applyTitleTemplate(seo()?.titleTemplate, title) : undefined;
  };
  const description = () =>
    props.path == null
      ? undefined
      : props.seo?.description || seo()?.defaultDescription;
  const canonicalUrl = () => {
    const origin = siteUrl();
    return origin && props.path != null ? `${origin}${props.path}` : undefined;
  };
  const pageCard = (): SocialCard =>
    props.seo?.image
      ? {
          title: searchTitle(),
          description: description(),
          image: props.seo.image,
          imageAlt: props.seo.imageAlt,
        }
      : {
          title: searchTitle(),
          description: description(),
          image: seo()?.defaultImage,
          imageAlt: seo()?.defaultImageAlt,
        };
  const card = () => galleryModalCard.latest ?? pageCard();
  const cardImageUrl = () => {
    const origin = siteUrl();
    const image = card().image;
    return origin && image ? toAbsoluteUrl(origin, image) : undefined;
  };

  return (
    <>
      <Show when={documentTitle()} keyed>
        {(title) => <Title>{title}</Title>}
      </Show>
      <Show when={description()} keyed>
        {(text) => <Meta name="description" content={text} />}
      </Show>
      <Show when={canonicalUrl()} keyed>
        {(url) => (
          <>
            <Link rel="canonical" href={url} />
            <Meta property="og:url" content={url} />
          </>
        )}
      </Show>
      <Show when={props.seo?.noindex}>
        <Meta name="robots" content={NOINDEX} />
      </Show>
      <Meta property="og:type" content={OPEN_GRAPH_TYPE} />
      <Meta property="og:locale" content={OPEN_GRAPH_LOCALE} />
      <Show when={constants()?.siteName} keyed>
        {(siteName) => <Meta property="og:site_name" content={siteName} />}
      </Show>
      <Show when={card().title} keyed>
        {(title) => <Meta property="og:title" content={title} />}
      </Show>
      <Show when={card().description} keyed>
        {(text) => <Meta property="og:description" content={text} />}
      </Show>
      <Show when={cardImageUrl()} keyed>
        {(url) => <Meta property="og:image" content={url} />}
      </Show>
      <Show when={cardImageUrl() && card().imageAlt} keyed>
        {(alt) => <Meta property="og:image:alt" content={alt} />}
      </Show>
      <Meta name="twitter:card" content={TWITTER_CARD} />
      <Show when={props.path === HOME_PAGE_PATH}>
        <BusinessStructuredData />
      </Show>
    </>
  );
};
