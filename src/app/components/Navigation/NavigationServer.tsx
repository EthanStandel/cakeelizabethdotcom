import { client } from "../../../../.tina/__generated__/client";
import { asyncComponent } from "../../../utils/asyncComponent";
import { NavigationClient } from "./NavigationClient";

export const NavigationServer = asyncComponent(async () => {
  const { data, query, variables } = await client.queries.global({
    relativePath: "global.json",
  });

  return (
    <>
      <div
        className="bg-primary sticky top-[1px] translate-y-[1px] z-10 w-full h-[1px] -mt-[2px]"
        style={{
          boxShadow: "5px 60px 20px 5px rgba(0,0,0, 0.5)",
        }}
      />
      <NavigationClient query={{ data, query, variables }} />
    </>
  );
});
