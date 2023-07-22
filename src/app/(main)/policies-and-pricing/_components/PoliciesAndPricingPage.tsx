import { Markdown } from "../../../../components/Markdown";
import { e } from "easy-tailwind";
import { ContentData } from "../../../../utils/content";

export const PoliciesAndPricingPage = ({
  data,
}: {
  data: ContentData<"PoliciesAndPricingPageCollection">;
}) => (
  <div className={e("px-4 py-4 justify-center", { desktop: "px-28" })}>
    <h1 className="text-center text-5xl pb-4">{data.title}</h1>
    <Markdown>{data.body}</Markdown>
  </div>
);
