import "../styles.css";
import { ReactNode } from "react";
import { Navigation } from "./_components/Navigation";
import { Montserrat } from "next/font/google";
import cx from "classnames";
import { Footer } from "./_components/Footer";
import { Metadata } from "next";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const Layout = ({ children }: { children: ReactNode }) => (
  <html lang="en" className={cx(montserrat.variable, "font-sans")}>
    <body className="flex flex-col relative min-h-screen">
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </body>
  </html>
);

export const generateMetadata = async (): Promise<Metadata> => ({
  title: "Cake Elizabeth",
  viewport: "width=device-width,initial-scale=1.0",
  icons: {
    icon: "/favicon.png",
  },
});

export default Layout;
