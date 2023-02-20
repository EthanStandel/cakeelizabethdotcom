import { client } from "../../../../.tina/__generated__/client";
import { asyncComponent } from "../../../utils/asyncComponent";
import { NavigationClient } from "./NavigationClient";

export const NavigationServer = asyncComponent(async () => {
  const { data, query, variables } = await client.queries.global({
    relativePath: "global.json",
  });

  return <NavigationClient query={{ data, query, variables }} />;
});
