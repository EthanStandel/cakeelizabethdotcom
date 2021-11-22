import React from "react";

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

// eslint-disable-next-line react/display-name
const MdRenderer = React.memo(
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

export default MdRenderer;
