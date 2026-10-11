import { Component, createMemo, For } from "solid-js";
import { cx } from "cva";
import { FlavorCombinationsModuleType } from "~/models/modules/FlavorCombinationsModule.shape";
import { Content } from "~/components/Content";
import { ContentFor } from "~/components/ContentFor";
import { CtaList } from "~/components/CtaList";
import { useCmsFieldProps } from "~/lib/cms/CmsPathContext";

const COMBINATION_ROWS = [
  { value: "cake", label: "cakeLabel", rowClass: "row-start-1" },
  { value: "filling", label: "fillingLabel", rowClass: "row-start-2" },
  { value: "frosting", label: "frostingLabel", rowClass: "row-start-3" },
] as const;

const CARD_ROWS_SPAN = `span ${COMBINATION_ROWS.length}`;
const CARD_SPAN = `span ${COMBINATION_ROWS.length + 1}`;

export const FlavorCombinationsModule: Component<{
  shape: FlavorCombinationsModuleType;
}> = (props) => {
  const rows = COMBINATION_ROWS.map((row) => ({
    ...row,
    labelCmsProp: createMemo(useCmsFieldProps(() => row.label)),
  }));

  return (
    <section class="module-section">
      <div class="module-content">
        <Content content={props.shape} property="heading" type="string">
          {(heading, cmsProp) => <h2 {...cmsProp()}>{heading()}</h2>}
        </Content>
        <ul
          role="list"
          class="block-padding list-none grid grid-cols-4 gap-4 @max-dsk:grid-cols-1"
        >
          <ContentFor each={props.shape} field="combinations">
            {(combination) => (
              <li
                class="grid grid-rows-subgrid gap-y-0 @max-dsk:block rounded-2xl border border-border p-5"
                style={{ "grid-row": CARD_SPAN }}
              >
                <Content content={combination} property="name" type="string">
                  {(name, cmsProp) => (
                    <h3
                      class="row-start-1 flex items-center justify-center text-center border-primary border-b-2"
                      {...cmsProp()}
                    >
                      {name()}
                    </h3>
                  )}
                </Content>
                <dl
                  class="row-start-2 mt-5 grid grid-rows-subgrid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-1 text-sm @max-dsk:text-base text-secondary-foreground"
                  style={{ "grid-row-end": CARD_ROWS_SPAN }}
                >
                  <For each={rows}>
                    {(row) => (
                      <Content
                        content={combination}
                        property={row.value}
                        type="string"
                      >
                        {(value, cmsProp) => (
                          <>
                            <dt
                              class={cx(
                                "col-start-1 w-20 @max-dsk:w-24 pt-0.5 text-xs @max-dsk:text-sm uppercase tracking-widest",
                                row.rowClass,
                              )}
                              {...row.labelCmsProp()}
                            >
                              {props.shape?.[row.label]}
                            </dt>
                            <dd
                              class={cx("col-start-2", row.rowClass)}
                              {...cmsProp()}
                            >
                              {value()}
                            </dd>
                          </>
                        )}
                      </Content>
                    )}
                  </For>
                </dl>
              </li>
            )}
          </ContentFor>
        </ul>
        <CtaList each={props.shape} />
      </div>
    </section>
  );
};
