"use client";

import { useTina } from "tinacms/dist/react";
import { ContactUsPageQuery } from "../../../../.tina/__generated__/types";
import { e } from "easy-tailwind";
import { Markdown } from "../../../components/Markdown";
import { FormSection } from "./FormSection";
import { Suspense } from "react";

export const ContactUsPageClient = ({
  query,
}: {
  query: Parameters<typeof useTina<ContactUsPageQuery>>[0];
}) => {
  const { data } = useTina<ContactUsPageQuery>(query);

  return (
    <div className={e("px-4 py-4 justify-center", { desktop: "px-28" })}>
      <div
        className={e("flex flex-col gap-8", { desktop: "flex-row-reverse" })}
      >
        <section className={e({ desktop: "w-1/3" })}>
          <Markdown noCenter>{data.contactUsPage.contactDetails}</Markdown>
        </section>
        <section className={e({ desktop: "w-2/3" })}>
          <Suspense>
            <FormSection />
          </Suspense>
        </section>
      </div>
    </div>
  );
};
