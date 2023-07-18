import { draftMode } from "next/dist/client/components/headers";

export const GET = () => {
  draftMode().enable();

  // { redirect } from "next/navigation" doesn't properly update the draft mode state
  return new Response("", {
    status: 307,
    headers: {
      Location: "/admin",
    },
  });
};
