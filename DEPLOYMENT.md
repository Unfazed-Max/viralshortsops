# ViralShortsOps - Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. **Database**: PostgreSQL instance (Supabase, Neon, Railway, etc.)
2. **Redis**: Redis instance (Upstash, Railway, etc.)
3. **AWS S3**: Bucket for video storage
4. **Stripe**: Account with API keys
5. **API Keys**: For video generation services

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/viralshortsops"

# Auth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Add price IDs for each plan
STRIPE_BASIC_PRICE_ID="price_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_ENTERPRISE_PRICE_ID="price_..."

# Redis
REDIS_URL="redis://default:password@host:port"

# AWS S3
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="us-east-1"
AWS_S3_BUCKET="viralshortsops-videos"

# Video APIs
INVIDEO_API_KEY=""
OPENAI_API_KEY=""

# Social Media APIs
YOUTUBE_CLIENT_ID=""
YOUTUBE_CLIENT_SECRET=""
TIKTOK_CLIENT_ID=""
TIKTOK_CLIENT_SECRET=""
INSTAGRAM_CLIENT_ID=""
INSTAGRAM_CLIENT_SECRET=""
```

## Deployment Steps

### 1. Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
```

### 2. Database Setup

```bash
# Run Prisma migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### 3. Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 4. Background Worker

Deploy the background worker separately:

```bash
# Option 1: Using PM2
npm install -g pm2
pm2 start scripts/worker.ts --name video-worker

# Option 2: Using Docker
docker build -t viralshortsops-worker .
docker run -d viralshortsops-worker npm run worker

# Option 3: Separate service (Railway, Render, etc.)
# Deploy worker as a separate service with same environment variables
```

### 5. Social Media OAuth Setup

#### YouTube
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add redirect URI: `https://yourdomain.com/api/auth/callback/google`
4. Enable YouTube Data API v3

#### TikTok
1. Register at TikTok for Developers
2. Create app and get credentials
3. Set redirect URI

#### Instagram
1. Create Meta/Facebook app
2. Enable Instagram Basic Display
3. Configure OAuth redirect

## Production Checklist

- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Configure production database
- [ ] Set up Redis instance
- [ ] Create S3 bucket with proper CORS
- [ ] Configure Stripe products and prices
- [ ] Set up Stripe webhooks
- [ ] Configure OAuth providers
- [ ] Set up monitoring (Sentry, LogRocket, etc.)
- [ ] Configure CDN for static assets
- [ ] Set up SSL certificate
- [ ] Configure rate limiting
- [ ] Set up backup strategy
- [ ] Configure CI/CD pipeline

## Performance Optimization

### Database
- Enable connection pooling (PgBouncer)
- Add database indexes
- Use read replicas for analytics

### Caching
- Use Redis for session storage
- Cache API responses
- Implement CDN for static assets

### Video Processing
- Use queue system for async processing
- Implement retry logic
- Scale workers horizontally

### Monitoring
```bash
# Add monitoring tools
npm install @sentry/nextjs
npm install @vercel/analytics
```

## Security Best Practices

1. **API Keys**: Never commit to version control
2. **Rate Limiting**: Implement on all API routes
3. **CORS**: Configure properly for your domain
4. **Input Validation**: Validate all user inputs
5. **SQL Injection**: Use Prisma parameterized queries
6. **XSS Protection**: Sanitize user-generated content
7. **CSRF**: Next.js handles this by default

## Scaling Considerations

### Horizontal Scaling
- Deploy multiple Next.js instances
- Use load balancer (Vercel handles this)
- Scale Redis with clustering

### Vertical Scaling
- Increase database resources
- Optimize queries and indexes
- Use CDN for video delivery

### Database Scaling
```sql
-- Add indexes for common queries
CREATE INDEX idx_video_status ON "Video"(status);
CREATE INDEX idx_campaign_user ON "Campaign"("userId");
CREATE INDEX idx_post_scheduled ON "Post"("scheduledAt");
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Run `npm run build` locally first
   - Check TypeScript errors
   - Verify all environment variables

2. **Database Connection**
   - Verify DATABASE_URL format
   - Check firewall rules
   - Enable SSL if required

3. **Stripe Webhooks**
   - Verify webhook secret
   - Check endpoint is publicly accessible
   - Review webhook logs in Stripe

4. **Video Generation**
   - Check API keys
   - Verify FFmpeg installation
   - Review worker logs

## Support

For production issues:
- Check application logs
- Review error tracking (Sentry)
- Monitor performance metrics
- Check database query performance

---

**Last Updated**: December 2024
