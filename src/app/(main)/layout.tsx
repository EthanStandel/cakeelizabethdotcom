import "../../styles.css";
import { ReactNode } from "react";
import { Navigation } from "./_components/Navigation";
import { Montserrat } from "next/font/google";
import cx from "classnames";
import { Footer } from "./_components/Footer/Footer";
import { Metadata, Viewport } from "next";
import { LiveContentData } from "../../utils/LiveContentData";
import { FooterClient } from "./_components/Footer/FooterClient";
import { draftMode } from "next/headers";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const Layout = async ({ children }: { children: ReactNode }) => (
  <html lang="en" className={cx(montserrat.variable, "font-sans")}>
    <body className="flex flex-col relative min-h-screen overflow-y-scroll">
      <Navigation />
      <main className="flex-grow">{children}</main>
      <LiveContentData
        component={Footer}
        clientWrapper={FooterClient}
        type="GlobalCollection"
        draftMode={(await draftMode()).isEnabled}
      />
    </body>
  </html>
);

export const generateMetadata = async (): Promise<Metadata> => ({
  metadataBase: new URL("https://cakeelizabeth.com"),
  title: "Cake Elizabeth",
  icons: {
    icon: "/favicon.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    locale: "en_US",
  },
});

export const viewport: Viewport = {
  themeColor: "#65ffce",
  width: "device-width",
  initialScale: 1.0,
};

export default Layout;
