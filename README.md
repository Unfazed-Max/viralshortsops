# ViralShortsOps

> Automated multi-niche, multilingual short-form video generation and posting platform

## Overview

ViralShortsOps is a production-grade, multitenant SaaS platform for automated video content generation and distribution. Users can create campaigns, generate AI-powered short-form videos with captions and voiceovers, and automatically post them to multiple social media platforms.

## Features

- 🎥 **Automated Video Generation**: AI-powered script generation, TTS voiceover, and video rendering with burned-in captions
- 🌍 **Multi-Platform Support**: Post to YouTube Shorts, TikTok, Instagram Reels, and Facebook automatically
- 📊 **Campaign Management**: Create and manage multiple campaigns across different niches
- 🔄 **Job Queue System**: BullMQ-powered async job processing for video pipeline
- 💳 **Stripe Integration**: Subscription plans with quota management
- 🔐 **Secure OAuth**: Platform connection management with encrypted token storage
- 📈 **Analytics**: Track performance across platforms

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: BullMQ + Redis
- **Storage**: S3-compatible (MinIO for local dev)
- **Auth**: NextAuth.js
- **Payments**: Stripe
- **Video**: FFMPEG (with mock InVideo and Sora adapters)

## Architecture

```
apps/
  web/              # Next.js 14 frontend + API routes
packages/
  core/             # Domain entities, interfaces, use-cases
  providers/        # Video, TTS, social, storage adapters
  queue/            # BullMQ job handlers
  db/               # Prisma schema + migrations
  contracts/        # API schemas (Zod)
  utils/            # Shared utilities
```

## Prerequisites

- Node.js 18+
- PostgreSQL
- Redis
- MinIO (or S3-compatible storage)
- FFMPEG

## Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Setup environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the following required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `S3_*`: S3/MinIO configuration
- `AUTH_SECRET`: Random 32+ character string

### 3. Setup database

```bash
# Generate Prisma client
pnpm db:generate

# Create migration (requires running PostgreSQL)
pnpm db:migrate

# Seed demo data (optional)
pnpm db:seed
```

### 4. Start development server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Development

### Project Structure

- `packages/db/prisma/schema.prisma`: Database schema
- `packages/queue/src/handlers/`: Job handlers for video pipeline
- `packages/providers/src/`: Provider implementations (video, TTS, social)
- `apps/web/app/api/`: API routes
- `apps/web/app/`: Frontend pages

### Video Pipeline Flow

1. **GENERATE_SCRIPT**: Template-based script generation
2. **SYNTH_VOICEOVER**: TTS synthesis
3. **BUILD_CAPTIONS**: SRT generation
4. **RENDER_VIDEO**: FFMPEG rendering with captions
5. **SCHEDULE_POSTS**: Create post tasks
6. **POST_VIDEO**: Platform posting

### Available Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build all packages
pnpm lint             # Lint code
pnpm format           # Format code
pnpm typecheck        # Type check

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema to DB
pnpm db:seed          # Seed demo data
pnpm db:studio        # Open Prisma Studio

# Testing
pnpm test             # Run tests
```

## API Endpoints

### Organizations
- `POST /api/orgs` - Create organization

### Campaigns
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `POST /api/campaigns/:id/generate` - Generate videos

### Media
- `GET /api/media/:id` - Get media item status

### Health
- `GET /api/health` - Health check

## Deployment

### Docker

```bash
docker build -t viralshortsops .
docker run -p 3000:3000 viralshortsops
```

### Environment Variables

See `.env.example` for all required environment variables.

## Billing Plans

- **FREE**: 10 renders/month, 1 account, 10 posts/day
- **PRO**: 200 renders/month, 5 accounts, 200 posts/day
- **TEAM**: 1000 renders/month, 20 accounts, 1000 posts/day

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
