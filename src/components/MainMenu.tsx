import React, { useState, useRef } from "react";

import FacebookIcon from "@fortawesome/fontawesome-free/svgs/brands/facebook-f.svg";
import InstagramIcon from "@fortawesome/fontawesome-free/svgs/brands/instagram.svg";
import HamburgerIcon from "@fortawesome/fontawesome-free/svgs/solid/bars.svg";
import ChevronDownIcon from "@fortawesome/fontawesome-free/svgs/solid/chevron-down.svg";
import CloseIcon from "@fortawesome/fontawesome-free/svgs/solid/xmark.svg";
import { css, styled } from "@stitches/react";
import { keyword } from "color-convert";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { CSSTransition } from "react-transition-group";

import { Menu, MenuItem } from "../models/Menu";
import styleUtils from "../utils/styleUtils";

import { DropdownMenu } from "./DropdownMenu";

export interface Props {
  structure: Menu;
}

const socialIcons = {
  facebook: FacebookIcon.src,
  instagram: InstagramIcon.src,
};

const MainMenu = ({ structure }: Props) => (
  <>
    <styles.ShadowRoot />
    <styles.MainMenu>
      <styleUtils.ContentContainerFullWidth>
        <styles.TopItems>
          <div>
            <a href={`tel:${structure.phone}`}>{structure.phone}</a>
          </div>
          <styles.SocialLinks>
            {structure.social.map((social) => (
              <styles.SocialLink
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={socialIcons[social.icon as keyof typeof socialIcons]}
                  alt={social.name}
                />
              </styles.SocialLink>
            ))}
          </styles.SocialLinks>
        </styles.TopItems>
        <styles.LogoContainer className={styleUtils.desktopOnly()}>
          <Link href={structure.href!}>
            <Image
              alt={structure.name}
              src={structure.logo}
              height={130}
              width={225}
            />
          </Link>
        </styles.LogoContainer>
      </styleUtils.ContentContainerFullWidth>
    </styles.MainMenu>
    <MobileStickyMenu structure={structure} />
    <styles.StickyRoot className={styleUtils.desktopOnly()}>
      <styles.MainMenu>
        <styleUtils.ContentContainerFullWidth>
          <MenuItems structure={structure} />
        </styleUtils.ContentContainerFullWidth>
      </styles.MainMenu>
    </styles.StickyRoot>
  </>
);

const MobileStickyMenu = ({ structure }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootTransitionalRef = useRef(null);

  React.useEffect(() => {
    const closeMenu = () => setOpen(false);
    router.events.on("routeChangeStart", closeMenu);
    return () => router.events.off("routeChangeStart", closeMenu);
  }, [router]);

  return (
    <styles.StickyRoot className={styleUtils.mobileOnly()}>
      <styles.MainMenu>
        <styleUtils.ContentContainerFullWidth>
          <styles.MobileMenuContainer>
            <styles.IconButton onClick={() => setOpen(!open)}>
              <img src={open ? CloseIcon.src : HamburgerIcon.src} alt="Menu" />
            </styles.IconButton>
            <styles.MobileImageContainer>
              <Link href={structure.href!}>
                <Image
                  alt={structure.name}
                  src={structure.logo}
                  height={52}
                  width={94}
                />
              </Link>
            </styles.MobileImageContainer>
          </styles.MobileMenuContainer>
        </styleUtils.ContentContainerFullWidth>
      </styles.MainMenu>
      <CSSTransition
        timeout={200}
        in={open}
        nodeRef={rootTransitionalRef}
        classNames="mobile-menu"
        unmountOnExit
      >
        <div ref={rootTransitionalRef} className={styles.transitionalRoot()}>
          <styles.HiddenMenuContainer>
            <MenuItems structure={structure} />
          </styles.HiddenMenuContainer>
        </div>
      </CSSTransition>
    </styles.StickyRoot>
  );
};

const MenuItems = ({ structure }: Props) => {
  // asPath, despite the name, contains query params 🤦
  const [pathname] = useRouter().asPath.split("?");

  return (
    <styles.MenuItems>
      {structure.children?.map((item) => {
        const selectedItem = item.children?.find(
          (subitem: MenuItem) => subitem.href === pathname
        );
        return (
          <styles.RootMenuItem key={item.name}>
            {item.children ? (
              <MenuButton item={item} selectedItem={selectedItem} />
            ) : (
              <Link
                href={item.href!}
                className={
                  !!selectedItem || item.href === pathname
                    ? styles.selected()
                    : ""
                }
                key={item.name}
              >
                {item.name}
              </Link>
            )}
          </styles.RootMenuItem>
        );
      })}
    </styles.MenuItems>
  );
};

const MenuButton = ({
  item,
  selectedItem,
}: {
  item: MenuItem;
  selectedItem?: MenuItem;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <styles.MenuButton
        className={selectedItem ? styles.selected() : ""}
        onClick={() => setOpen(!open)}
      >
        {item.name}
        {item.children && <img src={ChevronDownIcon.src} alt="Open submenu" />}
        <DropdownMenu
          selectedItem={selectedItem}
          items={item.children as { name: string; href: string }[]}
          open={open}
          onClose={() => setOpen(false)}
        />
      </styles.MenuButton>
    </>
  );
};

const styles = Object.freeze({
  MainMenu: styled("div", styleUtils.contentContainerParent, {
    background: "var(--primary-color) !important",
    color: "var(--text-color)",
    zIndex: 5,
    width: "100%",
    position: "sticky",
  }),
  TopItems: styled("div", {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",

    "> div": {
      margin: "1rem",
      // Safari has wrong calculations for how they
      // define the space for text, which forces the
      // phone number to wrap here, this fixes that
      wordBreak: "keep-all",
    },
  }),
  SocialLink: styled("a", {
    margin: ".25rem",
  }),
  LogoContainer: styled(
    "div",
    {
      display: "flex",
      justifyContent: "center",
      width: "100%",

      "> button": {
        margin: ".5rem",
      },
    },
    styleUtils.desktopOnly
  ),
  MenuItems: styled("ul", {
    display: "flex",
    width: "100%",
    maxWidth: "100%",
    flexWrap: "wrap",
    [styleUtils.mobile]: {
      flexDirection: "column",
    },
    li: {
      listStyleType: "none",
    },
  }),
  MenuButton: styled("button", {
    position: "relative",
    "& + *": {
      zIndex: "4 !important",
    },
    img: {
      display: "inline-block",
      marginLeft: "0.5em",
      height: "1em",
      width: "1em",
      opacity: 0.7,
    },
  }),
  selected: css({
    fontWeight: "bold !important",
  }),
  RootMenuItem: styled("li", {
    "&, button, a": {
      textTransform: "uppercase",
      letterSpacing: "0.15em",
      fontSize: "0.95em",
      fontWeight: 500,
      textAlign: "center",
    },

    margin: "1rem",

    [styleUtils.mobile]: {
      margin: ".5rem",
    },

    flexGrow: 1,
    whiteSpace: "nowrap",

    [styleUtils.desktop]: {
      "&:first-child": {
        marginLeft: 0,
      },
      "&:last-child": {
        marginRight: 0,
      },
    },
  }),
  StickyRoot: styled("div", {
    zIndex: 4,
    position: "sticky",
    top: 0,
  }),
  IconButton: styled("button", {
    height: "2.5em",
    width: "2.5em",
    borderRadius: "1.25em",
    border: "1px solid black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    img: {
      opacity: 0.7,
      height: "1.5em",
      width: "1.5em",
    },
  }),
  // adds a "sliding door" shadow when the header goes sticky
  ShadowRoot: styled("div", {
    background: "var(--primary-color)",
    position: "sticky",
    height: 1,
    marginTop: -2,
    zIndex: 1,
    top: 1,
    boxShadow: `5px calc(1.4em + 1.9rem) 20px 5px rgba(${keyword
      .rgb("black")
      .join(",")}, 0.5)`,
    width: "100%",
  }),
  transitionalRoot: css({
    "&.mobile-menu-enter > *": {
      transform: "translateX(-100%)",
    },
    "&.mobile-menu-enter-active > *": {
      transform: "none",
      transition: "transform .2s ease",
    },
    "&.mobile-menu-exit > *": {
      transform: "none",
    },
    "&.mobile-menu-exit-active > *": {
      transition: "transform .2s ease",
      transform: "translateX(-100%)",
    },
  }),
  MobileMenuContainer: styled("div", {
    display: "flex",
    width: "100%",
    "& > :last-child": {
      flexGrow: 1,
      height: 52,
      marginTop: 2,
      width: 52,
    },
  }),
  MobileImageContainer: styled("div", {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-around",
    img: {
      height: 52,
    },
  }),
  HiddenMenuContainer: styled("div", {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    height: "100vh",
    top: 0,
    width: "100%",
    background: "var(--primary-color)",
  }),
  SocialLinks: styled("div", {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    a: {
      height: "1.5em",
      width: "1.5em",
      img: {
        opacity: 0.7,
        maxHeight: "1.5em",
        maxWidth: "1.5em",
      },
    },
  }),
});

export default MainMenu;
