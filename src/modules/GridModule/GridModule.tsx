import { Component } from "solid-js";
import { GridModuleType } from "~/models/modules/GridModule.shape";
import { ModuleRegistry } from "../ModuleRegistry";
import { ContentFor } from "~/components/ContentFor";

export const GridModule: Component<{ shape: GridModuleType }> = (props) => (
  <section class="page-container group/grid-container mt-module-dsk-gap @max-dsk:mt-module-mbl-gap">
    <div
      class="@dsk:grid flex flex-col content-container *:@dsk:not-first:border-l-2 *:not-first:border-primary *:@dsk:py-module-dsk-gap *:not-last:@dsk:pr-10 *:not-first:@dsk:pl-10 *:not-first:@max-dsk:mt-module-mbl-gap *:not-first:@max-dsk:border-t-2 *:not-first:@max-dsk:pt-module-mbl-gap"
      style={{
        "grid-template-columns": props.shape?.items
          ?.map((item) => `${item.antecedent}fr`)
          .join(" "),
      }}
    >
      <ContentFor each={props.shape} field="items">
        {(item) => <ModuleRegistry module={item.type} shape={item} />}
      </ContentFor>
    </div>
  </section>
);
