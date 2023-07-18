"use client";

import { Content, useContentData } from "../../../utils/content";

export const FooterClient = ({
  content,
}: {
  content: Content<"GlobalCollection">;
}) => {
  const data = useContentData(content);

  return <>{data.footer.label}</>;
};
