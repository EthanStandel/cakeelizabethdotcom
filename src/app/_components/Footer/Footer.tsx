import { e } from "easy-tailwind";
import { Suspense } from "react";
import { ContentData } from "../../../utils/content";
import { EditButton } from "./EditButton";

export const Footer = ({
  data,
  draftMode,
}: {
  data: ContentData<"GlobalCollection">;
  draftMode: boolean;
}) => (
  <>
    <footer
      className={e(
        "z-20 bg-primary flex justify-center items-center h-8 font-semibold text-text bottom-0 w-full mt-16 relative",
        { desktop: "sticky" }
      )}
    >
      {data.footer.label}
      <Suspense>
        <EditButton draftMode={draftMode} />
      </Suspense>
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
);
