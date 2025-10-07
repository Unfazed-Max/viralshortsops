import { z } from 'zod';

// Org schemas
export const createOrgSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
});

export const orgResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  billingPlan: z.enum(['FREE', 'PRO', 'TEAM']),
});

// Campaign schemas
export const createCampaignSchema = z.object({
  name: z.string().min(1),
  niche: z.string().min(1),
  primaryLang: z.string().length(2), // ISO code
  config: z.object({
    targetCount: z.number().int().min(1).max(100),
    cadence: z.object({
      interval: z.enum(['daily', 'weekly']),
      times: z.array(z.string()), // HH:MM format
    }),
    platforms: z.array(z.enum(['YOUTUBE', 'TIKTOK', 'INSTAGRAM', 'FACEBOOK'])),
  }),
});

export const campaignResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  niche: z.string(),
  status: z.enum(['DRAFT', 'RUNNING', 'PAUSED', 'ARCHIVED']),
});

// Social connection schemas
export const connectSocialSchema = z.object({
  platform: z.enum(['YOUTUBE', 'TIKTOK', 'INSTAGRAM', 'FACEBOOK']),
  code: z.string(), // OAuth code
  redirectUri: z.string().url(),
});

// Media item schemas
export const generateMediaSchema = z.object({
  count: z.number().int().min(1).max(10),
});

export const mediaItemResponseSchema = z.object({
  id: z.string(),
  status: z.enum(['PENDING', 'RENDERING', 'READY', 'FAILED']),
  script: z.any().optional(),
  render: z.any().optional(),
});

// Post schemas
export const schedulePostSchema = z.object({
  mediaItemId: z.string(),
  platforms: z.array(z.object({
    platform: z.enum(['YOUTUBE', 'TIKTOK', 'INSTAGRAM', 'FACEBOOK']),
    scheduledAt: z.string().datetime(),
  })),
});
