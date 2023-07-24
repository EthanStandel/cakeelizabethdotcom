import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  HTMLAttributes,
  useState,
  createElement,
} from "react";
import cx from "classnames";
import { e } from "easy-tailwind";
import camelCase from "lodash/camelCase";

export const TextInput = ({
  inputProps = {},
  label,
  prefixIcon: Prefix,
  transform,
  as = "input",
  ...props
}: (
  | {
      as?: "input";
      inputProps?: DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >;
    }
  | {
      as: "textarea";
      inputProps?: DetailedHTMLProps<
        TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
      >;
    }
) & {
  label: string;
  prefixIcon?: any;
  transform?: (input: string) => string;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  const name = inputProps.name ?? camelCase(label);
  const [raised, setRaised] = useState(false);
  const [touched, setTouched] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const triggerHighlight = () => {
    setHighlight(true);
    setTimeout(() => setHighlight(false), 150);
  };
  const [_valid, setValid] = useState(true);
  const invalid = touched && !_valid;

  return (
    <div
      {...props}
      className={cx(
        props.className,
        "py-2 text-text font-medium text-lg",
        !!Prefix && "!left-12"
      )}
    >
      <label
        className={e(
          "block relative rounded-[2rem] border-[1px] border-text py-4 px-8 duration-quick transition-[border-color,box-shadow] group/label !cursor-text",
          !!Prefix && "!pl-14",
          invalid && "!border-red-500",
          highlight && invalid && "!shadow-red-500 shadow-sm-even",
          {
            "focus-within": [
              "border-blue-500 shadow-blue-500 shadow-sm-even",
              invalid && "shadow-red-500",
            ],
          }
        )}
      >
        {!!Prefix && (
          <span
            className={e(
              "absolute left-6 top-[30px] -translate-y-1/2 transition-colors duration-quick",
              invalid && "!text-red-500",
              {
                "group-focus-within/label": "text-blue-500",
              }
            )}
          >
            <Prefix height="1em" width="1em" />
          </span>
        )}
        <span
          className={e(
            "absolute top-[30px] -translate-y-1/2 left-6 px-2 duration-quick transition-[top,translate,font-size,color] bg-labelGradient",
            raised && "!top-0 text-sm",
            !!Prefix && "!left-12",
            invalid && "text-red-500",
            {
              "group-focus-within/label": [
                !invalid && "!text-blue-500",
                invalid && "!text-red-500",
              ],
            }
          )}
        >
          {label}
          {inputProps.required && <span className="text-red-500">*</span>}
        </span>
        {createElement(as, {
          ...inputProps,
          name,
          onFocus: (e) => {
            setRaised(true);
            inputProps.onFocus?.(e);
          },
          onBlur: (e) => {
            if (e.target.value === "") {
              setRaised(false);
            }
            setTouched(true);
            setValid(e.currentTarget.validity.valid);
            inputProps.onBlur?.(e);
          },
          onChange: (e) => {
            if (transform) {
              e.target.value = transform(e.target.value);
            }
            if (touched) {
              setValid(e.currentTarget.validity.valid);
            }
            inputProps.onChange?.(e);
          },
          onInvalid: (e) => {
            e.preventDefault();
            setTouched(true);
            const valid = e.currentTarget.validity.valid;
            setValid(valid);
            if (!valid) triggerHighlight();
            inputProps.onInvalid?.(e);
          },
          className: cx(
            inputProps.className,
            e("bg-transparent w-full", {
              focus: "outline-none",
            })
          ),
        })}
      </label>
    </div>
  );
};

export const transformers = {
  phoneNumber: {
    transform: (input: string) => {
      const digits = input.replace(/\D/g, "");
      const length = digits.length;

      let output = "";

      if (length <= 3) {
        output += digits;
      } else {
        output += `(${digits.slice(0, 3)})`;

        if (length < 6) {
          output += ` ${digits.slice(3)}`;
        } else {
          output += ` ${digits.slice(3, 6)}`;

          if (length > 6) {
            output += `-${digits.slice(6, 10)}`;
          }
        }
      }

      return output;
    },
    pattern: "^(?:\\(\\d{3}\\) \\d{3}-\\d{4}|)$",
  },
  email: {
    pattern: "([a-zA-Z0-9]|\\.|-|\\+|%|_)+@([a-zA-Z0-9]|\\.|-)+\\.[a-zA-Z]{2,}",
  },
};
