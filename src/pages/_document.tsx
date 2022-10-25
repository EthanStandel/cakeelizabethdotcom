import NextDocument, { Html, Head, Main, NextScript } from "next/document";

import { getCssText } from "../style";

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
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
