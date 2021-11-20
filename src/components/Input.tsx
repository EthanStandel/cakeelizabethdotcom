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
import PhoneNumberInput, {
  Props as PhoneNumberInputProps,
} from "react-phone-number-input/input";

import classes from "../styles/components/Input.module.sass";

type Props = FieldAttributes<unknown> & {
  left?: React.ReactChild;
  right?: React.ReactChild;
  label?: string;
  textarea?: boolean;
  phoneNumber?: boolean;
  required?: boolean;
  name: string;
};

const Input = ({
  left,
  right,
  label,
  required = false,
  textarea = false,
  phoneNumber = false,
  name,
  ...otherProps
}: Props) => {
  const [field, meta, { setValue }] = useField<string>(name);
  const inputProps = {
    errorBorderColor: "crimson",
    isInvalid: meta.error && meta.touched,
    ...field,
    ...otherProps,
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
            className={classes.padded}
            size="lg"
          />
        ) : phoneNumber ? (
          <PhoneNumberInput
            defaultCountry="US"
            inputComponent={CkInput}
            size="lg"
            className={classes.padded}
            {...(inputProps as PhoneNumberInputProps)}
            onChange={(input: string) => setValue(input ?? "")}
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
