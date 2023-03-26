import { PropsOf } from "../utils/PropsOf";
import Link from "next/link";
import cx from "classnames";

export const CardLink = ({ className, ...props }: PropsOf<typeof Link>) => (
  <Link
    {...props}
    className={cx(
      className,
      "bg-white h-auto w-auto shadow hover:shadow-primary focus-visible:shadow-primary active:shadow-none transition-[box-shadow,border-color] rounded overflow-hidden text-text border border-gray-400 hover:border-primary focus-visible:border-primary active:border-primary"
    )}
  />
);
