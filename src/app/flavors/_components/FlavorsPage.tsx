import { Markdown } from "../../../components/Markdown";
import { FlavorGroupCard } from "./FlavorGroupCard";
import { e } from "easy-tailwind";
import { ContentData } from "../../../utils/content";

export const FlavorsPage = ({
  data,
}: {
  data: ContentData<"FlavorPageCollection">;
}) => (
  <div className={e("px-4 py-4 justify-center", { desktop: "px-28" })}>
    <div
      className={e("flex flex-col gap-4 items-center py-4", {
        desktop: "grid grid-cols-2",
      })}
    >
      <div>
        <h1 className="uppercase text-center text-4xl pb-4">{data.title}</h1>
        <Markdown>{data.body}</Markdown>
        <FlavorGroupCard {...data.flavorGroups[0]} />
      </div>
      <img className="rounded" src={data.heroImage} />
    </div>
    <div
      className={e("flex flex-col gap-4 items-center py-4", {
        desktop: "grid grid-cols-2",
      })}
    >
      {data.flavorGroups.slice(1).map((group, index) => (
        <FlavorGroupCard key={index} {...group} />
      ))}
    </div>
  </div>
);
