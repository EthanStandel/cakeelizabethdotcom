import React, { FC, useState, useEffect, useRef } from "react";

import { styled } from "@stitches/react";

export const InputLabel: FC<{
  label: string | React.ReactElement;
  required?: boolean;
  error?: boolean;
  icon?: React.ReactElement;
  children: React.ReactElement<{
    onChange?: (event: { target: { value: string } }) => unknown;
  }>;
}> = ({ label, required, error, children: childrenProp, icon }) => {
  const [float, setFloat] = useState(false);
  const ref = useRef<HTMLLabelElement>(null);

  const children = React.cloneElement(childrenProp, {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setFloat(!!e.target.value);
      childrenProp.props.onChange?.(e);
    },
  });

  useEffect(() => {
    if (ref.current) {
      setFloat(
        !!(
          ref.current.querySelector("input, textarea") as
            | HTMLInputElement
            | HTMLTextAreaElement
            | undefined
        )?.value
      );
    }
  }, []);

  return (
    <styles.InputLabel ref={ref} float={float} error={error} withIcon={!!icon}>
      <span className="labelText">
        {label} {required && <styles.Required>*</styles.Required>}
      </span>
      {icon && <span className="labelIcon">{icon}</span>}
      {children}
    </styles.InputLabel>
  );
};

const styles = Object.freeze({
  InputLabel: styled("label", {
    display: "block",
    position: "relative",
    cursor: "text",
    marginTop: ".5rem",
    marginBottom: ".5rem",
    width: "100%",
    "> .labelIcon": {
      position: "absolute",
      display: "flex",
      height: "100%",
      "&, > img": {
        width: "2rem",
        left: "1rem",
        maxHeight: 56,
        maxWidth: 28,
        opacity: 0.5,
      },
    },
    "> .labelText": {
      transition: ".1s font-size ease, .1s top ease",
      pointerEvents: "none",
      position: "absolute",
      paddingLeft: "1rem",
      paddingRight: "1rem",
      fontSize: "1rem",
      left: "1rem",
      top: "1.1rem",
      background:
        "linear-gradient(to right, transparent, white 10%, white 90%, transparent)",
    },

    "&:focus-within": {
      "> .labelText": {
        fontSize: ".8rem",
        top: "-.4rem",
      },
    },

    "> input": {
      height: "3.5rem",
    },

    "> textarea": {
      paddingTop: "1rem",
      paddingBottom: "1rem",
    },

    "> input, > textarea": {
      lineHeight: 1.5,
      transition: ".2s box-shadow ease, .2s border-color linear",
      width: "100%",
      minHeight: "3.5rem",
      borderRadius: "calc(1.75rem + 3px)",
      minWidth: 200,
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: "1.5rem",
      paddingRight: "1.5rem",
      "> *": {
        flexGrow: 1,
      },
      border: "3px solid var(--border-color)",
      "&:focus": {
        outlineWidth: 0,
        boxShadow:
          "-6px 0px 4px 0px $colors$primary, 6px 0px 4px 0px var(--text-color)",
      },
    },

    variants: {
      float: {
        true: {
          "> .labelText": {
            fontSize: ".8rem",
            top: "-.4rem",
          },
        },
      },
      error: {
        true: {
          "> input, > textarea": {
            borderColor: "red",
          },
        },
      },
      withIcon: {
        true: {
          "> input, > textarea": {
            paddingLeft: "3.5rem",
          },
          "> .labelText": {
            left: "2.5rem",
          },
        },
      },
    },
  }),
  Required: styled("span", {
    color: "red",
    fontWeight: "bold",
  }),
});
