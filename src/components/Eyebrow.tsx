import { cx } from "cva";
import { JSX } from "solid-js";

export const Eyebrow = (props: JSX.HTMLAttributes<HTMLParagraphElement>) => (
  <p {...props}>
    <span class="uppercase tracking-widest text-secondary-foreground dark:text-primary text-xs @dsk:text-sm border-y-2 border-primary py-1">
      {props.children}
    </span>
  </p>
);
