import { useRef, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { usePresence } from "../../../../utils/usePresence";
import { useKeyboardEvent } from "@react-hookz/web";
import { useRouter } from "next/navigation";
import FaArrowRight from "./FaArrowRight.svg";
import FaArrowLeft from "./FaArrowLeft.svg";
import FaTimes from "./FaTimes.svg";
import { useLayoutEffect } from "../../../../utils/useLayoutEffect";
import Link from "next/link";
import { PropsOf } from "../../../../utils/PropsOf";
import { e } from "easy-tailwind";
import cx from "classnames";

export const ImageCarousel = ({ images }: { images: Array<string> }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const carouselIndex = params.get("carouselIndex");
  const { isMounted, isVisible } = usePresence(!!carouselIndex);
  const index = parseInt(carouselIndex) % images.length;

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (!isMounted && dialog.open) {
        dialog.close();
      } else if (isMounted && !dialog.open) {
        dialog.showModal();
      }
    }

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && isMounted) {
      scrollContainer.scrollTo({
        left: scrollContainer.clientWidth * index,
      });
    }
  }, [isMounted]);

  const blockSmoothUpdateRef = useRef(false);
  const updateIndex = (newIndex: number, blockSmooth = false) => {
    if (blockSmooth) {
      blockSmoothUpdateRef.current = true;
    } else if (blockSmoothUpdateRef.current) {
      blockSmoothUpdateRef.current = false;
    }
    if (newIndex !== index)
      router.push(`${pathname}?carouselIndex=${newIndex}`, { scroll: false });
  };
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || blockSmoothUpdateRef.current || isNaN(index))
      return;

    scrollContainer.scrollTo({
      left: scrollContainer.clientWidth * index,
      behavior: "smooth",
    });
  }, [index]);

  const nextIndex = index + 1 >= images.length ? 0 : index + 1;
  const nextPath = `${pathname}?carouselIndex=${nextIndex}`;
  const prevIndex = index - 1 < 0 ? images.length - 1 : index - 1;
  const prevPath = `${pathname}?carouselIndex=${prevIndex}`;
  const closePath = pathname;

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:hidden bg-transparent"
      onCancel={(e) => {
        e.preventDefault();
        router.push(closePath, { scroll: false });
      }}
      onClose={() => router.push(closePath, { scroll: false })}
    >
      {isMounted && (
        <div
          className={e(
            "fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity backdrop-blur",
            !isVisible && "opacity-0"
          )}
        >
          <ul
            ref={scrollContainerRef}
            // for the love of god, do not ask me why this needs backdrop-blur-0
            // but the native x-bar starts trying to account for the y-bar without it ¯\_(ツ)_/¯
            className="flex overflow-x-auto snap-x snap-mandatory backdrop-blur-0 h-full"
            onScroll={(e) => {
              const scrollContainer = e.currentTarget;
              const scrollIndex = Math.round(
                scrollContainer.scrollLeft / scrollContainer.clientWidth
              );
              if (index === scrollIndex) return;
              updateIndex(scrollIndex, true);
            }}
          >
            {images.map((image, index) => (
              <li
                key={index}
                className="snap-start snap-always w-full h-full flex justify-center items-center flex-shrink-0"
                onClick={() => router.push(closePath, { scroll: false })}
              >
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  aria-hidden
                  // this prevents the background-click closure
                  onClick={(e) => e.stopPropagation()}
                  className={e(
                    "rounded transition-transform max-h-full max-w-[calc(100%-1rem)]",
                    {
                      desktop:
                        "max-w-[calc(100%-11rem)] max-h-[calc(100%-11rem)]",
                    },
                    !isVisible && "scale-50"
                  )}
                />
              </li>
            ))}
          </ul>
          <div>
            <ControlButton
              className="fixed left-4 top-1/2 -translate-y-1/2"
              href={prevPath}
              onClick={() => (blockSmoothUpdateRef.current = false)}
              replace
              eventKey="ArrowLeft"
              aria-label="Previous image"
            >
              <FaArrowLeft aria-hidden />
            </ControlButton>
            <ControlButton
              className="fixed right-4 top-1/2 -translate-y-1/2"
              href={nextPath}
              onClick={() => (blockSmoothUpdateRef.current = false)}
              replace
              eventKey="ArrowRight"
              aria-label="Next image"
            >
              <FaArrowRight aria-hidden />
            </ControlButton>
            <ControlButton
              className="fixed right-4 top-4"
              href={closePath}
              eventKey="Escape"
              aria-label="Close image gallary"
            >
              <FaTimes aria-hidden />
            </ControlButton>
          </div>
        </div>
      )}
    </dialog>
  );
};

const ControlButton = ({
  eventKey,
  className = "",
  ...props
}: {
  eventKey: "Escape" | "ArrowLeft" | "ArrowRight";
  href: string;
  onClick?: () => void;
} & Omit<PropsOf<typeof Link>, "href" | "onClick">) => {
  const router = useRouter();
  useKeyboardEvent(
    eventKey,
    () => {
      props.onClick?.();
      router.push(props.href, { scroll: false });
    },
    [props.href],
    { event: "keydown", target: window }
  );

  return (
    <Link
      className={cx(
        className,
        e(
          "z-50 bg-primary text-text w-14 h-14 rounded-full border-[1px] border-primary flex justify-center items-center opacity-75 !shadow-primary transition-all",
          {
            desktop: "opacity-100",
            hover: "border-white shadow-even",
            "focus-visible": "border-white shadow-even",
            focus: "outline-none",
            active: "!shadow-none",
          }
        )
      )}
      scroll={false}
      {...props}
    />
  );
};
