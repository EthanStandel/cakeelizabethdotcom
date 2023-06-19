"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTina } from "tinacms/dist/react";
import { GlobalQuery } from "../../../../.tina/__generated__/types";
import cx from "classnames";
import { SubNavMenu } from "./components/SubNavMenu";
import Image from "next/image";
import FaFacebook from "./FaFacebook.svg";
import FaInstagram from "./FaInstagram.svg";
import { usePresence, usePresenceSwitch } from "../../../utils/usePresence";
import { DetailedHTMLProps, FC, HTMLAttributes, useState } from "react";
import MobileMenuOpenIcon from "./CgMenuLeftAlt.svg";
import MobileMenuCloseIcon from "./GrClose.svg";

const socialLinkIcons = {
  Facebook: FaFacebook,
  Instagram: FaInstagram,
};

export const NavigationClient = ({
  query,
}: {
  query: Parameters<typeof useTina<GlobalQuery>>[0];
}) => {
  const { data } = useTina<GlobalQuery>(query);
  const { phoneNumber, navigation, logo, socialLinks } = data.global.header;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <HeaderSection className="relative z-20">
        <div className="flex justify-between">
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
          <div className="flex gap-2">
            {socialLinks
              .filter(({ label }) => !!socialLinkIcons[label])
              .map(({ label, url }) => {
                const Icon = socialLinkIcons[label];
                return (
                  <a href={url} key={label} aria-label={label}>
                    <Icon className="h-[32px] w-[32px]" />
                  </a>
                );
              })}
          </div>
        </div>
      </HeaderSection>
      <HeaderSection className="max-desktop:hidden z-10">
        <div className="flex justify-center items-center relative">
          <div className="flex-grow flex justify-center">
            <Link href="/">
              <Image
                src={logo}
                height={130}
                width={225}
                alt="Logo"
                className="desktop:h-[130px] desktop:w-[225px] h-[52px] w-[94px]"
              />
            </Link>
          </div>
        </div>
      </HeaderSection>
      <div className="sticky top-0 z-10">
        <HeaderSection className="desktop:hidden">
          <div className="flex justify-center items-center relative">
            <div className="flex items-center">
              <MobileMenuStateToggleButton
                open={mobileMenuOpen}
                toggle={() => setMobileMenuOpen((open) => !open)}
              />
            </div>
            <div className="flex-grow flex justify-center">
              <Link href="/">
                <Image
                  src={logo}
                  height={130}
                  width={225}
                  alt="Logo"
                  className="desktop:h-[130px] desktop:w-[225px] h-[52px] w-[94px]"
                />
              </Link>
            </div>
          </div>
        </HeaderSection>
        <Navigation
          navigation={navigation}
          mobileOpen={mobileMenuOpen}
          closeMobile={() => setMobileMenuOpen(false)}
        />
      </div>
    </>
  );
};

const Navigation = ({
  navigation,
  mobileOpen,
  closeMobile,
}: {
  navigation: GlobalQuery["global"]["header"]["navigation"];
  mobileOpen: boolean;
  closeMobile: () => void;
}) => {
  const pathname = usePathname();
  const { isMounted, isVisible } = usePresence(mobileOpen);

  return (
    <>
      <button
        tabIndex={-1}
        aria-hidden
        onClick={() => closeMobile()}
        className={cx(
          "-z-10 bg-black h-screen w-screen fixed top-0 left-0 desktop:hidden transition-opacity",
          {
            "opacity-0": !isVisible,
            "opacity-30": isVisible,
            "max-desktop:hidden": !isMounted,
          }
        )}
      />
      <div
        className={cx(
          "uppercase tracking-widest font-medium transition absolute desktop:sticky desktop:z-10 left-0 top-full desktop:top-0 w-full items-center text-center -z-10",
          {
            "max-desktop:opacity-0 max-desktop:-translate-y-full": !isVisible,
            "max-desktop:hidden": !isMounted,
          }
        )}
      >
        <HeaderSection>
          <div className="w-full h-5 desktop:hidden" />
          <nav className="flex flex-col desktop:flex-row gap-5 desktop:gap-2 justify-between">
            {navigation.map((item) => {
              if (item.url) {
                const isActive =
                  item.url === "/"
                    ? item.url === pathname
                    : item.url
                    ? pathname.startsWith(item.url)
                    : item.subNavItem.some((subItem) =>
                        pathname.startsWith(subItem.url)
                      );
                return (
                  <div key={item.label}>
                    <Link
                      href={item.url}
                      className={cx("transition-[font-weight]", {
                        "font-bold": isActive,
                      })}
                    >
                      {item.label}
                    </Link>
                  </div>
                );
              } else {
                return (
                  <div key={item.label}>
                    <SubNavMenu item={item} />
                  </div>
                );
              }
            })}
          </nav>
        </HeaderSection>
        <div className="w-full h-10 bg-gradient-to-b from-primary to-transparent gradient desktop:hidden" />
      </div>
    </>
  );
};

const mobileMenuStateIcon = {
  open: MobileMenuOpenIcon as FC<any>,
  closed: MobileMenuCloseIcon as FC<any>,
};

const MobileMenuStateToggleButton = ({
  open,
  toggle,
}: {
  open: boolean;
  toggle: () => void;
}) => {
  const { isMounted, mountedItem, isEntering, isExiting } = usePresenceSwitch(
    !open ? "open" : "closed",
    { transitionDuration: 100 }
  );
  const Icon = mobileMenuStateIcon[mountedItem];

  if (!isMounted) return null;

  return (
    <button
      aria-label="Toggle mobile menu"
      onClick={toggle}
      className={cx("absolute left-0 transition duration-150", {
        "linear ": isExiting,
        "ease-out": isEntering,
        "-rotate-90 opacity-0": (isEntering && open) || (isExiting && !open),
        "rotate-90 opacity-0": (isExiting && open) || (isEntering && !open),
      })}
    >
      <Icon className="h-8 w-8" />
    </button>
  );
};

const HeaderSection = ({
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => (
  <header
    className={cx(
      "bg-primary py-2 desktop:py-4 text-text px-4 desktop:px-28 desktop:text-lg text-md",
      className
    )}
    {...props}
  />
);
