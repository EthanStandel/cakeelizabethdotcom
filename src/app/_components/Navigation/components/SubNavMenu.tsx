import { GlobalQuery } from "../../../../../.tina/__generated__/types";
import { usePathname } from "next/navigation";
import cx from "classnames";
import { usePresence } from "../../../../utils/usePresence";
import Link from "next/link";
import { useEffect, useState } from "react";
import ChevronDown from "./FaChevronDown.svg";

export const SubNavMenu = ({
  item,
}: {
  item: GlobalQuery["global"]["header"]["navigation"][number];
}) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      const close = () => setOpen(false);
      document.addEventListener("click", close, { once: true });
      return () => document.removeEventListener("click", close);
    }
  }, [open]);

  const isActive = item.subNavItem.some((subItem) =>
    pathname.startsWith(subItem.url)
  );

  return (
    <div className="relative flex justify-center">
      <button
        onClick={() => setOpen(true)}
        className={cx(
          { "font-bold": isActive },
          "uppercase tracking-widest flex items-center gap-1"
        )}
      >
        <span>{item.label}</span>
        <ChevronDown className={cx({ "rotate-180": open }, "transition")} />
      </button>
      <SubNavMenuPopout open={open} items={item.subNavItem} />
    </div>
  );
};

const SubNavMenuPopout = ({
  open,
  items,
}: {
  open: boolean;
  items: GlobalQuery["global"]["header"]["navigation"][number]["subNavItem"];
}) => {
  const pathname = usePathname();
  const { isMounted, isVisible } = usePresence(open);

  if (!isMounted) return null;

  return (
    <div
      className={cx(
        "absolute top-full left-1/2 -translate-x-1/2 translate-y-4 bg-white shadow border-[1px] rounded flex flex-col whitespace-nowrap overflow-hidden transition z-10 text-text",
        { "opacity-0 -translate-y-1/4 scale-75": !isVisible }
      )}
    >
      {items.map((item) => (
        <Link
          href={item.url}
          key={item.label}
          className={cx(
            "uppercase transition-colors tracking-widest py-2 desktop:py-3 hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-200 px-4 focus:outline-none",
            pathname.startsWith(item.url) ? "font-bold" : "font-medium"
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};
