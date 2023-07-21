"use client";

import { useEffect } from "react";

export const Reroute = ({ to }: { to: string }) => {
  useEffect(() => {
    window.top.location.assign(to);
  }, []);
  return <></>;
};
