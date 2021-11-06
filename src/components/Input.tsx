import React from "react";

import {
  Input as CkInput,
  FormControl,
  FormLabel,
  Textarea,
  InputGroup,
  TextareaProps,
  InputProps,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { useField, FieldAttributes } from "formik";

import classes from "../styles/components/Input.module.sass";

type Props = FieldAttributes<unknown> & {
  left?: React.ReactChild;
  right?: React.ReactChild;
  label?: string;
  textarea?: boolean;
  required?: boolean;
};

const Input = ({
  left,
  right,
  label,
  required = false,
  textarea = false,
  ...fieldProps
}: Props) => {
  const [field, meta] = useField(fieldProps);
  const inputProps = {
    errorBorderColor: "crimson",
    isInvalid: meta.error && meta.touched,
    ...fieldProps,
    ...field,
  };

  return (
    <FormControl>
      {label && (
        <FormLabel>
          {label}
          {required && <span className={classes.required}>{" *"}</span>}
        </FormLabel>
      )}
      <InputGroup>
        {left && (
          <InputLeftElement pointerEvents="none" boxSize="2em" fontSize="1.5em">
            {left}
          </InputLeftElement>
        )}
        {textarea ? (
          <Textarea
            {...(inputProps as TextareaProps)}
            className={classes.textarea}
            size="lg"
          />
        ) : (
          <CkInput {...(inputProps as InputProps)} size="lg" />
        )}
        {right && (
          <InputRightElement pointerEvents="none">{right}</InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  );
};

export default Input;
