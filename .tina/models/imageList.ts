import { css } from "@emotion/css";
import cx from "classnames";
import { TinaField } from "tinacms";

export const imageList = (
  details: { name: string; label: string } = { name: "images", label: "Images" }
): TinaField => ({
  type: "object",
  ...details,
  list: true,
  ui: {
    itemProps: (item) => ({
      label: undefined,
      className: cx(
        css({
          height: 150,
          "& > div:nth-child(2)::before": {
            content: "' '",
            width: 150,
            marginRight: "1rem",
            background: `url(${item.image})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left",
            marginTop: -8,
            marginBottom: -8,
            height: "calc(100% + 16px)",
          },
        }),
        // original Tailwind classes, accounting for this issue
        // https://github.com/tinacms/tinacms/issues/3638
        "relative group cursor-pointer flex justify-between items-stretch bg-white border border-gray-100 -mb-px overflow-visible p-0 text-sm font-normal text-gray-600 first:rounded-t last:rounded-b"
      ),
    }),
  },
  fields: [
    {
      type: "image",
      label: "Image",
      name: "image",
      required: true,
    },
  ],
});
