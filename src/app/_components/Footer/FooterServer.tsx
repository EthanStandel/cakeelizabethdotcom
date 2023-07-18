import { asyncComponent } from "../../../utils/asyncComponent";
import { FooterClient as FooterContent } from "./FooterClient";
import { e } from "easy-tailwind";
import { getContent } from "../../../utils/content";

export const FooterServer = asyncComponent(async () => (
  <>
    <footer
      className={e(
        "z-20 bg-primary flex justify-center items-center h-8 font-semibold text-text bottom-0 w-full mt-16",
        { desktop: "sticky" }
      )}
    >
      <FooterContent content={await getContent("GlobalCollection")} />
    </footer>
    <div
      className={e("absolute bottom-0 h-8 w-full -translate-y-8 hidden z-10", {
        desktop: "block",
      })}
      style={{
        background:
          // using these rather than white & transparent because Safari is weird about transparent gradients
          "linear-gradient(180deg, rgba(255,255,255, 0) 0%, rgba(255,255,255, 1) 100%)",
      }}
    />
    <div
      className={e(
        "sticky h-[1px] hidden w-full -mb-[1px] -translate-y-[1px] bottom-0 bg-primary",
        { desktop: "block" }
      )}
      style={{ boxShadow: "5px -1.5em 20px 5px rgb(0 0 0 / 50%)" }}
    />
  </>
));
