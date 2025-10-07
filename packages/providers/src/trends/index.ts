import { TrendSourceProvider } from '@viralshortsops/core';
import { logger } from '@viralshortsops/utils';

// Mock trends provider
export class MockTrendSourceProvider implements TrendSourceProvider {
  private mockTrends: Record<string, Array<{ title: string; hook: string; keywords: string[] }>> = {
    'fitness': [
      {
        title: '5 Minute Ab Workout',
        hook: 'Want abs that pop? Try this quick routine!',
        keywords: ['fitness', 'abs', 'workout', 'health'],
      },
      {
        title: 'Protein Shake Recipe',
        hook: 'The ultimate post-workout shake for muscle growth',
        keywords: ['protein', 'nutrition', 'fitness', 'recipe'],
      },
      {
        title: 'Morning Stretch Routine',
        hook: 'Start your day right with these stretches',
        keywords: ['stretching', 'morning', 'flexibility', 'wellness'],
      },
    ],
    'crypto': [
      {
        title: 'Bitcoin Myths Debunked',
        hook: "Don't believe everything you hear about crypto!",
        keywords: ['bitcoin', 'crypto', 'blockchain', 'myths'],
      },
      {
        title: 'DeFi Explained Simply',
        hook: 'Decentralized finance in under 60 seconds',
        keywords: ['defi', 'finance', 'crypto', 'explained'],
      },
      {
        title: 'NFT Investment Tips',
        hook: 'Avoid these costly NFT mistakes!',
        keywords: ['nft', 'investment', 'crypto', 'tips'],
      },
    ],
  };

  async ideas(input: {
    niche: string;
    lang: string;
    limit: number;
  }): Promise<Array<{ title: string; hook: string; keywords: string[] }>> {
    logger.info({ input }, 'TrendSource ideas called (mock)');

    const nicheLower = input.niche.toLowerCase();
    const trends = this.mockTrends[nicheLower] || this.mockTrends['fitness']; // fallback

    return trends.slice(0, input.limit);
  }
}
