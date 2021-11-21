import "@animxyz/core";
import "../styles/app.sass";

import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import Head from "next/head";

import Footer from "../components/Footer";
import MainMenu from "../components/MainMenu";
import footerContent from "../resources/footer.json";
import menu from "../resources/menu.json";

const App = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider>
    <Head>
      <link rel="icon" href="/favicon.png" />
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

export default App;
