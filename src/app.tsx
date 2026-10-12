import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createSignal, onMount } from "solid-js";
import "./app.css";
import { setupCmsPreview } from "./lib/utils/setupCmsPreview";
import { ModalRenderer } from "./components/modals/ModalRenderer";
import { ConstantsProvider } from "./primitives/ConstantsContext";
import { NavigationProvider } from "./primitives/NavigationContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  onMount(setupCmsPreview);
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <ConstantsProvider>
            <NavigationProvider>
              <div class="relative flex min-h-dvh flex-col">
                <Suspense>
                  <Header
                    isMenuOpen={isMenuOpen()}
                    onMenuOpenChange={setIsMenuOpen}
                  />
                </Suspense>
                <div class="flex grow flex-col" inert={isMenuOpen()}>
                  <div class="grow">
                    <Suspense>{props.children}</Suspense>
                  </div>
                  <Suspense>
                    <Footer />
                  </Suspense>
                </div>
              </div>
              <ModalRenderer />
            </NavigationProvider>
          </ConstantsProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
