import { Router } from "@solidjs/router";
import { HttpStatusCode } from "@solidjs/start";
import { FileRoutes } from "@solidjs/start/router";
import { ErrorBoundary, Suspense, createSignal, onMount } from "solid-js";
import "./app.css";
import { setupCmsPreview } from "./lib/utils/setupCmsPreview";
import { ModalRenderer } from "./components/modals/ModalRenderer";
import { SiteWideProvider } from "./primitives/SiteWideContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HeadProvider } from "./components/seo/HeadProvider";

const FAILED_RENDER_STATUS = 500;

function renderFailure(error: unknown) {
  console.error(error);
  return <HttpStatusCode code={FAILED_RENDER_STATUS} />;
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  onMount(setupCmsPreview);
  return (
    <Router
      root={(props) => (
        <HeadProvider>
          <ErrorBoundary fallback={renderFailure}>
            <SiteWideProvider>
              <div class="relative flex min-h-dvh flex-col">
                <Suspense>
                  <Header
                    isMenuOpen={isMenuOpen()}
                    onMenuOpenChange={setIsMenuOpen}
                  />
                </Suspense>
                <div class="flex grow flex-col" inert={isMenuOpen()}>
                  <Suspense>{props.children}</Suspense>
                  <Suspense>
                    <Footer />
                  </Suspense>
                </div>
              </div>
              <ModalRenderer />
            </SiteWideProvider>
          </ErrorBoundary>
        </HeadProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
