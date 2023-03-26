import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { usePresence } from "../../../../utils/usePresence";
import cx from "classnames";
import { useKeyboardEvent } from "@react-hookz/web";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PropsOf } from "../../../../utils/PropsOf";
import FaArrowRight from "./FaArrowRight.svg";
import FaArrowLeft from "./FaArrowLeft.svg";
import FaTimes from "./FaTimes.svg";

export const ImageCarousel = ({ images }: { images: Array<string> }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const carouselIndex = params.get("carouselIndex");
  const { isMounted, isVisible } = usePresence(!!carouselIndex);
  const parsedIndex = parseInt(carouselIndex) % images.length;
  const nextPath = `${pathname}?carouselIndex=${
    parsedIndex + 1 >= images.length ? 0 : parsedIndex + 1
  }`;
  const prevPath = `${pathname}?carouselIndex=${
    parsedIndex - 1 < 0 ? images.length - 1 : parsedIndex - 1
  }`;
  const closePath = pathname;
  const previousParsedIndexRef = useRef(NaN);

  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || isNaN(parsedIndex)) {
      previousParsedIndexRef.current = parsedIndex;
      return;
    }

    scrollContainer.scrollTo({
      left: scrollContainer.clientWidth * parsedIndex,
      behavior:
        previousParsedIndexRef.current !== parsedIndex ? "smooth" : "auto",
    });
    previousParsedIndexRef.current = parsedIndex;
  }, [parsedIndex, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cx(
        "fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity backdrop-blur",
        { "opacity-0": !isVisible }
      )}
    >
      <div
        ref={scrollContainerRef}
        // for the love of god, do not ask me why this needs backdrop-blur-0
        // but the native x-bar starts trying to account for the y-bar without it ¯\_(ツ)_/¯
        className="grid grid-flow-col overflow-x-auto snap-x snap-mandatory backdrop-blur-0 h-full"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="snap-start snap-always w-screen h-full flex justify-center items-center"
            onClick={() => router.push(closePath)}
          >
            <img
              src={image}
              alt=""
              loading="lazy"
              aria-hidden
              onClick={(e) => e.stopPropagation()}
              className={cx(
                "rounded transition-transform max-h-[95vh] max-w-[95vw]",
                {
                  "scale-50": !isVisible,
                }
              )}
            />
          </div>
        ))}
      </div>
      <div>
        <ControlButton
          className="fixed left-4 top-1/2 -translate-y-1/2"
          href={prevPath}
          eventKey="ArrowLeft"
          aria-label="Previous image"
        >
          <FaArrowLeft aria-hidden />
        </ControlButton>
        <ControlButton
          className="fixed right-4 top-1/2 -translate-y-1/2"
          href={nextPath}
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
  );
};

const ControlButton = ({
  eventKey,
  href,
  className,
  ...props
}: { eventKey: "Escape" | "ArrowLeft" | "ArrowRight"; href: string } & PropsOf<
  typeof Link
>) => {
  const router = useRouter();

  useKeyboardEvent("keydown", (event) => {
    if (event.key === eventKey) {
      router.replace(href);
    }
  });

  return (
    <Link
      shallow
      className={cx(
        className,
        "z-50 bg-primary text-text w-14 h-14 rounded-full border-[1px] border-primary flex justify-center items-center opacity-75 desktop:opacity-100 hover:border-white focus-visible:border-white !shadow-primary hover:shadow-even focus-visible:shadow-even transition-all active:!shadow-none focus:outline-none"
      )}
      replace
      href={href}
      {...props}
    />
  );
};
