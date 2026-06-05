import { createSignal, onMount, type Accessor } from "solid-js";
import { useSearchParams } from "@solidjs/router";

const TRANSITION_NAME = "gallery-modal-image";

// Excludes the modal's own image via [data-modal] so we don't match ourselves
const findTransitionSourceImage = (imageUrl: string): HTMLImageElement | null => {
  const allImgs = document.querySelectorAll<HTMLImageElement>("img");
  return (
    Array.from(allImgs).find(
      (img) =>
        img.getAttribute("src") === imageUrl && !img.closest("[data-modal]")
    ) ?? null
  );
};

// Calls fn() immediately if the View Transition API is unavailable; returns the transition handle otherwise
const withViewTransition = (
  fn: () => void
): { finished: Promise<void> } | null => {
  if (typeof document === "undefined" || !("startViewTransition" in document)) {
    fn();
    return null;
  }
  return (
    document as Document & {
      startViewTransition: (fn: () => void) => { finished: Promise<void> };
    }
  ).startViewTransition(fn);
};

export const createGalleryModalTransition = (
  imageUrl: string
): [Accessor<boolean>, (e?: MouseEvent) => void] => {
  const [, setSearchParams] = useSearchParams();

  // Starts false so the modal image is invisible until the open transition fires
  const [transitioned, setTransitioned] = createSignal(false);

  // On mount: if the source thumbnail is on screen, morph it into the modal image via a view transition
  onMount(() => {
    const sourceImg = findTransitionSourceImage(imageUrl);

    if (!sourceImg || !("startViewTransition" in document)) {
      setTransitioned(true);
      return;
    }

    sourceImg.style.viewTransitionName = TRANSITION_NAME;
    withViewTransition(() => {
      sourceImg.style.viewTransitionName = "";
      setTransitioned(true);
    });
  });

  // Morphs the modal image back to the gallery thumbnail on close, then clears the transition name
  const handleClose = (e?: MouseEvent) => {
    e?.preventDefault();
    const sourceImg = findTransitionSourceImage(imageUrl);

    const vt = withViewTransition(() => {
      setSearchParams({ modal: undefined });
      if (sourceImg) sourceImg.style.viewTransitionName = TRANSITION_NAME;
    });

    vt?.finished.then(() => {
      if (sourceImg) sourceImg.style.viewTransitionName = "";
    });
  };

  return [transitioned, handleClose];
};
