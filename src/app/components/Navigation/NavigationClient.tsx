"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTina } from "tinacms/dist/react";
import { GlobalQuery } from "../../../../.tina/__generated__/types";
import cx from "classnames";
import { DesktopSubNavMenu } from "./components/DesktopSubNavMenu";
import Image from "next/image";

export const NavigationClient = ({
  query,
}: {
  query: Parameters<typeof useTina<GlobalQuery>>[0];
}) => {
  const pathname = usePathname();
  const { data } = useTina<GlobalQuery>(query);
  const { phoneNumber, navigation, logo } = data.global.header;

  return (
    <header className="bg-primary py-2 lg:py-4 text-text px-4 lg:px-32">
      <div className="flex">
        <a
          href={
            "tel:" +
            phoneNumber
              .split("")
              .filter((char) => /\d/.test(char))
              .join("")
          }
        >
          {phoneNumber}
        </a>
      </div>
      <div className="flex justify-center items-center my-2">
        <Link href="/">
          <Image
            src={logo}
            height={130}
            width={225}
            alt="Logo"
            className="lg:h-[130px] lg:w-[225px] h-[52px] w-[94px]"
          />
        </Link>
      </div>
      <nav className="flex justify-between uppercase tracking-[0.15em]">
        {navigation.map((item) => {
          if (item.url) {
            const isActive =
              pathname === "/"
                ? item.url === "/"
                : item.url
                ? pathname.startsWith(item.url)
                : item.subNavItem.some((subItem) =>
                    pathname.startsWith(subItem.url)
                  );
            return (
              <Link
                key={item.label}
                href={item.url}
                className={cx({ "font-bold": isActive }, "font-sans")}
              >
                {item.label}
              </Link>
            );
          } else {
            return <DesktopSubNavMenu item={item} />;
          }
        })}
      </nav>
    </header>
  );
};
