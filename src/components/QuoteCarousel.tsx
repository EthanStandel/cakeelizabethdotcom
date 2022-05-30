import React, { useState } from "react";

import { css } from "@emotion/react";

import styleUtils from "../utils/styleUtils";

import Carousel from "./Carousel";

interface QuoteModel {
  name: string;
  text: string;
}

const QuoteCarousel = ({ quotes }: { quotes: Array<QuoteModel> }) => {
  const [index, setIndex] = useState(0);
  return (
    <Carousel
      index={index}
      setIndex={setIndex}
      items={quotes}
      zIndex={0}
      autoplay
      pagination
      slideComponent={({ item: quote }) => (
        <Quote key={quote.text} quote={quote} />
      )}
    />
  );
};

const Quote = ({ quote: { text, name } }: { quote: QuoteModel }) => (
  <div css={[styles.quote]}>
    <div css={styleUtils.contentContainerParent}>
      <div css={styleUtils.contentContainer}>
        <p css={styles.text}>{`"${text}"`}</p>
        <p css={styles.name}>{`--${name}`}</p>
      </div>
    </div>
  </div>
);

const styles = Object.freeze({
  quote: css`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 400px;
    ${styleUtils.mobile(css`
      height: 300px;
    `)}
    background-color: var(--primary-color);

    p {
      font-weight: 500;
      color: var(--text-color);
    }
  `,
  text: css`
    font-size: 2.5em;
    font-style: italic;
    ${styleUtils.mobile(
      css`
        font-size: 1.25em;
      `
    )}
  `,
  name: css`
    font-size: 2em;
    text-align: right;
    ${styleUtils.mobile(
      css`
        font-size: 1em;
      `
    )}
  `,
});

export default QuoteCarousel;
