// Given a url, try and parse it's robots.txt file
import { fetchData } from "./http-client";
import { getStrAfter } from "./utils";

export const parseRobotsTxt = async (inputUrl: string) => {
  const wUrl = new URL(inputUrl);
  const url = `${wUrl.protocol}//${wUrl.host}/robots.txt`;
  console.log(url);
  const data = await fetchData({
    inputUrl: url,
    maxAttempts: 3,
    timeout: 10000,
    retryDelay: 2000,
  });

  let userAgent = "*";
  let requestRate = 0;
  let disallowed: string[] = [];
  let allowed: string[] = [];
  let crawlDelay = 0;
  let visitTime = { start: 0, end: 2359 };
  let siteMap = "";

  if (data) {
    for (const line of data.split("\n")) {
      if (line.match(/^Sitemap:.*$/i)) siteMap = getStrAfter(line, ":").trim();

      if (line.match(/^User-agent:.*$/i))
        userAgent = getStrAfter(line, ":").trim();
      if (userAgent !== "*") continue;

      if (line.match(/^Disallow:.*$/i))
        disallowed.push(getStrAfter(line, ":").trim());
      if (line.match(/^Allow:.*$/i))
        allowed.push(getStrAfter(line, ":").trim());
      if (line.match(/^Crawl-delay:.*$/i))
        crawlDelay = Number(getStrAfter(line, ":").trim()) || 0;

      if (line.match(/^Request-rate:.*$/i)) {
        const str = getStrAfter(line, ":").trim();
        requestRate =
          Number(str.split("/")[0]) / Number(str.split("/")[1]) || 0;
      }

      if (line.match(/^Visit-time:.*$/)) {
        const str = getStrAfter(line, ":").trim();
        visitTime.start = Number(str.split("-")[0]) || visitTime.start;
        visitTime.end = Number(str.split("-")[1]) || visitTime.end;
      }
    }
  }

  return {
    requestRate,
    disallowed,
    allowed,
    crawlDelay,
    visitTime,
    siteMap,
  };
};
