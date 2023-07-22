import { Markdown } from "../../../../components/Markdown";
import { e } from "easy-tailwind";
import { ContentData } from "../../../../utils/content";

export const AboutUsPage = ({
  data,
}: {
  data: ContentData<"AboutUsPageCollection">;
}) => (
  <div className={e("px-4 py-4 justify-center", { desktop: "px-28" })}>
    <h1 className="text-center text-5xl pb-4">{data.title}</h1>
    <section className={e("flex gap-8 flex-col mt-6", { desktop: "flex-row" })}>
      <div
        className={e("flex justify-center items-center", {
          desktop: "w-3/5",
        })}
      >
        <Markdown>{data.newOwnershipBody}</Markdown>
      </div>
      <ul
        className={e("flex flex-col gap-4 justify-center items-center", {
          desktop: "w-2/5",
        })}
      >
        {data.ownerPhotos.map(({ image }, index) => (
          <li className="rounded overflow-hidden w-full max-w-md" key={index}>
            <img className="w-full" src={image} />
          </li>
        ))}
      </ul>
    </section>
    <section
      className={e("flex flex-col gap-8 mt-6", {
        desktop: "flex-row-reverse",
      })}
    >
      <div
        className={e("flex justify-center items-center", {
          desktop: "w-3/5",
        })}
      >
        <Markdown>{data.aboutTheFounderBody}</Markdown>
      </div>
      <ul
        className={e("flex flex-col gap-4 justify-center items-center", {
          desktop: "w-2/5",
        })}
      >
        {data.founderPhotos.map(({ image }, index) => (
          <li className="rounded overflow-hidden w-full max-w-md" key={index}>
            <img className="w-full" src={image} />
          </li>
        ))}
      </ul>
    </section>
  </div>
);
