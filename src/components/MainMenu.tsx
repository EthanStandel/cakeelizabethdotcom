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
import Link from "next/link";
import { useRouter } from "next/router";
import { IconType } from "react-icons";
import { FaFacebookSquare, FaInstagramSquare } from "react-icons/fa";

import useIsMobileView from "../hooks/useIsMobileView";
import { Menu } from "../models/Menu";
import classes from "../styles/components/MainMenu.module.sass";
import appClasses from "../styles/pages/app.module.sass";

export interface Props {
  structure: Menu;
}

const socialIcons = {
  facebook: FaFacebookSquare,
  instagram: FaInstagramSquare,
} as Record<string, IconType>;

const MainMenu = ({ structure }: Props) => {
  const isMobileView = useIsMobileView();
  return (
    <>
      <div className={classes.shadowRoot} />
      <div className={classes.root}>
        <div className={appClasses.contentContainer}>
          <div className={classes.topItems}>
            <div>
              <a href={`tel:${structure.phone}`}>{structure.phone}</a>
            </div>
            <div>
              {structure.social.map((social) => (
                <a
                  className={classes.socialLink}
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
          {!isMobileView && (
            <div className={classes.logoContainer}>
              <Link href={structure.href!}>
                <a className={classes.logo}>
                  <img alt={structure.name} src={structure.logo} />
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
      {isMobileView ? (
        <MobileStickyMenu structure={structure} />
      ) : (
        <div className={classes.stickyRoot}>
          <div className={classes.root}>
            <div className={appClasses.contentContainer}>
              <MenuItems structure={structure} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const MobileStickyMenu = ({ structure }: Props) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const closeMenu = () => setOpen(false);
    router.events.on("routeChangeStart", closeMenu);
    return () => router.events.off("routeChangeStart", closeMenu);
  }, [router]);

  return (
    <div className={classes.stickyRoot}>
      <div className={classes.root}>
        <div className={appClasses.contentContainer}>
          <div className={classes.mobileMenuContainer}>
            <IconButton
              className={classes.mobileMenu}
              variant="outline"
              aria-label="Menu"
              icon={open ? <CloseIcon /> : <HamburgerIcon />}
              onClick={() => setOpen(!open)}
            />
            <div className={classes.mobileImageContainer}>
              <Link href={structure.href!}>
                <a className={classes.logo}>
                  <img
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
      </div>
      <XyzTransition xyz="up-100%">
        {open && (
          <div className={classes.hiddenMenuContainer}>
            <MenuItems structure={structure} />
          </div>
        )}
      </XyzTransition>
    </div>
  );
};

const MenuItems = ({ structure }: Props) => {
  const { asPath } = useRouter();
  const isMobileView = useIsMobileView();
  return (
    <ul className={classes.menuItems}>
      {structure.children?.map((item) => {
        const selectedItem =
          item.href === asPath ||
          item.children?.find((subitem) => subitem.href === asPath);
        return (
          <li className={classes.rootMenuItem} key={item.name}>
            {item.children ? (
              <ChakraMenu placement={isMobileView ? "bottom" : undefined}>
                <MenuButton
                  as="button"
                  className={`${selectedItem ? classes.selected : ""} ${
                    classes.menuButton
                  }`}
                >
                  {item.name}
                  {item.children && <ChevronDownIcon h="1.5em" w="1.5em" />}
                </MenuButton>
                <MenuList className={classes.menuList}>
                  {item.children?.map((subitem) => (
                    <Link key={subitem.href} href={subitem.href!} passHref>
                      <MenuItem
                        as="a"
                        className={
                          selectedItem === subitem ? classes.selected : ""
                        }
                      >
                        {subitem.name}
                      </MenuItem>
                    </Link>
                  ))}
                </MenuList>
              </ChakraMenu>
            ) : (
              <Link href={item.href!}>
                <a
                  className={selectedItem ? classes.selected : ""}
                  key={item.name}
                >
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

export default MainMenu;
