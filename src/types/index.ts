export interface CampaignFormData {
  name: string
  niche: string
  language: string
  description?: string
}

export interface VideoGenerationRequest {
  campaignId: string
  title: string
  description?: string
  script: string
}

export interface SocialAccountConnection {
  platform: 'youtube' | 'tiktok' | 'instagram'
  accessToken: string
  refreshToken?: string
  platformId: string
  username?: string
}

export interface ScheduleData {
  campaignId: string
  dayOfWeek: number
  timeOfDay: string
  timezone: string
}

export interface VideoAnalyticsData {
  videoId: string
  platform: string
  views: number
  likes: number
  shares: number
  comments: number
  watchTime: number
}

export type VideoStatus = 'pending' | 'generating' | 'completed' | 'failed' | 'posted'
export type PostStatus = 'scheduled' | 'posting' | 'posted' | 'failed'
export type CampaignStatus = 'active' | 'paused' | 'completed'
export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise'
