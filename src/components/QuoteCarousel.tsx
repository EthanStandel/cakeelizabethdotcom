import React from "react";

import classes from "../styles/components/QuoteCarousel.module.sass";
import appClasses from "../styles/pages/app.module.sass";

import Carousel from "./Carousel";

interface QuoteModel {
  name: string;
  text: string;
}

const QuoteCarousel = ({ quotes }: { quotes: Array<QuoteModel> }) => {
  const [autoPlay, setAutoPlay] = React.useState(true);
  return (
    <Carousel
      infiniteLoop
      autoPlay={autoPlay}
      showThumbs={false}
      onClickItem={() => setAutoPlay(false)}
    >
      {quotes.map((quote) => (
        <Quote key={quote.text} quote={quote} />
      ))}
    </Carousel>
  );
};

const Quote = ({ quote: { text, name } }: { quote: QuoteModel }) => (
  <div className={classes.quote}>
    <div className={appClasses.contentContainer}>
      <p className={classes.text}>{`"${text}"`}</p>
      <p className={classes.name}>{`--${name}`}</p>
    </div>
  </div>
);

export default QuoteCarousel;
