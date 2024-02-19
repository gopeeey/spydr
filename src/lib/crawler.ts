import { load } from "cheerio";
import { CrawlResult } from "~/types";
import { fetchData } from "./http-client";

export const crawl = async (url: string) => {
  const data = await fetchData({
    inputUrl: url,
    maxAttempts: 3,
    timeout: 5000,
    retryDelay: 1000,
  });

  if (!data) return null;

  const doc = load(data);
  const title = doc("title").text();
  const description = doc("meta[name*=description]").attr("content");

  const result: CrawlResult = {
    title,
    description: description || "",
    links: [],
  };

  return result;
};
