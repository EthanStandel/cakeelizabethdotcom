import type { JSX } from "solid-js";
import { cx } from "cva";

export const ListItemChip = (props: JSX.HTMLAttributes<HTMLLIElement>) => (
  <li
    class={cx(
      "rounded-full border border-border bg-eggshell px-2 py-1 text-sm",
      props.class,
    )}
    {...props}
  />
);
