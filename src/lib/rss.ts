import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  title: string;
  link: string;
  description: string;
  items: RSSItem[];
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
    },
  });

  const xmlText = await response.text();

  const parser = new XMLParser({ processEntities: false });
  const parsed = parser.parse(xmlText);

  if (!parsed.rss?.channel) {
    throw new Error("Invalid RSS feed: missing channel field");
  }

  const channel = parsed.rss.channel;

  if (!channel.title || !channel.link || !channel.description) {
    throw new Error("Invalid RSS feed: missing required channel fields");
  }

  const title = channel.title;
  const link = channel.link;
  const description = channel.description;

  let itemsArray: any[] = [];
  if (channel.item) {
    itemsArray = Array.isArray(channel.item) ? channel.item : [channel.item];
  }

  const items: RSSItem[] = [];
  for (const item of itemsArray) {
    if (!item.title || !item.link || !item.description || !item.pubDate) {
      continue;
    }
    items.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });
  }

  return {
    title,
    link,
    description,
    items,
  };
}
