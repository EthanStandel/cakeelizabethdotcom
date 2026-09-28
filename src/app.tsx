import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, onMount } from "solid-js";
import "./app.css";
import { setupCmsPreview } from "./lib/utils/setupCmsPreview";
import { ModalRenderer } from "./components/modals/ModalRenderer";
import { ConstantsProvider } from "./primitives/ConstantsContext";

export default function App() {
  onMount(setupCmsPreview);
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <ConstantsProvider>
            <Title>SolidStart - Basic</Title>
            <a href="/">Index</a>
            <a href="/about">About</a>
            <Suspense>{props.children}</Suspense>
            <ModalRenderer />
          </ConstantsProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
