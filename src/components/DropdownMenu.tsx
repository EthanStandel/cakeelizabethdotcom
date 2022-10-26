import { useEffect } from "react";

import { styled } from "@stitches/react";
import Link from "next/link";

import { MenuItem } from "src/models/Menu";

import { AnimatePresence } from "./AnimatePresence";

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
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        document.addEventListener("click", onClose, { once: true });
      }, 0);
    }
  }, [open]);

  return (
    <AnimatePresence show={open}>
      <styles.DropdownMenu>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>
              <a
                onClick={onClose}
                style={{
                  fontWeight: item === selectedItem ? "bold" : "initial",
                }}
              >
                {item.name}
              </a>
            </Link>
          </li>
        ))}
      </styles.DropdownMenu>
    </AnimatePresence>
  );
};

const styles = Object.freeze({
  DropdownMenu: styled("ul", {
    zIndex: 100,
    background: "white",
    position: "absolute",
    top: "calc(100% + .5em)",
    left: "50%",
    transform: "translateX(-50%)",
    border: "1px solid var(--border-color)",
    borderRadius: "1.5em",
    paddingTop: "1.5em",
    paddingBottom: "1.5em",
    "> li": {
      height: "3em",
      display: "flex",
      justifyContent: "center",
      "> a": {
        paddingLeft: "1em",
        paddingRight: "1em",
        width: "100%",
        lineHeight: "3em",

        "&:hover, &:focus": {
          background: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  }),
});
