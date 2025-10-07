# API Documentation

## Authentication

All API routes (except auth endpoints) require authentication via NextAuth.js session.

### Auth Endpoints

#### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST /api/auth/signin
Sign in with credentials or OAuth provider.

#### POST /api/auth/signout
Sign out the current user.

---

## Campaigns

### GET /api/campaigns
Get all campaigns for the authenticated user.

**Response:**
```json
{
  "campaigns": [
    {
      "id": "clx...",
      "name": "Motivation Videos",
      "niche": "motivation",
      "language": "en",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "_count": {
        "videos": 5
      }
    }
  ]
}
```

### POST /api/campaigns
Create a new campaign.

**Request Body:**
```json
{
  "name": "Motivation Videos",
  "niche": "motivation",
  "language": "en",
  "description": "Daily motivation content"
}
```

**Response:**
```json
{
  "campaign": {
    "id": "clx...",
    "name": "Motivation Videos",
    "niche": "motivation",
    "language": "en",
    "status": "active"
  }
}
```

---

## Videos

### GET /api/videos
Get all videos for the authenticated user.

**Response:**
```json
{
  "videos": [
    {
      "id": "clx...",
      "title": "Never Give Up",
      "status": "completed",
      "videoUrl": "https://...",
      "thumbnailUrl": "https://...",
      "campaign": {
        "name": "Motivation Videos",
        "niche": "motivation"
      },
      "posts": [
        {
          "status": "posted",
          "socialAccount": {
            "platform": "youtube"
          }
        }
      ]
    }
  ]
}
```

### POST /api/videos
Create a new video (adds to generation queue).

**Request Body:**
```json
{
  "campaignId": "clx...",
  "title": "Never Give Up",
  "description": "Motivational video about perseverance",
  "script": "Success is not final, failure is not fatal..."
}
```

**Response:**
```json
{
  "video": {
    "id": "clx...",
    "title": "Never Give Up",
    "status": "pending"
  }
}
```

---

## Social Media

### POST /api/social/connect
Connect a social media account.

**Request Body:**
```json
{
  "platform": "youtube",
  "accessToken": "ya29...",
  "refreshToken": "1//...",
  "platformId": "UC...",
  "username": "MyChannel"
}
```

### POST /api/social/post
Post a video to social media.

**Request Body:**
```json
{
  "videoId": "clx...",
  "socialAccountId": "clx...",
  "scheduledAt": "2024-01-01T12:00:00.000Z" // optional
}
```

---

## Analytics

### GET /api/analytics
Get analytics for all videos.

**Query Parameters:**
- `platform` (optional): Filter by platform
- `from` (optional): Start date
- `to` (optional): End date

**Response:**
```json
{
  "analytics": [
    {
      "videoId": "clx...",
      "platform": "youtube",
      "views": 10000,
      "likes": 500,
      "shares": 100,
      "comments": 50,
      "watchTime": 5000,
      "date": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Webhooks

### POST /api/webhooks/stripe
Stripe webhook endpoint for subscription events.

**Events Handled:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

**Headers Required:**
- `stripe-signature`: Webhook signature for verification

---

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

**Error Response Format:**
```json
{
  "error": "Error message description"
}
```

---

## Rate Limiting

API endpoints are rate-limited based on subscription plan:

- **Free**: 60 requests/minute
- **Basic**: 300 requests/minute
- **Pro**: 1000 requests/minute
- **Enterprise**: 5000 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1640000000
```

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## Video Generation Queue

Videos are processed asynchronously:

1. POST /api/videos → Creates video record (status: `pending`)
2. Video added to Redis queue
3. Background worker processes video
4. Status updated: `pending` → `generating` → `completed`/`failed`

**Video Status Flow:**
```
pending → generating → completed
                    ↘ failed
```

---

## Subscription Plans

| Plan       | Videos/Month | Storage | Price  |
|------------|--------------|---------|--------|
| Free       | 5            | 1GB     | $0     |
| Basic      | 50           | 10GB    | $29    |
| Pro        | 200          | 50GB    | $99    |
| Enterprise | 1000         | 200GB   | $299   |

---

## Testing

### Using cURL

```bash
# Sign up
curl -X POST https://api.viralshortsops.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'

# Create campaign (with auth)
curl -X POST https://api.viralshortsops.com/api/campaigns \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{"name":"Test Campaign","niche":"technology","language":"en"}'
```

### Using Postman

Import the collection: [Download Postman Collection](./postman_collection.json)

---

**API Version:** 1.0.0  
**Last Updated:** December 2024
