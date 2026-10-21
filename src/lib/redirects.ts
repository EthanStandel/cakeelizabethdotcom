export type Redirect = { from: string; to: string };

export const REDIRECT_STATUS = 301;

const galleryFilteredBy = (tag: string) =>
  `/gallery?galleryFilterTag=${encodeURIComponent(JSON.stringify(tag))}`;

const redirectAll = (sourcesByTarget: Record<string, string[]>): Redirect[] =>
  Object.entries(sourcesByTarget).flatMap(([to, sources]) =>
    sources.map((from) => ({ from, to })),
  );

export const redirects: Redirect[] = redirectAll({
  "/": ["/home", "/index.html"],
  "/about": [
    "/about-us",
    "/about-us/page/**",
    "/About_Us.html",
    "/about-website",
  ],
  "/contact": [
    "/policies-and-pricing",
    "/cake-pricing",
    "/order-policies",
    "/delivery-and-order-policies",
    "/schedule-your-tasting",
    "/schedule-tasting",
    "/products/schedule-tasting",
    "/5-tips-successfully-ordering-custom-cake",
    "/contact/page/**",
    "/Contact_Us.html",
    "/Location.html",
  ],
  "/flavors": [
    "/cake-pricing-flavors",
    "/cake-pricing-flavors/page/**",
    "/cake-flavors",
  ],
  "/weddings": [
    "/product/weddings",
    "/weddings/page/**",
    "/products/wondrous-wedding-cakes",
    "/wondrous-wedding-cakes",
    "/Wedding_Cake_Info.html",
    "/the-history-of-wedding-cakes",
    "/things-to-consider-when-choosing-the-perfect-wedding-cake",
    "/things-consider-choosing-perfect-wedding-cake",
  ],
  [galleryFilteredBy("Birthday")]: [
    "/product/birthday-cakes",
    "/birthday-cakes",
    "/birthday-cakes/page/**",
    "/products/brilliant-birthday-cakes",
    "/Birthdays.html",
  ],
  [galleryFilteredBy("Children")]: [
    "/product/childrens-cake",
    "/childrens-cake",
    "/childrens-cake/page/**",
  ],
  [galleryFilteredBy("Shower")]: [
    "/product/shower-cakes",
    "/shower-cakes",
    "/shower-cakes/page/**",
    "/products/bridal-and-baby-shower-creations",
    "/Showers.html",
  ],
  [galleryFilteredBy("Special Occasion")]: [
    "/product/special-occasion-cakes",
    "/special-occasion-cakes",
    "/special-occasion-cakes/page/**",
    "/products/sweet-16-cakes",
  ],
  [galleryFilteredBy("Religious")]: [
    "/product/religious-cakes",
    "/religious-cakes",
    "/religious-cakes/page/**",
    "/products/religious-revelations",
    "/Religious.html",
  ],
  [galleryFilteredBy("Holiday")]: [
    "/product/holiday-cakes",
    "/holiday-cakes",
    "/holiday-cakes/page/**",
    "/products/holliday-cakes",
  ],
  [galleryFilteredBy("Cupcakes")]: [
    "/product/cupcakes",
    "/cupcakes",
    "/cupcakes/page/**",
    "/products/cutest-cupcakes-creations",
    "/Cupcakes.html",
  ],
  [galleryFilteredBy("Cake Pops")]: [
    "/product/cake-pops-cookies",
    "/cake-pops-cookies",
    "/cake-pops-cookies/page/**",
  ],
  [galleryFilteredBy("Sculpted")]: [
    "/sculpted-cakes",
    "/sculpted-cakes/page/**",
  ],
  "/gallery": [
    "/product/naughty-cakes",
    "/naughty-cakes",
    "/naughty-cakes/page/**",
    "/products/naughty-cakes",
    "/products/devilish-divorce-cakes",
    "/dessert-bars",
    "/dessert-bars/page/**",
    "/dessert-bar",
    "/products/tantalizing-tortes",
    "/products/gumpaste-decorations",
    "/Gumpaste_Decorations.html",
    "/products",
    "/Our_Products.html",
  ],
  "/favicon.ico": ["/favicon.png"],
  "/admin/index.html": ["/preview"],
});

const WILDCARD_SUFFIX = "/**";

export const matchesRedirectSource = (source: string, path: string) => {
  if (!source.endsWith(WILDCARD_SUFFIX)) return source === path;
  const prefix = source.slice(0, -WILDCARD_SUFFIX.length);
  return path === prefix || path.startsWith(`${prefix}/`);
};

export const findRedirect = (path: string) =>
  redirects.find(({ from }) => matchesRedirectSource(from, path));
