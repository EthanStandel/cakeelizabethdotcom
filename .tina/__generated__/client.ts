import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '2a00cba056e51a5328a05967a04143df668e2d50', queries });
export default client;
  