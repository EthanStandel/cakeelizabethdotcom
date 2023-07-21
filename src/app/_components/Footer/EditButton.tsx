"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FaEdit } from "./FaEdit";
import { FaEject } from "./FaEject";

export const EditButton = ({ draftMode }: { draftMode: boolean }) => {
  const pathname = usePathname();
  const params = useSearchParams();
  const to = `${pathname}?${params.toString()}`;
  return (
    <a
      className="absolute right-4 top-1/2 -translate-y-1/2"
      title={draftMode ? "Exit draft mode" : "Edit this page"}
      href={`${draftMode ? "/draft/disable" : "/draft/enable"}?to=${to}`}
    >
      {draftMode ? <FaEject /> : <FaEdit />}
    </a>
  );
};
