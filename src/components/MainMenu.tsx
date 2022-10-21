import React from "react";

import { XyzTransition } from "@animxyz/react";
import { ChevronDownIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Menu as ChakraMenu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { css, styled } from "@stitches/react";
import { keyword } from "color-convert";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { IconType } from "react-icons";
import { FaFacebookSquare, FaInstagramSquare } from "react-icons/fa";

import useIsMobileView from "../hooks/useIsMobileView";
import { Menu } from "../models/Menu";
import styleUtils from "../utils/styleUtils";

export interface Props {
  structure: Menu;
}

const socialIcons = {
  facebook: FaFacebookSquare,
  instagram: FaInstagramSquare,
} as Record<string, IconType>;

const MainMenu = ({ structure }: Props) => (
  <>
    <styles.ShadowRoot />
    <styles.MainMenu>
      <styleUtils.ContentContainerFullWidth>
        <styles.TopItems>
          <div>
            <a href={`tel:${structure.phone}`}>{structure.phone}</a>
          </div>
          <div>
            {structure.social.map((social) => (
              <styles.SocialLink
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
              >
                <Icon
                  h="2em"
                  w="2em"
                  aria-label={social.name}
                  as={socialIcons[social.icon]}
                />
              </styles.SocialLink>
            ))}
          </div>
        </styles.TopItems>
        <styles.LogoContainer className={styleUtils.desktopOnly()}>
          <Link href={structure.href!}>
            <a>
              <Image
                alt={structure.name}
                src={structure.logo}
                height="130px"
                width="225px"
              />
            </a>
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
  const [open, setOpen] = React.useState(false);

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
            <styles.MobileMenu
              variant="outline"
              aria-label="Menu"
              icon={open ? <CloseIcon /> : <HamburgerIcon />}
              onClick={() => setOpen(!open)}
            />
            <styles.MobileImageContainer>
              <Link href={structure.href!}>
                <a>
                  <Image
                    alt={structure.name}
                    src={structure.logo}
                    height="52px"
                    width="94px"
                  />
                </a>
              </Link>
            </styles.MobileImageContainer>
          </styles.MobileMenuContainer>
        </styleUtils.ContentContainerFullWidth>
      </styles.MainMenu>
      <XyzTransition xyz="up-100%">
        {open && (
          <styles.HiddenMenuContainer>
            <MenuItems structure={structure} />
          </styles.HiddenMenuContainer>
        )}
      </XyzTransition>
    </styles.StickyRoot>
  );
};

const MenuItems = ({ structure }: Props) => {
  // asPath, despite the name, contains query params 🤦
  const [pathname] = useRouter().asPath.split("?");

  const isMobileView = useIsMobileView();
  return (
    <styles.MenuItems>
      {structure.children?.map((item) => {
        const selectedItem =
          item.href === pathname ||
          item.children?.find((subitem) => subitem.href === pathname);
        return (
          <styles.RootMenuItem key={item.name}>
            {item.children ? (
              <ChakraMenu placement={isMobileView ? "bottom" : undefined}>
                <styles.MenuButton
                  as="button"
                  className={selectedItem && styles.selected()}
                >
                  {item.name}
                  {item.children && <ChevronDownIcon h="1.5em" w="1.5em" />}
                </styles.MenuButton>
                <MenuList>
                  {item.children?.map((subitem) => (
                    <Link key={subitem.href} href={subitem.href!} passHref>
                      <MenuItem
                        as="a"
                        className={
                          selectedItem === subitem ? styles.selected() : ""
                        }
                      >
                        {subitem.name}
                      </MenuItem>
                    </Link>
                  ))}
                </MenuList>
              </ChakraMenu>
            ) : (
              <Link href={item.href!} passHref>
                <a
                  className={selectedItem && styles.selected()}
                  key={item.name}
                >
                  {item.name}
                </a>
              </Link>
            )}
          </styles.RootMenuItem>
        );
      })}
    </styles.MenuItems>
  );
};

const styles = Object.freeze({
  MainMenu: styled(
    "div",
    {
      background: "var(--primary-color) !important",
      color: "var(--text-color)",
      zIndex: 4,
      width: "100%",
      position: "sticky",
    },
    styleUtils.contentContainerParent
  ),
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
  MenuButton: styled(MenuButton, {
    "& + *": {
      zIndex: "4 !important",
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
  MobileMenu: styled(IconButton, {
    margin: ".5rem 0",
    borderColor: "var(--text-color) !important",
    backgroundColor: "transparent !important",
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
});

export default MainMenu;
