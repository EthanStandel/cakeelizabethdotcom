"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { FaEdit } from "./FaEdit";
import { FaEject } from "./FaEject";

export const EditButton = ({ draftMode }: { draftMode: boolean }) => {
  const pathname = usePathname();
  const params = useSearchParams();
  const to = encodeURIComponent(`${pathname}?${params.toString()}`);
  const href = `/draft/${draftMode ? "disable" : "enable"}/${to}`;

  useEffect(() => {
    const inIframe = window.location !== window.top.location;
    if ((draftMode && !inIframe) || (!draftMode && inIframe)) {
      window.location.assign(href);
    }
  }, []);

  return (
    <a
      className="absolute right-4 top-1/2 -translate-y-1/2"
      title={draftMode ? "Exit draft mode" : "Edit this page"}
      href={href}
    >
      {draftMode ? <FaEject /> : <FaEdit />}
    </a>
  );
};
