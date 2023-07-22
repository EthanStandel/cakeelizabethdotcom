"use client";

import { useEffect } from "react";

export const Reroute = ({ to }: { to: string }) => {
  useEffect(() => {
    window.top.addEventListener(
      "hashchange",
      () => window.top.location.reload(),
      {
        once: true,
      }
    );
    window.top.location.replace(to);
  }, []);
  return null;
};
