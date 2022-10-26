import { InputHTMLAttributes, useRef, forwardRef } from "react";

const formatPhoneNumber = (nums: Array<string>) => {
  let output = "";
  if (nums.length < 3) {
    return nums.join("");
  } else {
    output += `(${nums.slice(0, 3).join("")}) `;
  }

  if (nums.length < 6) {
    return output + nums.slice(3).join("");
  } else {
    output += `${nums.slice(3, 6).join("")}-`;
  }

  return output + nums.slice(6, 10).join("");
};

// eslint-disable-next-line react/display-name
export const PhoneNumberInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ onChange, ...props }, ref) => {
  const lastValueLength = useRef(0);
  const lastNumOnlyLength = useRef(0);

  return (
    <input
      ref={ref}
      onChange={(e) => {
        const numOnly = e.target.value
          .split("")
          .filter((char) => /[0-9]/.test(char));
        if (
          lastValueLength.current > numOnly.length &&
          numOnly.length === lastNumOnlyLength.current
        ) {
          numOnly.pop();
        }
        const printValue = formatPhoneNumber(numOnly);
        lastValueLength.current = e.target.value.length;
        lastNumOnlyLength.current = numOnly.length;
        e.target.value = printValue;
        onChange?.(e);
      }}
      {...props}
    />
  );
});
