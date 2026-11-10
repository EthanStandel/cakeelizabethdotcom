import { Accessor, createEffect, createSignal, on, onCleanup } from "solid-js";
import {
  BeforeLeaveEventArgs,
  useBeforeLeave,
  useIsRouting,
} from "@solidjs/router";

const isInWindow = (element: HTMLElement) => {
  const bounds = element.getBoundingClientRect();
  return bounds.bottom > 0 && bounds.top < window.innerHeight;
};

// A Back or Forward navigation arrives as a history delta, after the browser has already moved the address.
const destinationPathname = (to: string | number) =>
  typeof to === "number"
    ? window.location.pathname
    : new URL(to, window.location.origin).pathname;

export const createModuleTransition = () => {
  const isRouting = useIsRouting();
  const [isOut, setIsOut] = createSignal(false);
  const [leaveOrders, setLeaveOrders] = createSignal<
    ReadonlyMap<number, number>
  >(new Map());
  const moduleIndices = new Map<HTMLElement, Accessor<number>>();
  let heldNavigation: BeforeLeaveEventArgs | undefined;

  const track = (element: HTMLElement, index: Accessor<number>) => {
    moduleIndices.set(element, index);
    onCleanup(() => moduleIndices.delete(element));
  };

  const runningTransitions = () =>
    [...moduleIndices.keys()].flatMap((element) => element.getAnimations());

  const leaveInTurn = async () => {
    const indicesInWindow = [...moduleIndices]
      .filter(([element]) => isInWindow(element))
      .map(([, index]) => index())
      .sort((first, second) => second - first);
    setLeaveOrders(
      new Map(indicesInWindow.map((index, order) => [index, order])),
    );
    setIsOut(true);
    await Promise.allSettled(
      runningTransitions().map((transition) => transition.finished),
    );
  };

  const leaveAtOnce = () => {
    heldNavigation = undefined;
    setLeaveOrders(new Map());
    setIsOut(true);
  };

  useBeforeLeave((event) => {
    if (event.defaultPrevented) return;
    if (destinationPathname(event.to) === event.from.pathname) return;
    if (typeof event.to === "number") return leaveAtOnce();
    if (isOut() && !heldNavigation) return;
    event.preventDefault();
    const isAlreadyLeaving = heldNavigation !== undefined;
    heldNavigation = event;
    if (isAlreadyLeaving) return;
    void leaveInTurn().then(() => {
      const navigation = heldNavigation;
      heldNavigation = undefined;
      navigation?.retry(true);
    });
  });

  createEffect(
    on(
      isRouting,
      (isStillRouting) => {
        if (isStillRouting || heldNavigation || !isOut()) return;
        runningTransitions().forEach((transition) => transition.finish());
        setIsOut(false);
      },
      { defer: true },
    ),
  );

  return {
    isOut,
    leaveOrder: (index: number) => leaveOrders().get(index) ?? 0,
    track,
  };
};
