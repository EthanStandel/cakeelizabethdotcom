import { Component, createEffect, createUniqueId, onCleanup } from "solid-js";
import { cx } from "cva";
import { ConstantsShape } from "~/models";
import { Logo } from "~/components/Logo";
import { CmsSourceContextProvider } from "~/lib/cms/CmsPathContext";
import { createBreakpoint } from "~/lib/utils/createBreakpoint";
import { useNavigation } from "~/primitives/NavigationContext";
import { createPartiallyStickyHeader } from "./createPartiallyStickyHeader";
import { HeaderBackground } from "./HeaderBackground";
import { MenuToggleButton } from "./MenuToggleButton";
import { NavigationLinks } from "./NavigationLinks";

export const Header: Component<{
  isMenuOpen: boolean;
  onMenuOpenChange: (isMenuOpen: boolean) => void;
}> = (props) => {
  const navigation = useNavigation();
  const navigationId = createUniqueId();
  const isMobileView = createBreakpoint.IsMobileView();
  const stickyHeader = createPartiallyStickyHeader();

  const closeMenu = () => props.onMenuOpenChange(false);

  const toggleMenu = () => {
    if (!props.isMenuOpen) stickyHeader.reveal();
    props.onMenuOpenChange(!props.isMenuOpen);
  };

  createEffect(() => {
    if (!isMobileView()) closeMenu();
  });

  createEffect(() => {
    if (!props.isMenuOpen) return;
    const listeners = new AbortController();
    window.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") closeMenu();
      },
      { signal: listeners.signal },
    );
    document.documentElement.style.overflow = "hidden";
    onCleanup(() => {
      listeners.abort();
      document.documentElement.style.overflow = "";
    });
  });

  return (
    <>
      <div class="h-header" />
      <div
        ref={stickyHeader.setTrack}
        class={cx(
          "pointer-events-none absolute inset-x-0 top-0 z-40 h-[calc(var(--spacing-header)+var(--header-anchor))]",
          stickyHeader.isSettling() && "transition-[height]",
        )}
        style={{ "--header-anchor": `${stickyHeader.anchor()}px` }}
      >
        <header
          ref={stickyHeader.setHeader}
          class="pointer-events-auto sticky top-0 h-header"
          style={{
            "--navigation-link-count": navigation()?.links?.length ?? 0,
          }}
          onFocusIn={stickyHeader.reveal}
        >
          <HeaderBackground isExpanded={props.isMenuOpen} />
          <div class="content-container flex h-full items-center justify-between gap-8">
            <CmsSourceContextProvider
              collection={ConstantsShape.name}
              slug="main"
            >
              <Logo onClick={closeMenu} />
            </CmsSourceContextProvider>
            <MenuToggleButton
              isOpen={props.isMenuOpen}
              controls={navigationId}
              class="-mr-3 @dsk:hidden"
              onToggle={toggleMenu}
            />
            <NavigationLinks
              id={navigationId}
              class={cx(
                "@max-dsk:absolute @max-dsk:inset-x-0 @max-dsk:top-full @max-dsk:overflow-y-auto @max-dsk:overscroll-contain @max-dsk:transition-[height,display] @max-dsk:transition-discrete @max-dsk:duration-(--menu-transition-duration)",
                props.isMenuOpen
                  ? "@max-dsk:h-[calc(100dvh-var(--spacing-header))] @max-dsk:starting:h-0"
                  : "@max-dsk:hidden @max-dsk:h-0",
              )}
              listClass="@max-dsk:flex-col @max-dsk:items-center @max-dsk:py-10"
              itemClass={cx(
                "@max-dsk:transition-[opacity,translate] @max-dsk:duration-(--navigation-link-fade) @max-dsk:ease-in-out",
                props.isMenuOpen
                  ? "@max-dsk:delay-[calc(var(--navigation-link-index)*var(--navigation-link-stagger))] @max-dsk:starting:-translate-y-3 @max-dsk:starting:opacity-0"
                  : "@max-dsk:-translate-y-3 @max-dsk:opacity-0 @max-dsk:delay-[calc((var(--navigation-link-count)-1-var(--navigation-link-index))*var(--navigation-link-stagger))]",
              )}
              onLinkClick={closeMenu}
            />
          </div>
        </header>
      </div>
    </>
  );
};
