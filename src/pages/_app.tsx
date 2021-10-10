import "@animxyz/core";
import "../styles/app.scss";

import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import Head from "next/head";

import MainMenu from "../components/MainMenu";
import menu from "../resources/menu.json";
import classes from "../styles/pages/app.module.scss";

const App = ({
  Component,
  pageProps: { pageName, ...pageProps },
}: AppProps) => {
  return (
    <ChakraProvider>
      <Head>
        <title>{pageName ? `${pageName} | ` : ""} Cake Elizabeth</title>
      </Head>
      <MainMenu structure={menu} />
      <div className={classes.pageContainer}>
        <div className={classes.contentContainer}>
          <Component {...pageProps} />
        </div>
      </div>
    </ChakraProvider>
  );
};

export default App;
