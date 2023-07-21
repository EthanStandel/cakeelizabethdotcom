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
    <Link
      className="absolute right-4 top-1/2 -translate-y-1/2"
      title={draftMode ? "Exit draft mode" : "Edit this page"}
      href={{
        pathname: draftMode ? "/draft/disable" : "/draft/enable",
        query: { to },
      }}
    >
      {draftMode ? <FaEject /> : <FaEdit />}
    </Link>
  );
};
