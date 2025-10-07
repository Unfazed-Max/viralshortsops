# ViralShortsOps

A comprehensive SaaS platform for automatically generating and posting short-form viral videos to social media platforms.

## 🚀 Features

- **AI-Powered Video Generation**: Automatically create videos using InVideo API, Sora, and FFmpeg
- **Multi-Platform Support**: Post to YouTube, TikTok, and Instagram
- **Campaign Management**: Organize videos by niche and language
- **Smart Scheduling**: Auto-post videos at optimal times
- **Analytics Dashboard**: Track views, likes, shares, and engagement
- **Quota Management**: Usage limits based on subscription tiers
- **Secure Storage**: AWS S3 integration for video storage
- **Job Queues**: Redis-based background processing
- **Payment Integration**: Stripe for subscriptions
- **Authentication**: NextAuth.js with credentials and OAuth

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Caching/Queues**: Redis (ioredis)
- **Authentication**: NextAuth.js (Auth.js)
- **Payments**: Stripe
- **Storage**: AWS S3
- **Video Processing**: FFmpeg, InVideo API

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Redis server
- AWS account (for S3)
- Stripe account
- API keys for video generation services

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Unfazed-Max/viralshortsops.git
   cd viralshortsops
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   - Database URL (PostgreSQL)
   - Redis URL
   - NextAuth secret and URL
   - Stripe keys
   - AWS credentials
   - Social media API keys
   - Video API keys

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

The application uses Prisma ORM with the following models:

- **User**: User accounts with authentication
- **Campaign**: Video campaigns by niche/language
- **Video**: Generated videos with metadata
- **SocialAccount**: Connected social media accounts
- **Post**: Scheduled/posted videos
- **Schedule**: Posting schedules
- **VideoAnalytics**: Performance metrics
- **Subscription**: User subscription plans
- **Usage**: Quota tracking

## 🔐 Authentication

- Email/password authentication
- Google OAuth (optional)
- Session-based with JWT tokens
- Protected API routes and pages

## 💳 Subscription Plans

### Free Tier
- 5 videos/month
- 1GB storage
- Basic analytics

### Basic ($29/month)
- 50 videos/month
- 10GB storage
- Advanced analytics
- Priority support

### Pro ($99/month)
- 200 videos/month
- 50GB storage
- Custom branding
- Advanced features

### Enterprise ($299/month)
- 1000 videos/month
- 200GB storage
- API access
- Dedicated support

## 📝 API Routes

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Campaigns
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `PATCH /api/campaigns/[id]` - Update campaign
- `DELETE /api/campaigns/[id]` - Delete campaign

### Videos
- `GET /api/videos` - List videos
- `POST /api/videos` - Create video
- `GET /api/videos/[id]` - Get video details

### Social Media
- `POST /api/social/connect` - Connect social account
- `POST /api/social/post` - Post to social media

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhooks

## 🎨 UI Components

The application includes:
- Responsive dashboard layout
- Campaign management interface
- Video generation forms
- Analytics charts
- Settings panels
- Modal dialogs
- Loading states

## 🔒 Security Features

- Password hashing with bcrypt
- Secure token storage
- API rate limiting
- Input validation
- CSRF protection
- Encrypted sensitive data

## 🚦 Job Queue System

Videos are processed asynchronously using Redis queues:
1. Video generation requests are queued
2. Background workers process the queue
3. Videos are uploaded to S3
4. Database is updated with results
5. Posts are scheduled/published

## 📈 Analytics

Track video performance:
- Views, likes, shares, comments
- Watch time and engagement
- Platform-specific metrics
- Historical trends

## 🛡️ Error Handling

- Graceful error pages
- Detailed error logging
- User-friendly error messages
- Retry mechanisms for failed jobs

## 🧪 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

## 📦 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Configure build command: `npm run build`
- Configure start command: `npm run start`
- Ensure Node.js 18+ runtime
- Set all environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

ISC License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Contact support (for paid plans)

## 🔄 Roadmap

- [ ] Additional video APIs (Runway, Pika)
- [ ] More social platforms (Twitter/X, LinkedIn)
- [ ] Advanced AI script generation
- [ ] Team collaboration features
- [ ] White-label options
- [ ] Mobile app

## ⚡ Performance

- Server-side rendering for fast page loads
- Image optimization with Next.js
- Redis caching for API responses
- CDN delivery for static assets
- Lazy loading for components

---

Built with ❤️ using Next.js and TypeScript
