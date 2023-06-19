import {
  useRef,
  useState,
  DetailedHTMLProps,
  AnchorHTMLAttributes,
  useEffect,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { usePresence } from "../../../../utils/usePresence";
import cx from "classnames";
import { useKeyboardEvent } from "@react-hookz/web";
import { useRouter } from "next/navigation";
import FaArrowRight from "./FaArrowRight.svg";
import FaArrowLeft from "./FaArrowLeft.svg";
import FaTimes from "./FaTimes.svg";
import { useLayoutEffect } from "../../../../utils/useLayoutEffect";

export const ImageCarousel = ({ images }: { images: Array<string> }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const carouselIndex = params.get("carouselIndex");
  const { isMounted, isVisible } = usePresence(!!carouselIndex);
  const parsedIndexSource = parseInt(carouselIndex) % images.length;
  const [index, setIndex] = useState(parsedIndexSource);
  useEffect(() => {
    setIndex(parsedIndexSource);
  }, [parsedIndexSource]);
  const silentlyUpdateParam = (newIndex: number, blockSmooth = false) => {
    if (blockSmooth) {
      blockSmoothUpdateRef.current = true;
    } else if (blockSmoothUpdateRef.current) {
      blockSmoothUpdateRef.current = false;
    }
    if (newIndex === index) return;
    window.history.replaceState(
      null,
      "",
      `${pathname}?carouselIndex=${newIndex}`
    );
    setIndex(newIndex);
  };

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
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (
      !scrollContainer ||
      blockSmoothUpdateRef.current ||
      isNaN(parsedIndexSource)
    )
      return;

    scrollContainer.scrollTo({
      left: scrollContainer.clientWidth * index,
      behavior: "smooth",
    });
  }, [index, parsedIndexSource]);

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
        router.replace(closePath);
      }}
      onClose={() => router.replace(closePath)}
    >
      {isMounted && (
        <div
          className={cx(
            "fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity backdrop-blur",
            { "opacity-0": !isVisible }
          )}
        >
          <ul
            ref={scrollContainerRef}
            // for the love of god, do not ask me why this needs backdrop-blur-0
            // but the native x-bar starts trying to account for the y-bar without it ¯\_(ツ)_/¯
            className="flex overflow-x-auto snap-x snap-mandatory backdrop-blur-0 h-full"
            onScroll={() => {
              const scrollContainer = scrollContainerRef.current;
              const scrollIndex = Math.round(
                scrollContainer.scrollLeft / scrollContainer.clientWidth
              );
              if (!scrollContainer || index === scrollIndex) return;
              silentlyUpdateParam(scrollIndex, true);
            }}
          >
            {images.map((image, index) => (
              <li
                key={index}
                className="snap-start snap-always w-full h-full flex justify-center items-center flex-shrink-0"
                onClick={() => router.push(closePath)}
              >
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  aria-hidden
                  onClick={(e) => e.stopPropagation()}
                  className={cx(
                    "rounded transition-transform max-h-full max-w-[calc(100%-1rem)] desktop:max-h-[calc(100%-11rem)] desktop:max-w-[calc(100%-11rem)]",
                    {
                      "scale-50": !isVisible,
                    }
                  )}
                />
              </li>
            ))}
          </ul>
          <div>
            <ControlButton
              className="fixed left-4 top-1/2 -translate-y-1/2"
              href={prevPath}
              onClick={() => silentlyUpdateParam(prevIndex)}
              eventKey="ArrowLeft"
              aria-label="Previous image"
            >
              <FaArrowLeft aria-hidden />
            </ControlButton>
            <ControlButton
              className="fixed right-4 top-1/2 -translate-y-1/2"
              href={nextPath}
              onClick={() => silentlyUpdateParam(nextIndex)}
              eventKey="ArrowRight"
              aria-label="Next image"
            >
              <FaArrowRight aria-hidden />
            </ControlButton>
            <ControlButton
              className="fixed right-4 top-4"
              href={closePath}
              onClick={() => router.push(closePath)}
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
  onClick,
  className,
  ...props
}: {
  eventKey: "Escape" | "ArrowLeft" | "ArrowRight";
  href: string;
  onClick: () => void;
} & DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) => {
  useKeyboardEvent("keydown", (event) => {
    if (event.key === eventKey) {
      onClick();
    }
  });

  return (
    <a
      className={cx(
        className,
        "z-50 bg-primary text-text w-14 h-14 rounded-full border-[1px] border-primary flex justify-center items-center opacity-75 desktop:opacity-100 hover:border-white focus-visible:border-white !shadow-primary hover:shadow-even focus-visible:shadow-even transition-all active:!shadow-none focus:outline-none"
      )}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      {...props}
    />
  );
};
