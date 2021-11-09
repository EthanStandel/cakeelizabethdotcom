import axios from "axios";

import environment from "../environment";

// Used when the Node-context needs to make requests to "/"
const client = axios.create({ baseURL: environment.serviceAddress });

const staticPageContentClientFactory = (pageName: string) => ({
  getContent: async <T>(file = "content.json"): Promise<T> =>
    (
      await client.get(`/resources/pages/${pageName}/${file}`, {
        responseType: file.endsWith(".json") ? "json" : "text",
      })
    ).data,
});

export default staticPageContentClientFactory;
