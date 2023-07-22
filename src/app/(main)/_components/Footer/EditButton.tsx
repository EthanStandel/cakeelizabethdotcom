"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaEdit } from "./FaEdit";
import { FaEject } from "./FaEject";

export const EditButton = ({ draftMode }: { draftMode: boolean }) => {
  const pathname = usePathname();
  const href = `/draft/${draftMode ? "disable" : "enable"}/${pathname}`;

  useEffect(() => {
    const inIframe = window.location !== window.top.location;
    if ((draftMode && !inIframe) || (!draftMode && inIframe)) {
      window.location.replace(href);
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
