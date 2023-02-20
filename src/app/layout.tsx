import "../styles.css";
import { ReactNode } from "react";
import { Navigation } from "./components/Navigation";
import { Montserrat } from "@next/font/google";
import cx from "classnames";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const Layout = ({ children }: { children: ReactNode }) => (
  <html lang="en" className={cx(montserrat.variable, "font-sans")}>
    <body>
      <Navigation />
      <main>{children}</main>
    </body>
  </html>
);

export default Layout;
