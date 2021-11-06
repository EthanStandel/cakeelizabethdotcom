import { useEffect } from "react";

import { useRouter } from "next/dist/client/router";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  });
  return <></>;
};

export default Page;
