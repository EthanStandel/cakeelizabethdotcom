import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import { ConstantsShape } from "~/models";
import { Content } from "~/components/Content";
import { CmsSourceContextProvider } from "~/lib/cms/CmsPathContext";
import { useConstants } from "~/primitives/ConstantsContext";

export default function NotFound() {
  const constants = useConstants();
  return (
    <CmsSourceContextProvider collection={ConstantsShape.name} slug="main">
      <main>
        <Title>{constants()?.notFoundTitle ?? "Not Found"}</Title>
        <HttpStatusCode code={404} />
        <h1>
          <Content
            content={constants()}
            property="notFoundHeading"
            type="string"
          />
        </h1>
        <p>
          Visit{" "}
          <a href="https://start.solidjs.com" target="_blank">
            start.solidjs.com
          </a>{" "}
          to learn how to build SolidStart apps.
        </p>
      </main>
    </CmsSourceContextProvider>
  );
}
