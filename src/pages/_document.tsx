import { createStitches, styled } from "@stitches/react";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";

import styleUtils from "../utils/styleUtils";

const { getCssText } = createStitches();

class Document extends NextDocument {
  render() {
    return (
      <Html lang="en-US">
        <Head>
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssText() }}
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap"
          />
        </Head>
        <styles.Body>
          <Main />
          <NextScript />
        </styles.Body>
      </Html>
    );
  }
}

const styles = Object.freeze({
  Body: styled("body", {
    "--card-border-radius": "5px",
    "--app-width": "80%",
    "--primary-color": "#65ffce",
    "--secondary-color": "springgreen",
    "--text-color": "#555555",
    "--transparent-primary": "rgba(127, 255, 212, 0.5)",

    [styleUtils.mobile]: {
      "--app-width": "95%",
    },

    "*": {
      fontFamily: "Montserrat, sans-serif",
    },
    h2: {
      textTransform: "uppercase",
      fontSize: "2em",
      margin: "1rem auto",
      textAlign: "center",
    },

    "#nprogress": {
      ".bar": {
        background: "var(--text-color) !important",
      },
      ".spinner-icon": {
        borderTopColor: "var(--text-color) !important",
        borderLeftColor: "var(--text-color) !important",
      },
    },
  }),
});

export default Document;
