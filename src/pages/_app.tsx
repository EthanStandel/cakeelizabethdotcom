import "@animxyz/core";
import "nprogress/nprogress.css";

import { useEffect } from "react";

import { styled } from "@stitches/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import NProgress from "nprogress";

import Footer from "../components/Footer";
import MainMenu from "../components/MainMenu";
import footerContent from "../resources/footer.json";
import menu from "../resources/menu.json";

const App = ({
  Component,
  pageProps,
}: AppProps & {
  pageProps: {
    content: { page: string; description: string; pageTitle: string };
  };
}) => {
  const route =
    pageProps.content.page === "index" ? "" : pageProps.content.page;

  const { events } = useRouter();

  useEffect(() => {
    events.on("routeChangeStart", () => NProgress.start());
    events.on("routeChangeComplete", () => NProgress.done());
    events.on("routeChangeError", () => NProgress.done());
  });

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
        {pageProps.content.description && (
          <>
            <meta name="description" content={pageProps.content.description} />
            <meta
              property="og:description"
              content={pageProps.content.description}
            />
          </>
        )}
        {pageProps.content.page && (
          <>
            <link rel="canonical" href={`https://cakeelizabeth.com/${route}`} />
            <meta
              property="og:url"
              content={`https://cakeelizabeth.com/${route}`}
            />
          </>
        )}
        <meta name="theme-color" content="#65ffce" />
        <meta property="og:site_name" content="Cake Elizabeth" />
        <meta
          property="article:publisher"
          content="https://www.facebook.com/cakeelizabeth/"
        />
        <meta
          property="og:image"
          content="https://cakeelizabeth.com/resources/other/logo.svg"
        />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="en_US" />
        {pageProps.content?.pageTitle && (
          <meta property="og:title" content={pageProps.content.pageTitle} />
        )}
        <title>
          {pageProps.content.pageTitle
            ? `${pageProps.content.pageTitle} | Cake Elizabeth`
            : "Cake Elizabeth"}
        </title>
      </Head>
      <styles.App>
        <MainMenu structure={menu} />
        <styles.Page>
          <Component {...pageProps} />
        </styles.Page>
        <Footer content={footerContent} />
      </styles.App>
    </>
  );
};

const styles = Object.freeze({
  App: styled("div", {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    position: "relative",
  }),
  Page: styled("main", {
    flexGrow: 1,
  }),
});

export default App;
