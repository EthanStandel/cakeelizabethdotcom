"use client";
import { useTina } from "tinacms/dist/react";
import { FooterDataQuery } from "../../../../.tina/__generated__/types";

export const FooterClient = ({
  query,
}: {
  query: Parameters<typeof useTina<FooterDataQuery>>[0];
}) => {
  const { data } = useTina<FooterDataQuery>(query);

  return <>{data.globalConnection.edges[0].node.footer.label}</>;
};
