import { SocialPoster, DecryptedTokenBundle, S3Url } from '@viralshortsops/core';
import { logger } from '@viralshortsops/utils';

// Mock social poster for all platforms
export class MockSocialPoster implements SocialPoster {
  async postShort(input: {
    platform: 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'FACEBOOK';
    tokens: DecryptedTokenBundle;
    videoUrl: S3Url;
    title: string;
    description: string;
    hashtags: string[];
    schedule?: Date;
  }): Promise<{ externalId: string; publishUrl?: string }> {
    logger.info({ platform: input.platform, title: input.title }, 'Social post called (mock)');

    // Mock implementation - simulate posting
    const externalId = `${input.platform.toLowerCase()}_${Date.now()}`;
    const publishUrl = `https://mock-${input.platform.toLowerCase()}.com/shorts/${externalId}`;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return { externalId, publishUrl };
  }
}

// YouTube specific implementation (for future)
export class YouTubePoster implements SocialPoster {
  async postShort(input: {
    platform: 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'FACEBOOK';
    tokens: DecryptedTokenBundle;
    videoUrl: S3Url;
    title: string;
    description: string;
    hashtags: string[];
    schedule?: Date;
  }): Promise<{ externalId: string; publishUrl?: string }> {
    // Real implementation would use YouTube Data API v3
    logger.info('YouTube posting not yet implemented, using mock');
    return new MockSocialPoster().postShort(input);
  }
}

// TikTok specific implementation (for future)
export class TikTokPoster implements SocialPoster {
  async postShort(input: {
    platform: 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'FACEBOOK';
    tokens: DecryptedTokenBundle;
    videoUrl: S3Url;
    title: string;
    description: string;
    hashtags: string[];
    schedule?: Date;
  }): Promise<{ externalId: string; publishUrl?: string }> {
    // Real implementation would use TikTok API
    logger.info('TikTok posting not yet implemented, using mock');
    return new MockSocialPoster().postShort(input);
  }
}

// Instagram specific implementation (for future)
export class InstagramPoster implements SocialPoster {
  async postShort(input: {
    platform: 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'FACEBOOK';
    tokens: DecryptedTokenBundle;
    videoUrl: S3Url;
    title: string;
    description: string;
    hashtags: string[];
    schedule?: Date;
  }): Promise<{ externalId: string; publishUrl?: string }> {
    // Real implementation would use Instagram Graph API
    logger.info('Instagram posting not yet implemented, using mock');
    return new MockSocialPoster().postShort(input);
  }
}

// Facebook specific implementation (for future)
export class FacebookPoster implements SocialPoster {
  async postShort(input: {
    platform: 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'FACEBOOK';
    tokens: DecryptedTokenBundle;
    videoUrl: S3Url;
    title: string;
    description: string;
    hashtags: string[];
    schedule?: Date;
  }): Promise<{ externalId: string; publishUrl?: string }> {
    // Real implementation would use Facebook Graph API
    logger.info('Facebook posting not yet implemented, using mock');
    return new MockSocialPoster().postShort(input);
  }
}
