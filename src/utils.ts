import { InferSelectModel } from "drizzle-orm";
import { feeds, users } from "./lib/db/schema";

type Feed = InferSelectModel<typeof feeds>;
type User = InferSelectModel<typeof users>;

export function printFeed(feed: Feed, user: User) {
  console.log(`* ID: ${feed.id}`);
  console.log(`* Name: ${feed.name}`);
  console.log(`* URL: ${feed.url}`);
  console.log(`* User: ${user.name}`);
  console.log(`* Created at: ${feed.createdAt}`);
  console.log(`* Updated at: ${feed.updatedAt}`);
}
