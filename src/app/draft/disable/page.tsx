import { draftMode } from "next/dist/client/components/headers";
import { Reroute } from "../_components/Reroute";

const Page = ({ searchParams }) => {
  draftMode().disable();

  // The reason this isn't a 3xx response on a route.ts is because
  // When this route is reached, it may be within an iframe
  // So we need to force-navigate window.top
  return <Reroute to={decodeURIComponent(searchParams.to) || "/"} />;
};

export default Page;

export const dynamic = "force-dynamic";
