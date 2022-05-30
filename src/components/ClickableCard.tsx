import { Button } from "@chakra-ui/react";
import { css } from "@emotion/react";
import Image from "next/image";
import Link from "next/link";

import styleUtils from "../utils/styleUtils";

interface Props {
  image: string;
  alt: string;
  href: string;
  cta: string;
  title: string;
}

const ClickableCard = ({ image, alt, href, cta, title }: Props) => (
  <Link href={href} passHref>
    <a css={styles.root}>
      <Image height="300px" width="300px" alt={alt} src={image} />
      <div css={styles.container}>
        <p>{title}</p>
        <Button tabIndex={-1}>{cta}</Button>
      </div>
    </a>
  </Link>
);

const styles = Object.freeze({
  root: css`
    ${styleUtils.clickableShadow}
    display: block;
    width: 300px;
    height: 400px;
    max-width: 400px;
    border-radius: var(--chakra-radii-md);

    ${styleUtils.mobile(css`
      width: 100%;
    `)}

    &>:first-child {
      width: 100% !important;
    }

    img {
      object-fit: cover;
      object-position: 0% 0%;
      border-top-left-radius: var(--chakra-radii-md);
      border-top-right-radius: var(--chakra-radii-md);
    }
  `,
  container: css`
    height: 100px;
    padding: 0.5rem 1rem 1rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    & > p {
      text-align: center;
    }
  `,
});

export default ClickableCard;
