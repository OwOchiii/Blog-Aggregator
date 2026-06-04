# Blog Aggregator

A command-line RSS feed aggregator that allows you to follow multiple blogs and view their latest posts in one place.

## Prerequisites

Before running this CLI, you'll need:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn** package manager

## Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd Blog-Aggregator
```

2. Install dependencies:
```bash
npm install
```

3. Set up your PostgreSQL database:
```bash
# Connect to PostgreSQL
psql postgres

# Create the database
CREATE DATABASE gator;

# Exit psql
\q
```

4. Run migrations:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Configuration

Create a `.gatorconfig.json` file in your home directory with your database connection string:

### macOS/Linux:
```bash
echo '{
  "db_url": "postgres://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/gator?sslmode=disable"
}' > ~/.gatorconfig.json
```

### Windows:
Create `C:\Users\YourUsername\.gatorconfig.json` with:
```json
{
  "db_url": "postgres://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/gator?sslmode=disable"
}
```

**Example connection strings:**
- macOS (no password): `postgres://username:@localhost:5432/gator?sslmode=disable`
- Linux/Windows: `postgres://postgres:postgres@localhost:5432/gator?sslmode=disable`

## Usage

Run commands using:
```bash
npm run start <command> [arguments]
```

### User Management

**Register a new user:**
```bash
npm run start register <username>
```

**Login as an existing user:**
```bash
npm run start login <username>
```

**List all users:**
```bash
npm run start users
```

**Reset database (deletes all users and feeds):**
```bash
npm run start reset
```

### Feed Management

**Add a new feed:**
```bash
npm run start addfeed "<feed-name>" "<feed-url>"
```
Example:
```bash
npm run start addfeed "Hacker News" "https://hnrss.org/newest"
```

**List all feeds:**
```bash
npm run start feeds
```

**Follow an existing feed:**
```bash
npm run start follow "<feed-url>"
```

**List feeds you're following:**
```bash
npm run start following
```

**Unfollow a feed:**
```bash
npm run start unfollow "<feed-url>"
```

### Browsing Posts

**View latest posts from feeds you follow:**
```bash
npm run start browse [limit]
```
Examples:
```bash
npm run start browse      # Shows 2 posts (default)
npm run start browse 10   # Shows 10 posts
```

### Feed Aggregation

**Start the feed aggregator (continuously fetches and saves posts):**
```bash
npm run start agg <time-interval>
```
Examples:
```bash
npm run start agg 1m      # Fetch feeds every 1 minute
npm run start agg 30s     # Fetch feeds every 30 seconds
npm run start agg 1h      # Fetch feeds every 1 hour
```

Time formats: `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours)

Press `Ctrl+C` to stop the aggregator gracefully.

## Example Workflow

```bash
# 1. Register a user
npm run start register john

# 2. Add some feeds
npm run start addfeed "Boot.dev Blog" "https://www.boot.dev/index.xml"
npm run start addfeed "Hacker News" "https://hnrss.org/newest"

# 3. Start aggregating (in a separate terminal)
npm run start agg 5m

# 4. Browse posts
npm run start browse 5
```

## Popular RSS Feeds to Try

- **Boot.dev Blog**: `https://www.boot.dev/index.xml`
- **Hacker News**: `https://hnrss.org/newest`
- **Dev.to**: `https://dev.to/feed`
- **Smashing Magazine**: `https://www.smashingmagazine.com/feed`
- **CSS Tricks**: `https://css-tricks.com/feed`

## Development

Build the project:
```bash
npm run build
```

Run in development mode:
```bash
npm run dev
```

## Troubleshooting

**Database connection issues:**
- Verify PostgreSQL is running: `psql postgres`
- Check your connection string in `.gatorconfig.json`
- Ensure the `gator` database exists

**Migration issues:**
- Try resetting: `npm run start reset`
- Re-run migrations: `npx drizzle-kit migrate`

**Feed fetch errors:**
- Verify the feed URL is valid and accessible
- Check your internet connection
- Some feeds may have rate limiting

## License

MIT
