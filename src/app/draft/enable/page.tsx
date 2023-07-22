import { draftMode } from "next/headers";
import { Reroute } from "../_components/Reroute";

const Page = ({ searchParams }) => {
  draftMode().enable();

  // The reason this isn't a 3xx response on a route.ts is because
  // These routes need that hash in them and the server responses
  // will lose any appended hash (#) subroutes
  return (
    <Reroute to={`/admin#/~${decodeURIComponent(searchParams.to) || "/"}`} />
  );
};

export default Page;

export const dynamic = "force-dynamic";
