import { PropsOf } from "../utils/PropsOf";
import Link from "next/link";
import { e } from "easy-tailwind";
import cx from "classnames";

export const CardLink = ({ className, ...props }: PropsOf<typeof Link>) => (
  <Link
    {...props}
    className={cx(
      className,
      e(
        "bg-white h-auto w-auto shadow transition-[box-shadow,border-color] rounded overflow-hidden text-text border border-gray-400",
        {
          hover: "shadow-primary border-primary",
          "focus-visible": "shadow-primary border-primary",
          active: "shadow-none border-primary",
        }
      )
    )}
  />
);
