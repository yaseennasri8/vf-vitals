import * as cheerio from "cheerio";
import axios from "axios";

const invalidUrls: { [key: string]: any } = {};
const seenUrls: { [key: string]: any } = {};
let links: any[];

const crawl = async (url: string) => {
  if (seenUrls[url]) return;
  console.log("crawling", url);
  seenUrls[url] = true;

  const urlObject = new URL(url);

  const host = urlObject.hostname;
  let response: any;
  try {
    response = await axios(url);
  } catch (error) {
    invalidUrls[url] = true;
  }
  if (response) {
    const html = await response.data;
    const $ = cheerio.load(html);
    links = $("a")
      .map((i, link) => link.attribs.href)
      .get();

    links = links.filter((link) => link.includes(host));
  }
  return links;
};

export default crawl;
