import { usePathname, useRouter } from "next/navigation";
import {
  DetailedHTMLProps,
  FormHTMLAttributes,
  useState,
  useTransition,
} from "react";
import { sendContactFormEmail } from "../_service/sendContactFormEmail";
import { Button } from "./Button";
import { TextInput, transformers } from "./TextInput";
import FaUserTag from "./icons/FaUserTag.svg";
import FaPhoneAlt from "./icons/FaPhoneAlt.svg";
import FaEnvelope from "./icons/FaEnvelope.svg";
import FaMessage from "./icons/FaMessage.svg";
import FaFileAlt from "./icons/FaFileAlt.svg";
import { e } from "easy-tailwind";

export const ContactForm = (
  props: Omit<
    DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
    "onSubmit"
  >
) => {
  const [, startTransition] = useTransition();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <form
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const fields = [
          "fullName",
          "email",
          "phoneNumber",
          "subject",
          "message",
        ] as const;
        type FieldKey = (typeof fields)[number];
        const request = fields.reduce((acc, key) => {
          acc[key] = form.get(key) as string;
          return acc;
        }, {} as Record<FieldKey, string>);
        setSubmitting(true);
        startTransition(async () => {
          const result = await sendContactFormEmail(request);
          setSubmitting(false);
          router.replace(
            `${pathname}?submission=${result ? "success" : "error"}`
          );
        });
      }}
    >
      <TextInput
        prefixIcon={FaUserTag}
        label="Full name"
        inputProps={{ required: true }}
      />
      <TextInput
        prefixIcon={FaEnvelope}
        label="Email"
        inputProps={{
          required: true,
          type: "email",
          pattern: transformers.email.pattern,
        }}
      />
      <TextInput
        prefixIcon={FaPhoneAlt}
        label="Phone number"
        transform={transformers.phoneNumber.transform}
        inputProps={{ pattern: transformers.phoneNumber.pattern }}
      />
      <TextInput prefixIcon={FaMessage} label="Subject" />
      <TextInput
        as="textarea"
        prefixIcon={FaFileAlt}
        label="Message"
        inputProps={{ required: true, rows: 5 }}
      />
      <div className="flex my-4">
        <Button
          className={e("flex-grow", { desktop: "flex-grow-0" })}
          submitting={submitting}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};
