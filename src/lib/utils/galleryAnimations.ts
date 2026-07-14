// Mirrors --default-transition-duration in app.css — kept here for JS setTimeout calculations
export const GALLERY_DURATION_MS = 350;

// For places where Tailwind classes can't be used (setting ref.style directly)
export const galleryTransition = (property: string, active = true): string =>
  active
    ? `${property} var(--default-transition-duration) var(--default-transition-timing-function)`
    : "none";

// Mobile swipe gesture thresholds
export const GALLERY_SWIPE_THRESHOLD_PX = 50;
export const GALLERY_SWIPE_VELOCITY = 0.3;

// Desktop modal card's width never exceeds this, regardless of viewport size
export const GALLERY_MODAL_MAX_SIZE_PX = 1280;

// Desktop modal card's width:height parts, e.g. 3:2
const GALLERY_MODAL_ASPECT_RATIO_WIDTH_PART = 3;
const GALLERY_MODAL_ASPECT_RATIO_HEIGHT_PART = 2;

// Expressed as a single CSS aspect-ratio number (width / height)
export const GALLERY_MODAL_ASPECT_RATIO =
  GALLERY_MODAL_ASPECT_RATIO_WIDTH_PART / GALLERY_MODAL_ASPECT_RATIO_HEIGHT_PART;

// Image-panel:content-panel width ratio — reuses the aspect ratio's height part (rather than
// its own literal) so the two proportions stay numerically related instead of drifting apart
export const GALLERY_MODAL_PANEL_SPLIT_RATIO =
  GALLERY_MODAL_ASPECT_RATIO_HEIGHT_PART;
