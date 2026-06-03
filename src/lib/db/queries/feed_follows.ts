import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds, users,feed_follow } from "../schema";

export async function createFeedFollow(userId: string, feedId: string) {
  const [result] = await db
    .insert(feed_follow)
    .values({ userId, feedId })
    .returning();
  return result;
}