import React from "react";

import { useMDXComponent } from "next-contentlayer/hooks";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import classes from "../styles/pages/app.module.sass";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify);

export const processMd = (input: string) =>
  String(processor.processSync(input));

// use this for plain MD strings
// eslint-disable-next-line react/display-name
export const MdRenderer = React.memo(
  ({
    input,
    as: Component = "div",
  }: {
    input: string;
    as?: "div" | "span";
  }) => (
    <Component
      className={classes.htmlRoot}
      dangerouslySetInnerHTML={{ __html: processMd(input) }}
    />
  )
);

// use this for precompiled performant MDX content
// eslint-disable-next-line react/display-name
export const MdxRenderer = React.memo(
  ({
    input,
    as: Component = "div",
  }: {
    input: { code: string };
    as?: "div" | "span";
  }) => {
    const Renderer = useMDXComponent(input.code);

    return (
      <Component className={classes.htmlRoot}>
        <Renderer />
      </Component>
    );
  }
);
