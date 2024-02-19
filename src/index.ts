import { crawl } from "./lib/crawler";

async function main() {
  const data = await crawl(
    "https://brightdata.com/blog/how-tos/robots-txt-for-web-scraping-guide"
  );
  console.log(data);
}

main().catch((e) => console.error(e));
