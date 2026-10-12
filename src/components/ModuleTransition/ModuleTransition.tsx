import { ParentComponent, createContext, useContext } from "solid-js";
import { cx } from "cva";
import { createModuleTransition } from "./createModuleTransition";

const ModuleTransitionContext =
  createContext<ReturnType<typeof createModuleTransition>>();

export const ModuleTransitionProvider: ParentComponent = (props) => (
  <ModuleTransitionContext.Provider value={createModuleTransition()}>
    {props.children}
  </ModuleTransitionContext.Provider>
);

const useModuleTransition = () => {
  const moduleTransition = useContext(ModuleTransitionContext);
  if (!moduleTransition) {
    throw new Error(
      "ModuleTransition must be used within a ModuleTransitionProvider",
    );
  }
  return moduleTransition;
};

export const ModuleTransition: ParentComponent<{ index: number }> = (props) => {
  const moduleTransition = useModuleTransition();

  return (
    <div
      ref={(element) => moduleTransition.track(element, () => props.index)}
      class={cx(
        "transition-[opacity,translate] duration-(--module-transition-fade) ease-in-out motion-reduce:transition-none",
        moduleTransition.isOut()
          ? "pointer-events-none -translate-y-3 opacity-0 delay-[calc(var(--module-leave-order)*var(--module-transition-stagger))]"
          : "delay-[calc(var(--module-index)*var(--module-transition-stagger))] starting:-translate-y-3 starting:opacity-0",
      )}
      style={{
        "--module-index": props.index,
        "--module-leave-order": moduleTransition.leaveOrder(props.index),
      }}
    >
      {props.children}
    </div>
  );
};
