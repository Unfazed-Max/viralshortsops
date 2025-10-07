# Quick Start Guide

Get ViralShortsOps running locally in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Redis server (local or cloud)

## Step 1: Clone & Install

```bash
git clone https://github.com/Unfazed-Max/viralshortsops.git
cd viralshortsops
npm install
```

## Step 2: Environment Setup

Create `.env` file:

```bash
cp .env.example .env
```

**Minimum required variables:**

```env
# Database (required)
DATABASE_URL="postgresql://user:password@localhost:5432/viralshortsops"

# Auth (required)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Redis (required)
REDIS_URL="redis://localhost:6379"

# AWS S3 (required for video storage)
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket"

# Stripe (optional for testing, required for payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

**Quick tip:** For local development, you can use:
- PostgreSQL: Docker or local install
- Redis: Docker or local install
- S3: LocalStack or MinIO for testing

## Step 3: Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

## Step 4: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 5: Create Your First Account

1. Go to http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Create an account with email/password
4. You'll be redirected to the dashboard!

## What's Next?

### Create Your First Campaign

1. Navigate to "Campaigns" in the dashboard
2. Click "Create Campaign"
3. Fill in:
   - **Name**: e.g., "Motivation Videos"
   - **Niche**: Select a category
   - **Language**: Choose your language
4. Click "Create"

### Generate a Video

1. From your campaign, click "Create Video"
2. Fill in:
   - **Title**: Video title
   - **Script**: Your video script/content
   - **Description**: Optional description
3. Click "Generate"
4. Video will be queued for processing

### Start Background Worker

For video processing to work:

```bash
# In a new terminal
npx tsx scripts/worker.ts
```

This worker processes the video generation queue.

## Project Structure

```
viralshortsops/
├── src/
│   ├── app/              # Pages and API routes
│   ├── components/       # React components
│   ├── lib/             # Core libraries
│   └── types/           # TypeScript types
├── prisma/
│   └── schema.prisma    # Database schema
├── scripts/
│   └── worker.ts        # Background worker
└── public/              # Static files
```

## Common Tasks

### Run Tests
```bash
npm run lint
npm run build
```

### Database Operations
```bash
# View database in browser
npm run db:studio

# Create migration
npm run db:migrate

# Reset database
npx prisma migrate reset
```

### Update Dependencies
```bash
npm update
npm audit fix
```

## Troubleshooting

### Port Already in Use
```bash
# Change port in package.json or:
PORT=3001 npm run dev
```

### Database Connection Error
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Verify credentials

### Redis Connection Error
- Check REDIS_URL is correct
- Ensure Redis is running
- Try: `redis-cli ping` (should return PONG)

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## Using Docker (Optional)

Quick setup with Docker Compose:

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: viralshortsops
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7
    ports:
      - "6379:6379"
```

Run: `docker-compose up -d`

## Testing Features

### Test Authentication
1. Sign up with email/password
2. Sign out
3. Sign in again
4. Try OAuth (if configured)

### Test Campaign & Videos
1. Create a campaign
2. Create a video (will be in pending state)
3. Start worker to process it
4. Check video status updates

### Test Dashboard
- View statistics
- Check analytics (once videos are posted)
- Review settings and quotas

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Deploying to Vercel
- Setting up production database
- Configuring Stripe
- Setting up social media OAuth

## Development Tips

### Hot Reload
Next.js automatically reloads on file changes

### Debug Mode
```bash
NODE_ENV=development npm run dev
```

### Environment Variables
- Never commit `.env` to git
- Use `.env.example` as template
- Different values for dev/staging/prod

### Database Changes
1. Update `prisma/schema.prisma`
2. Run `npm run db:push` (dev) or `npm run db:migrate` (prod)
3. Run `npm run db:generate`

## Need Help?

- 📖 [Full Documentation](./README.md)
- 🏗️ [Architecture Guide](./ARCHITECTURE.md)
- 🔌 [API Reference](./API.md)
- 🤝 [Contributing Guide](./CONTRIBUTING.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)

## Pro Tips

1. **Use Prisma Studio**: `npm run db:studio` - Visual database editor
2. **Check Logs**: Watch terminal for errors and debugging info
3. **Redis Monitoring**: `redis-cli monitor` - See queue activity
4. **Type Safety**: Use TypeScript, let it catch errors
5. **Git Branches**: Create feature branches for new work

---

Happy coding! 🎉
