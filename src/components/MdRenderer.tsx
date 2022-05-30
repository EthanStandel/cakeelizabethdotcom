import React, { FC } from "react";

import Markdown from "markdown-to-jsx";
import Link from "next/link";

// eslint-disable-next-line react/display-name
const MdRenderer = React.memo(
  ({
    input,
    components = {},
  }: {
    input: string;
    components?: Record<string, FC<any>>;
  }) => {
    return (
      <Markdown
        options={{
          overrides: {
            a: ({ href, ...props }) => (
              <Link href={href}>
                <a {...props} />
              </Link>
            ),
            ...components,
          },
        }}
      >
        {input}
      </Markdown>
    );
  }
);

export default MdRenderer;
