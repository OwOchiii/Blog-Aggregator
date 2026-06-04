import { desc, eq } from "drizzle-orm";
import { db } from "..";
import { posts, feed_follow, feeds } from "../schema";

export async function createPost(
  title: string,
  url: string,
  description: string | null,
  publishedAt: Date | null,
  feedId: string
) {
  try {
    const [result] = await db
      .insert(posts)
      .values({ title, url, description, publishedAt, feedId })
      .returning();
    return result;
  } catch (error) {
    // If post already exists (unique constraint), ignore it
    return null;
  }
}

export async function getPostsForUser(userId: string, limit: number = 2) {
  const result = await db
    .select({
      post: posts,
      feed: feeds,
    })
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(feed_follow, eq(feeds.id, feed_follow.feedId))
    .where(eq(feed_follow.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  
  return result;
}
