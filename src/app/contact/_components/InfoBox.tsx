import { DetailedHTMLProps, HTMLAttributes } from "react";
import cx from "classnames";

export const InfoBox = ({
  type,
  ...props
}: { type: "error" | "success" } & DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => (
  <div
    {...props}
    className={cx(
      props.className,
      "rounded border-[2px] p-4 w-full",
      type === "success" && "border-green-500 bg-green-200",
      type === "error" && "border-red-500 bg-red-200"
    )}
  />
);
