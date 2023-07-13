import { useSearchParams } from "next/navigation";
import { usePresenceSwitch } from "use-presence";
import { ContactForm } from "./ContactForm";
import { e } from "easy-tailwind";
import { InfoBox } from "./InfoBox";

export const FormSection = () => {
  const submissionState = useSearchParams().get("submission") as
    | "success"
    | "error"
    | null;
  const { mountedItem, isVisible } = usePresenceSwitch(submissionState, {
    transitionDuration: 300,
  });

  switch (mountedItem) {
    case "success":
      return (
        <InfoBox
          type="success"
          className={e(
            "transition-[opacity,transform]",
            !isVisible && "opacity-0 scale-50"
          )}
        >
          Thanks for reaching out! We'll try to get back to you as quickly as
          possible
        </InfoBox>
      );
    case "error":
      return (
        <InfoBox
          type="error"
          className={e(
            "transition-[opacity,transform]",
            !isVisible && "opacity-0 scale-50"
          )}
        >
          Looks like something went wrong, so please just shoot an email with
          what you're looking for over to{" "}
          <a target="_blank" href="mailto:info@cakeelizabeth.com">
            info@cakeelizabeth.com
          </a>
        </InfoBox>
      );
    default:
      return (
        <ContactForm
          className={e(
            "transition-[opacity,transform]",
            !isVisible && "opacity-0 scale-50"
          )}
        />
      );
  }
};
