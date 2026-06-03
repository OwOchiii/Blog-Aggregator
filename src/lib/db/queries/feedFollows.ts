import {and, eq} from "drizzle-orm";
import { db } from "..";
import { feed_follow, feeds, users } from "../schema";

export async function createFeedFollow(userId: string, feedId: string) {
  const [result] = await db
    .insert(feed_follow)
    .values({ userId, feedId })
    .returning();

  const [feedFollowWithNames] = await db
    .select({
      feedFollow: feed_follow,
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feed_follow)
    .innerJoin(feeds, eq(feed_follow.feedId, feeds.id))
    .innerJoin(users, eq(feed_follow.userId, users.id))
    .where(eq(feed_follow.id, result.id));

  return feedFollowWithNames;
}

export async function getFeedFollowsForUser(userId: string) {
  const result = await db
    .select({
      feedFollow: feed_follow,
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feed_follow)
    .innerJoin(feeds, eq(feed_follow.feedId, feeds.id))
    .innerJoin(users, eq(feed_follow.userId, users.id))
    .where(eq(feed_follow.userId, userId));

  return result;
}

export async function deleteFeedFollow(url: string,user_id: string) {
    const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
    await db.delete(feed_follow).where(and(eq(feed_follow.feedId, feed.id),eq(feed_follow.userId, user_id)));
}
