import { memo } from "react";

import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import classes from "../styles/components/MdRenderer.module.sass";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify);

export const processMd = (input: string) =>
  String(processor.processSync(input));

const MdRenderer = ({
  input,
  as: Component = "div",
}: {
  input: string;
  as?: "div" | "span";
}) => (
  <Component
    className={classes.root}
    dangerouslySetInnerHTML={{ __html: processMd(input) }}
  />
);

export default memo(MdRenderer);
