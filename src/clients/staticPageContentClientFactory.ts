import fs from "fs";

const staticPageContentClientFactory = (pageName: string) => ({
  getContent: async <T>(file = "content.json"): Promise<T> => {
    const content: string = await new Promise((resolve, reject) =>
      // strictly use fs to fetch all build-time resources
      fs.readFile(
        `./public/resources/pages/${pageName}/${file}`,
        { encoding: "utf-8" },
        (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        }
      )
    );

    return file.endsWith(".json") ? JSON.parse(content) : content;
  },
});

export default staticPageContentClientFactory;
