# ViralShortsOps - Project Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js 15 (App Router)                  │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   Pages    │  │ Components │  │  Layouts   │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  │                    TailwindCSS                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/auth          /api/campaigns    /api/videos    │  │
│  │  /api/social        /api/webhooks     /api/analytics │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┼─────────┐
                    ↓         ↓         ↓
              ┌─────────┐ ┌─────────┐ ┌─────────┐
              │  Auth   │ │  Redis  │ │  S3     │
              │ Next.js │ │  Queue  │ │ Storage │
              └─────────┘ └─────────┘ └─────────┘
                    │         │
                    ↓         ↓
              ┌──────────────────────┐
              │   PostgreSQL DB      │
              │     (Prisma ORM)     │
              └──────────────────────┘
                    │
                    ↓
              ┌──────────────────────┐
              │  Background Worker   │
              │  (Video Generation)  │
              └──────────────────────┘
                    │
                    ↓
              ┌──────────────────────┐
              │  External Services   │
              │  • InVideo API       │
              │  • FFmpeg            │
              │  • OpenAI            │
              │  • Social Media APIs │
              └──────────────────────┘
```

## Data Flow

### 1. User Authentication Flow
```
User → Sign In Page → NextAuth.js → PostgreSQL → Session Cookie → Dashboard
```

### 2. Campaign Creation Flow
```
User → Campaign Form → POST /api/campaigns → Prisma → PostgreSQL → Response
```

### 3. Video Generation Flow
```
User → Video Form → POST /api/videos 
     → Prisma (Create Record)
     → Redis (Add to Queue)
     → Background Worker
     → InVideo/FFmpeg API
     → S3 Upload
     → Prisma (Update Record)
     → User Notification
```

### 4. Social Media Posting Flow
```
Video Ready → POST /api/social/post
     → Prisma (Create Post Record)
     → Social Media API (YouTube/TikTok/Instagram)
     → Prisma (Update Status)
     → Analytics Collection
```

### 5. Stripe Webhook Flow
```
Stripe Event → POST /api/webhooks/stripe
     → Verify Signature
     → Process Event
     → Update Subscription in DB
     → Update User Quotas
```

## Database Schema

### Core Models

```prisma
User
  ├── Account (OAuth)
  ├── Session (Auth)
  ├── Campaign[]
  ├── SocialAccount[]
  ├── Subscription
  └── Usage

Campaign
  ├── Video[]
  └── Schedule[]

Video
  ├── Post[]
  └── VideoAnalytics[]

SocialAccount
  └── Post[]

Post
  ├── Video
  └── SocialAccount
```

## Tech Stack Details

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + @tailwindcss/typography
- **UI Components**: Custom components with Headless UI patterns
- **State Management**: React Server Components + Client Components
- **Forms**: Native HTML5 with React hooks

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **API**: RESTful API
- **Authentication**: NextAuth.js v5
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Cache/Queue**: Redis (ioredis)
- **File Storage**: AWS S3

### External Services
- **Payments**: Stripe
- **Video Generation**: InVideo API, FFmpeg
- **AI**: OpenAI API (for scripts, translation)
- **Social Media**: YouTube Data API, TikTok API, Instagram Graph API

### Development Tools
- **Language**: TypeScript
- **Linting**: ESLint
- **Code Formatting**: Prettier (optional)
- **Package Manager**: npm
- **Version Control**: Git

## Security Architecture

### Authentication & Authorization
- Session-based authentication via NextAuth.js
- JWT tokens for API authentication
- OAuth 2.0 for social login
- Secure password hashing with bcrypt

### Data Security
- HTTPS only in production
- Encrypted environment variables
- SQL injection prevention (Prisma)
- XSS protection (React escape by default)
- CSRF tokens (Next.js built-in)

### API Security
- Rate limiting per user/IP
- Request validation
- Secure headers
- API key rotation

### Storage Security
- S3 bucket policies
- Signed URLs for video access
- Encrypted storage at rest
- Access control lists (ACL)

## Scaling Strategy

### Horizontal Scaling
- **Next.js**: Multiple instances behind load balancer
- **Workers**: Scale based on queue depth
- **Database**: Read replicas for analytics

### Vertical Scaling
- **Database**: Increase compute resources
- **Redis**: Increase memory
- **Worker**: Increase CPU/memory

### Caching Strategy
```
Request → Redis Cache (check)
    ├── Hit → Return cached data
    └── Miss → Database → Cache → Return
```

### Queue Processing
```
Video Generation Queue (Redis List)
    → Multiple Workers (Parallel Processing)
    → Rate Limiting per API
    → Retry Logic (3 attempts)
    → Dead Letter Queue (failed jobs)
```

## File Structure

```
viralshortsops/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── auth/              # Auth pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   ├── lib/                   # Library code
│   │   ├── auth.ts           # Auth config
│   │   ├── prisma.ts         # Prisma client
│   │   ├── redis.ts          # Redis client
│   │   ├── s3.ts             # S3 utilities
│   │   ├── stripe.ts         # Stripe config
│   │   ├── video-generation.ts
│   │   └── social-posting.ts
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Utility functions
│   └── middleware.ts          # Next.js middleware
├── prisma/
│   └── schema.prisma          # Database schema
├── scripts/
│   └── worker.ts              # Background worker
├── public/                    # Static files
├── .env.example               # Environment template
├── next.config.js             # Next.js config
├── tailwind.config.js         # Tailwind config
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
└── README.md                  # Documentation
```

## Deployment Architecture

### Production Setup
```
┌─────────────────────┐
│   Vercel/Cloud      │
│   ┌─────────────┐   │
│   │  Next.js    │   │
│   │  (Frontend  │   │
│   │   + API)    │   │
│   └─────────────┘   │
└─────────────────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌────────┐  ┌──────────┐
│  DB    │  │  Redis   │
│ (Neon/ │  │(Upstash) │
│Supabase│  └──────────┘
└────────┘         
         │         
    ┌────┴────┐
    ↓         ↓
┌────────┐  ┌──────────┐
│   S3   │  │  Worker  │
│(Videos)│  │ (Railway)│
└────────┘  └──────────┘
```

### Monitoring & Logging
- Application logs (Vercel/Railway)
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Database monitoring (Provider dashboard)
- Uptime monitoring (UptimeRobot)

## Performance Optimizations

### Frontend
- Server-side rendering (SSR)
- Static generation where possible
- Image optimization (Next.js Image)
- Code splitting (automatic)
- Lazy loading components
- CDN for static assets

### Backend
- Database query optimization
- Connection pooling
- Redis caching
- API response caching
- Batch processing
- Async job processing

### Database
```sql
-- Key indexes for performance
CREATE INDEX idx_video_campaign ON "Video"("campaignId");
CREATE INDEX idx_video_status ON "Video"("status");
CREATE INDEX idx_post_scheduled ON "Post"("scheduledAt");
CREATE INDEX idx_analytics_video ON "VideoAnalytics"("videoId", "date");
```

## Future Enhancements

### Phase 2
- [ ] Multi-language support (i18n)
- [ ] Advanced video editing features
- [ ] Team collaboration
- [ ] API for third-party integrations
- [ ] Mobile app (React Native)

### Phase 3
- [ ] AI script generation
- [ ] Automated A/B testing
- [ ] Advanced analytics (ML insights)
- [ ] White-label solution
- [ ] Enterprise features

---

**Architecture Version**: 1.0.0  
**Last Updated**: December 2024
