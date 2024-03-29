import { draftMode } from "next/headers";
import { Reroute } from "../../_components/Reroute";

const Page = ({ params }) => {
  draftMode().disable();

  // The reason this isn't a 3xx response on a route.ts is because
  // When this route is reached, it may be within an iframe
  // So we need to force-navigate window.top
  return <Reroute to={params.to ? `/${params.to.join("/")}` : "/"} />;
};

export default Page;

export const dynamic = "force-dynamic";
