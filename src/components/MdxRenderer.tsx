import React, { FC } from "react";

import Markdown from "markdown-to-jsx";
import Link from "next/link";

// eslint-disable-next-line react/display-name
const MdxRenderer = React.memo(
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
            a: ({ ...props }) => <Link {...props} />,
            ...components,
          },
        }}
      >
        {input}
      </Markdown>
    );
  }
);

export default MdxRenderer;
