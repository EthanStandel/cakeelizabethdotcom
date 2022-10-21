import React, { useState } from "react";

import { css, styled } from "@stitches/react";

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
  <styles.Quote>
    <styleUtils.ContentContainerParent>
      <styleUtils.ContentContainer>
        <styles.Text>{`"${text}"`}</styles.Text>
        <styles.Name>{`--${name}`}</styles.Name>
      </styleUtils.ContentContainer>
    </styleUtils.ContentContainerParent>
  </styles.Quote>
);

const styles = Object.freeze({
  Quote: styled("div", {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    height: 400,
    backgroundColor: "var(--primary-color)",
    [styleUtils.mobile]: {
      height: 300,
    },
    p: {
      fontWeight: 500,
      color: "var(--text-color)",
    },
  }),
  Text: styled("p", {
    fontSize: "2.5em",
    fontStyle: "italic",
    [styleUtils.mobile]: {
      fontSize: "1.25em",
    },
  }),
  Name: styled("p", {
    fontSize: "2em",
    textAlign: "right",
    [styleUtils.mobile]: {
      fontSize: "1em",
    },
  }),
});

export default QuoteCarousel;
