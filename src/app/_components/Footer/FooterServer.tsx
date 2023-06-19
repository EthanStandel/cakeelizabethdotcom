import { asyncComponent } from "../../../utils/asyncComponent";
import { FooterClient as FooterContent } from "./FooterClient";
import { client } from "../../../../.tina/__generated__/client";

export const FooterServer = asyncComponent(async () => {
  const { data, query, variables } = await client.queries.footerData();

  return (
    <>
      <footer className="z-20 bg-primary flex justify-center items-center h-8 font-semibold text-text desktop:sticky bottom-0 w-full mt-16">
        <FooterContent query={{ data, query, variables }} />
      </footer>
      <div
        className="absolute bottom-0 h-8 w-full -translate-y-8 hidden desktop:block z-10"
        style={{
          background:
            // using these rather than white & transparent because Safari is weird about transparent gradients
            "linear-gradient(180deg, rgba(255,255,255, 0) 0%, rgba(255,255,255, 1) 100%)",
        }}
      />
      <div
        className="sticky h-[1px] hidden desktop:block w-full -mb-[1px] -translate-y-[1px] bottom-0 bg-primary"
        style={{ boxShadow: "5px -1.5em 20px 5px rgb(0 0 0 / 50%)" }}
      />
    </>
  );
});
