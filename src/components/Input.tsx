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

import classes from "../styles/components/Input.module.scss";

type Props = FieldAttributes<unknown> & {
  left?: React.ReactChild;
  right?: React.ReactChild;
  label?: string;
  textarea?: boolean;
  isRequired?: boolean;
};

const Input = ({
  left,
  right,
  label,
  isRequired = false,
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
    <FormControl isRequired={isRequired}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup>
        {left && (
          <InputLeftElement pointerEvents="none">{left}</InputLeftElement>
        )}
        {textarea ? (
          <Textarea
            {...(inputProps as TextareaProps)}
            className={classes.textarea}
          />
        ) : (
          <CkInput {...(inputProps as InputProps)} />
        )}
        {right && (
          <InputRightElement pointerEvents="none">{right}</InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  );
};

export default Input;
