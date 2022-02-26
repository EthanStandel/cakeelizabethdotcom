import { css } from "@emotion/react";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";

import styleUtils from "../utils/styleUtils";

class Document extends NextDocument {
  render() {
    return (
      <Html lang="en-US" css={styles.html}>
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

const styles = Object.freeze({
  html: css`
    --app-width: 80%;
    --primary-color: aquamarine;
    --secondary-color: springgreen;
    --text-color: #555555;
    --transparent-primary: rgba(127, 255, 212, 0.5);
    ${styleUtils.mobile(
      css`
        --app-width: 95%;
      `
    )}

    * {
      font-family: "Montserrat", sans-serif;
    }

    h2 {
      text-transform: uppercase;
      font-size: 2em;
      margin: 1rem auto;
      text-align: center;
    }

    /* NProgress overrides */
    #nprogress {
      .bar {
        background: var(--text-color) !important;
      }
      .spinner-icon {
        border-top-color: var(--text-color) !important;
        border-left-color: var(--text-color) !important;
      }
    }
  `,
});

export default Document;
