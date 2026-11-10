import { NotFound, preloadNotFound } from "~/components/NotFound";
import { ModuleTransitionProvider } from "~/components/ModuleTransition";

export const route = {
  preload: preloadNotFound,
};

export default function NotFoundRoute() {
  return (
    <ModuleTransitionProvider>
      <NotFound />
    </ModuleTransitionProvider>
  );
}
