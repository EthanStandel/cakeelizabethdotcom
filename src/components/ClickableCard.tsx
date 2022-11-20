import { styled } from "@stitches/react";
import Image from "next/image";
import Link from "next/link";

import styleUtils from "../utils/styleUtils";

import { Button } from "./core/Button";

interface Props {
  image: string;
  alt: string;
  href: string;
  cta: string;
  title: string;
}

const ClickableCard = ({ image, alt, href, cta, title }: Props) => (
  <Link href={href} passHref>
    <styles.LinkRoot>
      <Image height="300px" width="300px" alt={alt} src={image} />
      <styles.Container>
        <p>{title}</p>
        <Button tabIndex={-1}>{cta}</Button>
      </styles.Container>
    </styles.LinkRoot>
  </Link>
);

const styles = Object.freeze({
  LinkRoot: styled(
    "a",
    {
      display: "block",
      width: 300,
      height: 400,
      maxWidth: 400,
      borderRadius: "var(--card-border-radius)",
      overflow: "hidden",

      [styleUtils.mobile]: {
        width: "100%",
      },

      "& > :first-child": {
        width: "100% !important",
      },

      img: {
        objectFit: "cover",
        objectPosition: "0% 0%",
      },
    },
    styleUtils.clickableShadow
  ),
  Container: styled("div", {
    height: 100,
    padding: "0.5rem 1rem 1rem 1rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    "& > p": {
      textAlign: "center",
    },
  }),
});

export default ClickableCard;
