import { crawl } from "~/lib/crawler";
import * as httpClient from "~/lib/http-client";
import { CrawlResult } from "~/types";

const fetchDataSpy = jest.spyOn(httpClient, "fetchData");

const crawlTestData: { url: string; content: string; expected: CrawlResult }[] =
  [
    {
      url: "https://www.google.com",
      content: `
        <html>
            <head>
                <title>Google</title>
                <meta name="description" content="Google Search">
            </head>
        </html>
      `,
      expected: {
        title: "Google",
        description: "Google Search",
        links: [],
      },
    },

    {
      url: "https://medium.com",
      content: `
        <html>
            <head>
                <title>Medium</title>
                <meta name="twitter:description" content="The home of articles">
            </head>
        </html>
      `,
      expected: {
        title: "Medium",
        description: "The home of articles",
        links: [],
      },
    },

    {
      url: "https://www.reddit.com",
      content: `
        <html>
            <head>
                <title>Reddit</title>
                <meta name="description" content="You reddit here">
                <meta name="facebook:description" content="You reddit here first">
            </head>
        </html>
      `,
      expected: {
        title: "Reddit",
        description: "You reddit here",
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
