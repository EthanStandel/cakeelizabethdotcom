import "@animxyz/core";
import "../styles/app.scss";

import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import Head from "next/head";

import Footer from "../components/Footer";
import MainMenu from "../components/MainMenu";
import footerContent from "../resources/footer.json";
import menu from "../resources/menu.json";

const App = ({
  Component,
  pageProps: { pageTitle, ...pageProps },
}: AppProps) => (
  <ChakraProvider>
    <Head>
      <link rel="icon" href="/favicon.png" />
      <title>
        {pageTitle ? `${pageTitle} | Cake Elizabeth` : "Cake Elizabeth"}
      </title>
    </Head>
    <div className="app">
      <MainMenu structure={menu} />
      <Component {...pageProps} />
      <Footer content={footerContent} />
    </div>
  </ChakraProvider>
);

export default App;
