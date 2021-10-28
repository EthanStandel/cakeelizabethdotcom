import { Button } from "@chakra-ui/react";
import Image from "next/image";

import classes from "../styles/components/ClickableCard.module.scss";

interface Props {
  image: string | StaticImageData;
  alt: string;
  href: string;
  cta: string;
  title: string;
}

const ClickableCard = ({ image, alt, href, cta, title }: Props) => (
  <a href={href} className={classes.root}>
    <Image height="300px" width="300px" alt={alt} src={image} />
    <div className={classes.container}>
      <p>{title}</p>
      <Button tabIndex={-1}>{cta}</Button>
    </div>
  </a>
);

export default ClickableCard;