import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { e } from "easy-tailwind";
import cx from "classnames";
import FaSpinner from "./icons/FaSpinner.svg";

export const Button = ({
  submitting = false,
  children,
  ...props
}: { submitting?: boolean } & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => (
  <button
    {...props}
    className={cx(
      props.className,
      e(
        "uppercase tracking-widest text-xl font-bold px-8 py-3 rounded-full bg-primary text-text border-[1px] border-white transition-[box-shadow] relative",
        {
          hover: "shadow-even shadow-primary",
          "focus-within": "shadow-even shadow-primary",
          focus: "outline-none",
          active: "shadow-none",
        }
      )
    )}
  >
    <span className={e("transition-opacity", submitting && "opacity-0")}>
      {children}
    </span>
    <div
      className={e(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity",
        submitting && "!opacity-100"
      )}
    >
      <FaSpinner height="1em" width="1em" className="animate-spin" />
    </div>
  </button>
);
