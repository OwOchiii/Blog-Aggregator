import { getNextFeedToFetch, markFeedFetched } from "./lib/db/queries/feeds";
import { createPost } from "./lib/db/queries/posts";
import { fetchFeed } from "./lib/rss";

function parsePublishedDate(dateStr: string): Date | null {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch {
    return null;
  }
}

export async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log("No feeds to fetch");
    return;
  }

  console.log(`Fetching feed: ${feed.name} from ${feed.url}`);
  
  try {
    const rssFeed = await fetchFeed(feed.url);
    await markFeedFetched(feed.id);
    
    console.log(`Found ${rssFeed.items.length} items in feed: ${feed.name}`);
    let savedCount = 0;
    
    for (const item of rssFeed.items) {
      const publishedAt = parsePublishedDate(item.pubDate);
      const post = await createPost(
        item.title,
        item.link,
        item.description,
        publishedAt,
        feed.id
      );
      
      if (post) {
        savedCount++;
        console.log(`  Saved: ${item.title}`);
      }
    }
    
    console.log(`Saved ${savedCount} new posts from ${feed.name}`);
  } catch (error) {
    console.error(`Error fetching feed ${feed.name}:`, error);
  }
}

export function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  
  if (!match) {
    throw new Error(`Invalid duration format: ${durationStr}`);
  }
  
  const value = parseInt(match[1], 10);
  const unit = match[2];
  
  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      throw new Error(`Unknown duration unit: ${unit}`);
  }
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h${minutes % 60}m${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}
