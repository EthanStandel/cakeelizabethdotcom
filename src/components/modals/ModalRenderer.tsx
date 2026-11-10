import { Component, Match, Suspense, Switch } from "solid-js";
import { Portal } from "solid-js/web";
import { GalleryModal } from "./GalleryModal";
import { createQueryParamRouting } from "~/lib/utils/QueryParamSchemas";

export const ModalRenderer: Component = () => {
  const { modal } = createQueryParamRouting.modal.href();

  return (
    <Portal>
      <Suspense>
        <Switch>
          <Match when={modal()?.type === "gallery" ? modal() : null}>
            {(m) => <GalleryModal imageUrl={m().payload.imageUrl} />}
          </Match>
        </Switch>
      </Suspense>
    </Portal>
  );
};
