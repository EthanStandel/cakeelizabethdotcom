import { TinaField } from "tinacms";
import { css } from "@emotion/css";
import cx from "classnames";

export const ImageListField = (
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
        })
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
