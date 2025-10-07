import { prisma, PostStatus } from '@viralshortsops/db';
import { logger, decryptToken } from '@viralshortsops/utils';
import { MockSocialPoster } from '@viralshortsops/providers';
import { DecryptedTokenBundle } from '@viralshortsops/core';
import { PostVideoJobData } from '../jobs';

const socialPoster = new MockSocialPoster();

export async function handlePostVideo(job: { id: string; name: string; data: PostVideoJobData }) {
  const { postTaskId } = job.data;

  try {
    const postTask = await prisma.postTask.findUnique({
      where: { id: postTaskId },
      include: {
        mediaItem: {
          include: {
            campaign: {
              include: {
                org: {
                  include: {
                    socials: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!postTask) throw new Error('Post task not found');

    const { mediaItem, platform } = postTask;
    const render = mediaItem.render as any;
    const script = mediaItem.script as any;

    if (!render?.outputUrl) {
      throw new Error('Video not rendered');
    }

    // Find social connection for platform
    const socialConnection = mediaItem.campaign.org.socials.find(
      (s) => s.platform === platform
    );

    if (!socialConnection) {
      throw new Error(`No ${platform} connection found`);
    }

    // Decrypt tokens
    const tokens = decryptToken<DecryptedTokenBundle>(socialConnection.access);

    // Update status to posting
    await prisma.postTask.update({
      where: { id: postTaskId },
      data: { status: PostStatus.POSTING },
    });

    // Post to platform
    const result = await socialPoster.postShort({
      platform,
      tokens,
      videoUrl: render.outputUrl,
      title: script.hook,
      description: `${script.body}\n\n${script.cta}`,
      hashtags: ['shorts', 'viral'],
    });

    // Update with result
    await prisma.postTask.update({
      where: { id: postTaskId },
      data: {
        status: PostStatus.POSTED,
        result: result as any,
      },
    });

    logger.info({ postTaskId, platform, externalId: result.externalId }, 'Video posted');
  } catch (error) {
    logger.error({ error, postTaskId }, 'Video posting failed');

    await prisma.postTask.update({
      where: { id: postTaskId },
      data: {
        status: PostStatus.FAILED,
        result: { error: error instanceof Error ? error.message : 'Unknown error' } as any,
      },
    });

    throw error;
  }
}
