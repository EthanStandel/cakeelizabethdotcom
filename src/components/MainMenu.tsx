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
import { css } from "@emotion/react";
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
    <div css={styles.shadowRoot} />
    <div css={[styles.root, styleUtils.contentContainerParent]}>
      <div css={styleUtils.contentContainerFullWidth}>
        <div css={styles.topItems}>
          <div>
            <a href={`tel:${structure.phone}`}>{structure.phone}</a>
          </div>
          <div>
            {structure.social.map((social) => (
              <a
                css={styles.socialLink}
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
              </a>
            ))}
          </div>
        </div>
        <div css={[styles.logoContainer, styleUtils.desktopOnly]}>
          <Link href={structure.href!}>
            <a>
              <Image
                alt={structure.name}
                src={structure.logo}
                height="125px"
                width="225px"
              />
            </a>
          </Link>
        </div>
      </div>
    </div>
    <MobileStickyMenu structure={structure} />
    <div css={[styles.stickyRoot, styleUtils.desktopOnly]}>
      <div css={[styles.root, styleUtils.contentContainerParent]}>
        <div css={styleUtils.contentContainerFullWidth}>
          <MenuItems structure={structure} />
        </div>
      </div>
    </div>
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
    <div css={[styles.stickyRoot, styleUtils.mobileOnly]}>
      <div css={[styles.root, styleUtils.contentContainerParent]}>
        <div css={styleUtils.contentContainerFullWidth}>
          <div css={styles.mobileMenuContainer}>
            <IconButton
              css={styles.mobileMenu}
              variant="outline"
              aria-label="Menu"
              icon={open ? <CloseIcon /> : <HamburgerIcon />}
              onClick={() => setOpen(!open)}
            />
            <div css={styles.mobileImageContainer}>
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
            </div>
          </div>
        </div>
      </div>
      <XyzTransition xyz="up-100%">
        {open && (
          <div css={styles.hiddenMenuContainer}>
            <MenuItems structure={structure} />
          </div>
        )}
      </XyzTransition>
    </div>
  );
};

const MenuItems = ({ structure }: Props) => {
  // asPath, despite the name, contains query params 🤦
  const [pathname] = useRouter().asPath.split("?");

  const isMobileView = useIsMobileView();
  return (
    <ul css={styles.menuItems}>
      {structure.children?.map((item) => {
        const selectedItem =
          item.href === pathname ||
          item.children?.find((subitem) => subitem.href === pathname);
        return (
          <li css={styles.rootMenuItem} key={item.name}>
            {item.children ? (
              <ChakraMenu placement={isMobileView ? "bottom" : undefined}>
                <MenuButton
                  as="button"
                  css={[styles.menuButton, selectedItem && styles.selected]}
                >
                  {item.name}
                  {item.children && <ChevronDownIcon h="1.5em" w="1.5em" />}
                </MenuButton>
                <MenuList>
                  {item.children?.map((subitem) => (
                    <Link key={subitem.href} href={subitem.href!} passHref>
                      <MenuItem
                        as="a"
                        css={selectedItem === subitem && styles.selected}
                      >
                        {subitem.name}
                      </MenuItem>
                    </Link>
                  ))}
                </MenuList>
              </ChakraMenu>
            ) : (
              <Link href={item.href!} passHref>
                <a css={selectedItem && styles.selected} key={item.name}>
                  {item.name}
                </a>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};

const styles = Object.freeze({
  root: css`
    background: var(--primary-color) !important;
    color: var(--text-color);
    z-index: 4;
    width: 100%;
    position: sticky;
  `,
  topItems: css`
    display: flex;
    width: 100%;
    justify-content: space-between;

    > div {
      margin: 1rem;
      // Safari has wrong calculations for how they
      // define the space for text, which forces the
      // phone number to wrap here, this fixes that
      word-break: keep-all;
    }
  `,
  socialLink: css`
    margin: 0.25rem;
  `,

  logoContainer: css`
    display: flex;
    width: 100%;
    justify-content: center;

    > button {
      margin: 0.5rem;
    }
  `,

  menuItems: css`
    display: flex;
    width: 100%;
    max-width: 100%;
    flex-wrap: wrap;
    ${styleUtils.mobile(
      css`
        flex-direction: column;
      `
    )}
    li {
      list-style-type: none;
    }
  `,

  menuButton: css`
    & + * {
      z-index: 4 !important;
    }
  `,

  selected: css`
    font-weight: bold !important;
  `,

  rootMenuItem: css`
    &,
    button,
    a {
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-size: 0.95em;
      font-weight: 500;
      text-align: center;
    }

    margin: 1rem;
    ${styleUtils.mobile(
      css`
        margin: 0.5rem;
      `
    )}

    flex-grow: 1;
    white-space: nowrap;

    ${styleUtils.desktop(
      css`
        &:first-child {
          margin-left: 0;
        }

        &:last-child {
          margin-right: 0;
        }
      `
    )}
  `,

  stickyRoot: css`
    z-index: 4;
    position: sticky;
    top: 0;
  `,

  // adds a "sliding door" shadow when the header goes sticky
  shadowRoot: css`
    background: var(--primary-color);
    position: sticky;
    height: 1px;
    margin-top: -1px;
    z-index: 1;
    top: 0;
    box-shadow: 5px calc(1.4em + 1.9rem) 20px 5px
      rgba(${keyword.rgb("black").join(",")}, 0.5);
    width: 100%;
  `,

  mobileMenuContainer: css`
    display: flex;
    width: 100%;
    & > :last-child {
      flex-grow: 1;
      height: 52px;
      margin-top: 2px;
      width: 52px;
    }
  `,
  mobileImageContainer: css`
    flex-grow: 1;
    display: flex;
    justify-content: space-around;
    img {
      height: 52px;
    }
  `,
  mobileMenu: css`
    margin: 0.5rem 0;
    border-color: var(--text-color) !important;
    background-color: transparent !important;
  `,

  hiddenMenuContainer: css`
    position: absolute;
    display: flex;
    align-items: center;
    height: 100vh;
    top: 0;
    width: 100%;
    background: var(--primary-color);
  `,
});

export default MainMenu;
