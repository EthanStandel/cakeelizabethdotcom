import axios from "axios";

import environment from "../environment";

// Used when the Node-context needs to make requests to "/"
const client = axios.create({ baseURL: environment.serviceAddress });

const contentClient = {
  get: (...args: Parameters<typeof client["get"]>) => client.get(...args),
  getContentForPage: async <T>(page: string): Promise<T> =>
    (await client.get(`/resources/pages/${page}/content.json`)).data,
  getImagesForPage: async (page: string): Promise<Array<string>> =>
    (await client.get(`/resources/pages/${page}/imageManifest.json`)).data,
};

export default contentClient;
