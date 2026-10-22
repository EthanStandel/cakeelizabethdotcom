import { createSignal, onMount, type Accessor } from "solid-js";
import { useSearchParams } from "@solidjs/router";

const TRANSITION_NAME = "gallery-modal-image";

// True while a modal open/close view transition is in progress. Gallery items
// subscribe to this to reactively set their own view-transition-name to "none",
// preventing them from becoming floating pseudo-elements during the transition.
export const [isModalTransitioning, setIsModalTransitioning] =
  createSignal(false);

// Excludes the modal's own image via [data-modal] so we don't match ourselves
const findTransitionSourceImage = (
  imageUrl: string,
): HTMLImageElement | null => {
  const allImgs = document.querySelectorAll<HTMLImageElement>("img");
  return (
    Array.from(allImgs).find(
      (img) =>
        img.getAttribute("src") === imageUrl && !img.closest("[data-modal]"),
    ) ?? null
  );
};

// Calls fn() immediately if the View Transition API is unavailable; returns the transition handle otherwise.
export const withViewTransition = (
  fn: () => void,
  types?: string[],
): { finished: Promise<void> } | null => {
  if (typeof document === "undefined" || !("startViewTransition" in document)) {
    fn();
    return null;
  }
  return document.startViewTransition(
    types?.length ? { update: fn, types } : fn,
  );
};

export const createGalleryModalTransition = (
  getImageUrl: () => string,
): [Accessor<boolean>, (e?: MouseEvent) => void] => {
  const [, setSearchParams] = useSearchParams();

  const [transitioned, setTransitioned] = createSignal(false);

  onMount(() => {
    const sourceImg = findTransitionSourceImage(getImageUrl());

    if (!sourceImg || !("startViewTransition" in document)) {
      setTransitioned(true);
      return;
    }

    sourceImg.style.viewTransitionName = TRANSITION_NAME;
    setIsModalTransitioning(true);
    const viewTransition = withViewTransition(() => {
      sourceImg.style.viewTransitionName = "";
      setTransitioned(true);
    });
    const done = () => setIsModalTransitioning(false);
    if (viewTransition) viewTransition.finished.then(done, done);
    else done();
  });

  const handleClose = (e?: MouseEvent) => {
    e?.preventDefault();
    const sourceImg = findTransitionSourceImage(getImageUrl());
    setIsModalTransitioning(true);

    const viewTransition = withViewTransition(() => {
      setSearchParams({ modal: undefined });
      if (sourceImg) sourceImg.style.viewTransitionName = TRANSITION_NAME;
    });

    const done = () => {
      if (sourceImg) sourceImg.style.viewTransitionName = "";
      setIsModalTransitioning(false);
    };
    if (viewTransition) viewTransition.finished.then(done, done);
    else done();
  };

  return [transitioned, handleClose];
};
