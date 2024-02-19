import { crawl } from "~/lib/crawler";
import * as httpClient from "~/lib/http-client";
import { CrawlResult } from "~/types";

const fetchDataSpy = jest.spyOn(httpClient, "fetchData");

const crawlTestData: { url: string; content: string; expected: CrawlResult }[] =
  [
    {
      url: "https://www.google.com",
      content: "",
      expected: {
        title: "Google",
        description: "Something about Google",
        links: [],
      },
    },

    {
      url: "https://medium.com",
      content: "",
      expected: {
        title: "Medium",
        description: "Something about Medium",
        links: [],
      },
    },

    {
      url: "https://www.reddit.com",
      content: "",
      expected: {
        title: "Reddit",
        description: "Something about Reddit",
        links: [],
      },
    },
  ];

describe("\n **crawler", () => {
  describe("-> crawl", () => {
    it("should return the expected data for the url passed to it", async () => {
      for (const testData of crawlTestData) {
        fetchDataSpy.mockResolvedValue(testData.content);
        const data = await crawl(testData.url);

        expect(fetchDataSpy).toHaveBeenCalled();
        expect(data).toEqual(testData.expected);
      }
    });
  });
});
