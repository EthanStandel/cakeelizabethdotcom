import "@animxyz/core";
import "../styles/app.sass";

import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import Head from "next/head";

import Footer from "../components/Footer";
import MainMenu from "../components/MainMenu";
import footerContent from "../resources/footer.json";
import menu from "../resources/menu.json";

const App = ({ Component, pageProps }: AppProps) => {
  const route =
    pageProps.content?.page === "index" ? "" : pageProps.content?.page;
  return (
    <ChakraProvider>
      <Head>
        <link rel="icon" href="/favicon.png" />
        {pageProps.content?.description && (
          <>
            <meta name="description" content={pageProps.content?.description} />
            <meta
              property="og:description"
              content={pageProps.content?.description}
            />
          </>
        )}
        {pageProps.content?.page && (
          <>
            <link rel="canonical" href={`https://cakeelizabeth.com/${route}`} />
            <meta
              property="og:url"
              content={`https://cakeelizabeth.com/${route}`}
            />
          </>
        )}
        <meta property="og:site_name" content="Cake Elizabeth" />
        <meta
          property="article:publisher"
          content="https://www.facebook.com/cakeelizabeth/"
        />
        <meta
          property="og:image"
          content="https://cakeelizabeth.com/resources/other/logo.png"
        />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="en_US" />
        {pageProps.content?.pageTitle && (
          <meta property="og:title" content={pageProps.content?.pageTitle} />
        )}
        <title>
          {pageProps.content?.pageTitle
            ? `${pageProps.content.pageTitle} | Cake Elizabeth`
            : "Cake Elizabeth"}
        </title>
      </Head>
      <div className="app">
        <MainMenu structure={menu} />
        <div className="page">
          <Component {...pageProps} />
        </div>
        <Footer content={footerContent} />
      </div>
    </ChakraProvider>
  );
};

export default App;
