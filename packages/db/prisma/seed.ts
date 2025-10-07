import { PrismaClient, BillingPlan } from '@prisma/client';
import { encryptToken } from '../../utils/src/crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@viralshortsops.com' },
    update: {},
    create: {
      email: 'demo@viralshortsops.com',
      name: 'Demo User',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Create demo org
  const org = await prisma.org.upsert({
    where: { slug: 'demo-org' },
    update: {},
    create: {
      name: 'Demo Organization',
      slug: 'demo-org',
      ownerId: user.id,
      billingPlan: BillingPlan.PRO,
      quotas: {
        maxRendersPerMonth: 200,
        maxConnectedAccounts: 5,
        maxScheduledPostsPerDay: 200,
      },
    },
  });

  console.log('✅ Created demo org:', org.name);

  // Add user as org member
  await prisma.orgMember.upsert({
    where: {
      orgId_userId: {
        orgId: org.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      orgId: org.id,
      userId: user.id,
      role: 'OWNER',
    },
  });

  // Create mock social connections
  const mockTokens = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiresAt: Date.now() + 3600000,
  };

  const platforms = ['YOUTUBE', 'TIKTOK', 'INSTAGRAM', 'FACEBOOK'] as const;
  
  for (const platform of platforms) {
    await prisma.socialConnection.upsert({
      where: {
        orgId_platform_accountRef: {
          orgId: org.id,
          platform,
          accountRef: `demo-${platform.toLowerCase()}-account`,
        },
      },
      update: {},
      create: {
        orgId: org.id,
        platform,
        accountRef: `demo-${platform.toLowerCase()}-account`,
        accountName: `Demo ${platform} Account`,
        access: encryptToken(mockTokens),
      },
    });
  }

  console.log('✅ Created mock social connections');

  // Create demo campaigns
  const fitnessCampaign = await prisma.campaign.upsert({
    where: { id: 'fitness-campaign' },
    update: {},
    create: {
      id: 'fitness-campaign',
      orgId: org.id,
      name: 'Fitness Tips',
      niche: 'fitness',
      primaryLang: 'en',
      status: 'RUNNING',
      config: {
        targetCount: 10,
        cadence: { interval: 'daily', times: ['09:00', '18:00'] },
        platforms: ['YOUTUBE', 'TIKTOK', 'INSTAGRAM'],
      },
    },
  });

  const cryptoCampaign = await prisma.campaign.upsert({
    where: { id: 'crypto-campaign' },
    update: {},
    create: {
      id: 'crypto-campaign',
      orgId: org.id,
      name: 'Crypto Myths',
      niche: 'crypto',
      primaryLang: 'en',
      status: 'RUNNING',
      config: {
        targetCount: 10,
        cadence: { interval: 'daily', times: ['12:00'] },
        platforms: ['YOUTUBE', 'TIKTOK'],
      },
    },
  });

  console.log('✅ Created demo campaigns');

  // Create sample media items
  for (const campaign of [fitnessCampaign, cryptoCampaign]) {
    for (let i = 0; i < 3; i++) {
      await prisma.mediaItem.create({
        data: {
          campaignId: campaign.id,
          locale: campaign.primaryLang,
          script: {
            hook: 'Want to get fit in just 5 minutes?',
            body: 'Here are 3 proven exercises that work!',
            cta: 'Follow for more tips!',
          },
          assets: {
            ttsUrl: 'https://mock-s3.com/tts/sample.mp3',
            srtUrl: 'https://mock-s3.com/captions/sample.srt',
          },
          render: {
            provider: 'ffmpeg',
            jobId: `mock-job-${i}`,
            outputUrl: 'https://mock-s3.com/renders/sample.mp4',
          },
          durationSec: 10,
          status: 'READY',
        },
      });
    }
  }

  console.log('✅ Created sample media items');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
