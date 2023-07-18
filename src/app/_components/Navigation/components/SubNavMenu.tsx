import { usePathname } from "next/navigation";
import { usePresence } from "../../../../utils/usePresence";
import Link from "next/link";
import { useEffect, useState } from "react";
import ChevronDown from "./FaChevronDown.svg";
import { e } from "easy-tailwind";
import { ContentData } from "../../../../utils/content";

export const SubNavMenu = ({
  item,
}: {
  item: ContentData<"GlobalCollection">["header"]["navigation"][number];
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
        className={e(
          isActive && "font-bold",
          "uppercase tracking-widest flex items-center gap-1"
        )}
      >
        <span>{item.label}</span>
        <ChevronDown className={e(open && "rotate-180", "transition")} />
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
  items: ContentData<"GlobalCollection">["header"]["navigation"][number]["subNavItem"];
}) => {
  const pathname = usePathname();
  const { isMounted, isVisible } = usePresence(open);

  if (!isMounted) return null;

  return (
    <div
      className={e(
        "absolute top-full left-1/2 -translate-x-1/2 translate-y-4 bg-white shadow border-[1px] rounded flex flex-col whitespace-nowrap overflow-hidden transition z-10 text-text",
        !isVisible && "opacity-0 -translate-y-1/4 scale-75"
      )}
    >
      {items.map((item) => {
        const isSelected = pathname.startsWith(item.url);
        return (
          <Link
            href={item.url}
            key={item.label}
            className={e(
              "uppercase transition-colors tracking-widest py-2 font-medium px-4",
              {
                desktop: "py-3",
                focus: "bg-gray-100 outline-none",
                hover: "bg-gray-100",
                active: "bg-gray-200",
              },
              isSelected && "!font-bold"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};
