import classes from "./Markdown.module.scss";
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import cx from "classnames";

export const Markdown = ({
  children,
  className,
  ...props
}: { children: TinaMarkdownContent } & Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "children"
>) => (
  <div className={cx(className, classes.markdown)} {...props}>
    <TinaMarkdown content={children} />
  </div>
);
