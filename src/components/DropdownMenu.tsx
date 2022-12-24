import { useEffect, useRef } from "react";

import { styled, css } from "@stitches/react";
import Link from "next/link";
import { CSSTransition } from "react-transition-group";

import { MenuItem } from "src/models/Menu";

export const DropdownMenu = ({
  items,
  open,
  onClose,
  selectedItem,
}: {
  open: boolean;
  onClose: () => void;
  items: Array<{ name: string; href: string }>;
  selectedItem?: MenuItem;
}) => {
  const rootRef = useRef(null);
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        document.addEventListener("click", onClose, { once: true });
      }, 0);
    }
  }, [open]);

  return (
    <CSSTransition
      timeout={200}
      in={open}
      nodeRef={rootRef}
      classNames="dropdown"
      unmountOnExit
    >
      <div className={styles.transitionalRoot()} ref={rootRef}>
        <styles.DropdownMenu>
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                style={{
                  fontWeight: item === selectedItem ? "bold" : "initial",
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </styles.DropdownMenu>
      </div>
    </CSSTransition>
  );
};

const styles = Object.freeze({
  transitionalRoot: css({
    "&.dropdown-enter": {
      opacity: 0,
      transform: "scale(.6)",
    },
    "&.dropdown-enter-active": {
      opacity: 1,
      transform: "none",
      transition: "opacity .2s ease, transform .2s ease",
    },
    "&.dropdown-exit": {
      opacity: 1,
      transform: "none",
    },
    "&.dropdown-exit-active": {
      transition: "opacity .2s ease, transform .2s ease",
      transform: "scale(.6)",
      opacity: 0,
    },
  }),
  DropdownMenu: styled("ul", {
    zIndex: 100,
    background: "white",
    position: "absolute",
    top: "calc(100% + .5em)",
    left: "50%",
    transform: "translateX(-50%)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--card-border-radius)",
    overflow: "hidden",
    "> li": {
      height: "3em",
      display: "flex",
      justifyContent: "center",
      "> a": {
        paddingLeft: "1em",
        paddingRight: "1em",
        width: "100%",
        lineHeight: "3em",
        transition: "background 0.2s ease",

        "&:hover, &:focus": {
          background: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  }),
});
