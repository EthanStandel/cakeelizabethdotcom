// .tina/config.tsx
import { defineConfig } from "tinacms";

// .tina/fields/MetadataField.ts
var MetadataField = {
  name: "metadata",
  label: "Metadata",
  type: "object",
  // @ts-ignore
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title"
    },
    {
      type: "string",
      component: "textarea",
      label: "Description",
      name: "description"
    }
  ]
};

// .tina/fields/ImageListField.ts
import { css } from "@emotion/css";
import cx from "classnames";
var ImageListField = (details = { name: "images", label: "Images" }) => ({
  type: "object",
  ...details,
  list: true,
  ui: {
    itemProps: (item) => ({
      label: void 0,
      className: cx(
        css({
          height: 150,
          "& > div:nth-child(2)::before": {
            content: "' '",
            width: 150,
            marginRight: "1rem",
            background: `url(${item.image})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left",
            marginTop: -8,
            marginBottom: -8,
            height: "calc(100% + 16px)"
          }
        })
      )
    })
  },
  fields: [
    {
      type: "image",
      label: "Image",
      name: "image",
      required: true
    }
  ]
});

// .tina/collections/AboutUsPageCollection.ts
var AboutUsPageCollection = {
  label: "About us page",
  name: "AboutUsPageCollection",
  path: "content/AboutUsPageCollection",
  format: "md",
  ui: {
    allowedActions: {
      create: false,
      delete: false
    },
    router: () => "/about-us"
  },
  fields: [
    MetadataField,
    {
      type: "string",
      label: "Title",
      name: "title",
      required: true
    },
    {
      type: "rich-text",
      label: "New ownership text",
      name: "newOwnershipBody"
    },
    ImageListField({ label: "Owner photos", name: "ownerPhotos" }),
    {
      type: "rich-text",
      label: "About the founder text",
      name: "aboutTheFounderBody"
    },
    ImageListField({ label: "Founder photos", name: "founderPhotos" })
  ]
};

// .tina/collections/FlavorPageCollection.ts
var FlavorPageCollection = {
  label: "Flavor page",
  name: "FlavorPageCollection",
  path: "content/FlavorPageCollection",
  format: "md",
  ui: {
    allowedActions: {
      create: false,
      delete: false
    },
    router: () => "/flavors"
  },
  fields: [
    MetadataField,
    {
      type: "string",
      label: "Title",
      name: "title",
      required: true
    },
    {
      type: "rich-text",
      label: "Body",
      name: "body",
      isBody: true
    },
    {
      type: "image",
      label: "Hero image",
      name: "heroImage",
      required: true
    },
    {
      type: "object",
      label: "Flavor groups",
      name: "flavorGroups",
      ui: {
        itemProps: (item) => ({ label: item.label })
      },
      list: true,
      fields: [
        {
          type: "string",
          label: "Label",
          name: "label",
          required: true
        },
        {
          type: "string",
          label: "Flavors",
          name: "flavors",
          list: true,
          required: true
        }
      ]
    }
  ]
};

// .tina/collections/GlobalCollection.ts
var GlobalCollection = {
  label: "Global",
  name: "GlobalCollection",
  path: "content/GlobalCollection",
  format: "md",
  ui: {
    allowedActions: {
      create: false,
      delete: false
    },
    router: () => "/"
  },
  fields: [
    {
      type: "object",
      label: "Header",
      name: "header",
      fields: [
        {
          type: "string",
          label: "Phone number",
          name: "phoneNumber",
          required: true
        },
        {
          type: "object",
          label: "Social Links",
          name: "socialLinks",
          list: true,
          ui: {
            itemProps: (item) => ({ label: item.label })
          },
          fields: [
            {
              type: "string",
              label: "Label",
              name: "label",
              required: true
            },
            {
              type: "string",
              label: "URL",
              name: "url",
              required: true
            }
          ]
        },
        {
          type: "image",
          label: "Logo",
          name: "logo",
          required: true
        },
        {
          type: "object",
          label: "Navigation",
          name: "navigation",
          list: true,
          ui: {
            itemProps: (item) => ({ label: item.label })
          },
          fields: [
            {
              type: "string",
              label: "Label",
              name: "label",
              required: true
            },
            {
              type: "string",
              label: "URL",
              name: "url"
            },
            {
              type: "object",
              label: "Sub Navigation",
              name: "subNavItem",
              list: true,
              ui: {
                itemProps: (item) => ({ label: item.label })
              },
              fields: [
                {
                  type: "string",
                  label: "Label",
                  name: "label",
                  required: true,
                  isTitle: true
                },
                {
                  type: "string",
                  label: "URL",
                  name: "url",
                  required: true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "object",
      label: "Footer",
      name: "footer",
      fields: [
        {
          type: "string",
          label: "Label",
          name: "label",
          required: true
        }
      ]
    }
  ]
};

// .tina/collections/HomePageCollection.ts
var HomePageCollection = {
  label: "Home page",
  name: "HomePageCollection",
  path: "content/HomePageCollection",
  format: "md",
  ui: {
    allowedActions: {
      create: false,
      delete: false
    },
    router: () => "/"
  },
  fields: [
    MetadataField,
    {
      type: "image",
      label: "Hero image",
      name: "heroImage"
    },
    {
      type: "string",
      label: "CTA",
      name: "cta"
    },
    {
      type: "rich-text",
      label: "Body",
      name: "body",
      isBody: true
    },
    {
      type: "object",
      label: "Quotes",
      name: "quotes",
      list: true,
      ui: { itemProps: (item) => ({ label: item.name }) },
      fields: [
        {
          type: "string",
          label: "Quote",
          name: "quote",
          required: true
        },
        {
          type: "string",
          label: "Name",
          name: "name",
          required: true
        }
      ]
    }
  ]
};

// .tina/collections/PoliciesAndPricingPageCollection.ts
var PoliciesAndPricingPageCollection = {
  label: "Policies & Pricing page",
  name: "PoliciesAndPricingPageCollection",
  path: "content/PoliciesAndPricingPageCollection",
  format: "md",
  ui: {
    allowedActions: {
      create: false,
      delete: false
    },
    router: () => "/policies-and-pricing"
  },
  fields: [
    MetadataField,
    {
      type: "string",
      label: "Title",
      name: "title",
      required: true
    },
    {
      type: "image",
      label: "Hero image",
      name: "heroImage",
      required: true
    },
    {
      type: "rich-text",
      label: "Body",
      name: "body",
      isBody: true
    }
  ]
};

// .tina/collections/ProductPageCollection.ts
var ProductPageCollection = {
  label: "Products",
  name: "ProductPageCollection",
  path: "content/ProductPageCollection",
  format: "md",
  ui: {
    router: ({ document }) => `/products/${document._sys.filename.slice(0)}`
  },
  fields: [
    MetadataField,
    {
      type: "boolean",
      label: "Hidden",
      name: "hidden"
    },
    {
      type: "string",
      label: "Title",
      name: "title",
      required: true
    },
    {
      type: "rich-text",
      label: "Body",
      name: "body",
      isBody: true
    },
    ImageListField()
  ]
};

// .tina/collections/AboutThisWebsitePageCollection.ts
var AboutThisWebsitePageCollection = {
  label: "About this website",
  name: "AboutThisWebsitePageCollection",
  path: "content/AboutThisWebsitePageCollection",
  format: "md",
  ui: {
    allowedActions: {
      create: false,
      delete: false
    },
    router: () => "/about-website"
  },
  fields: [
    MetadataField,
    {
      type: "string",
      label: "Title",
      name: "title",
      required: true
    },
    {
      type: "rich-text",
      label: "Body",
      name: "body",
      isBody: true
    }
  ]
};

// .tina/collections/ContactUsPageCollection.ts
var ContactUsPageCollection = {
  label: "Contact Us Page",
  name: "ContactUsPageCollection",
  path: "content/ContactUsPageCollection",
  format: "md",
  ui: {
    allowedActions: {
      create: false,
      delete: false
    },
    router: () => "/contact"
  },
  fields: [
    MetadataField,
    {
      type: "rich-text",
      label: "Contact details",
      name: "contactDetails",
      isBody: true
    }
  ]
};

// .tina/config.tsx
var config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || // custom branch env override
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || // Vercel branch env
  "feat/tina-rewrite",
  // initial default value
  token: process.env.TINA_TOKEN,
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads"
    }
  },
  cmsCallback: (cms) => {
    cms.flags.set("branch-switcher", true);
    return cms;
  },
  build: {
    publicFolder: "public",
    // The public asset folder for your framework
    outputFolder: "admin"
    // within the public folder
  },
  schema: {
    collections: [
      GlobalCollection,
      HomePageCollection,
      FlavorPageCollection,
      ProductPageCollection,
      PoliciesAndPricingPageCollection,
      AboutUsPageCollection,
      AboutThisWebsitePageCollection,
      ContactUsPageCollection
    ]
  }
});
var config_default = config;
export {
  config_default as default
};
