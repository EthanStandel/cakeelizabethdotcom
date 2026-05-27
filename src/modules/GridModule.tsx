import { Component, For } from "solid-js";
import { GridModuleType } from "~/models/modules/GridModule.shape";
import { ModuleRegistry } from "./ModuleRegistry";

export const GridModule: Component<{ shape: GridModuleType }> = (props) => (
  <section class="page-container group/grid-container mt-10 @dsk:mt-12">
    <div
      class="@dsk:grid flex flex-col content-container *:@dsk:not-first:border-l *:not-first:border-border *:@dsk:py-12 *:not-last:@dsk:pr-10 *:not-first:@dsk:pl-10"
      style={{
        "grid-template-columns": props.shape?.items
          ?.map((item) => `${item.antecedent}fr`)
          .join(" "),
      }}
    >
      <For each={props.shape?.items}>
        {(item) => <ModuleRegistry module={item.type} shape={item} />}
      </For>
    </div>
  </section>
);
