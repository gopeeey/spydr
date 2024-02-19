import * as httpClient from "@lib/http-client";
import { parseRobotsTxt } from "~/lib";

const fetchDataSpy = jest.spyOn(httpClient, "fetchData");

const txtData = `
# allow TwitterBot to crawl lp
User-agent: Twitterbot

Allow: /lp
Allow: /de-de/lp
Allow: /en-au/lp
Allow: /en-ca/lp
Allow: /en-gb/lp

User-agent: *

# pages testing
Disallow: pages.www.myflare.com/
Disallow: en-us.www.myflare.com/
Disallow: de-de.www.myflare.com/
Disallow: ja-jp.www.myflare.com/

# lp
Disallow: /lp
Disallow: /de-de/lp
Disallow: /en-au/lp
Disallow: /en-ca/lp

# feedback
Disallow: /feedback
Disallow: /de-de/feedback
Disallow: /en-au/feedback
Disallow: /en-ca/feedback

Crawl-delay: 5
Request-rate: 1/10
Visit-time: 0200-1230

Sitemap: https://www.myflare.com/sitemap.xml
`;
const testUrl = "https://www.myflare.com/lp";

describe("\n **robots-txt-parser", () => {
  describe("-> parseRobotsTxt", () => {
    it("should call fetchData with the appropriate url", async () => {
      fetchDataSpy.mockResolvedValue(txtData);
      await parseRobotsTxt(testUrl);

      expect(fetchDataSpy).toHaveBeenCalledWith({
        inputUrl: "https://www.myflare.com/robots.txt",
        maxAttempts: 3,
        timeout: 10000,
        retryDelay: 2000,
      });
    });

    describe("given the url has a robots.txt file", () => {
      it("should return the expected robots.txt data", async () => {
        fetchDataSpy.mockResolvedValue(txtData);
        const data = await parseRobotsTxt(testUrl);

        expect(data).toEqual({
          requestRate: 0.1,
          disallowed: [
            "pages.www.myflare.com/",
            "en-us.www.myflare.com/",
            "de-de.www.myflare.com/",
            "ja-jp.www.myflare.com/",
            "/lp",
            "/de-de/lp",
            "/en-au/lp",
            "/en-ca/lp",
            "/feedback",
            "/de-de/feedback",
            "/en-au/feedback",
            "/en-ca/feedback",
          ],
          allowed: [],
          crawlDelay: 5,
          visitTime: {
            start: 200,
            end: 1230,
          },
          siteMap: "https://www.myflare.com/sitemap.xml",
        });
      });
    });

    describe("given the url does not have a robots.txt file", () => {
      it("should return the default robots.txt data", async () => {
        fetchDataSpy.mockResolvedValue(null);
        const data = await parseRobotsTxt(testUrl);

        expect(data).toEqual({
          requestRate: 0,
          disallowed: [],
          allowed: [],
          crawlDelay: 0,
          visitTime: { start: 0, end: 2359 },
          siteMap: "",
        });
      });
    });
  });
});
