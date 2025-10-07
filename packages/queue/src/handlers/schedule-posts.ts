import { prisma, PostStatus } from '@viralshortsops/db';
import { logger } from '@viralshortsops/utils';
import { SchedulePostsJobData } from '../jobs';
import { addJob } from '../queue';

export async function handleSchedulePosts(job: { id: string; name: string; data: SchedulePostsJobData }) {
  const { mediaItemId, platforms } = job.data;

  try {
    const mediaItem = await prisma.mediaItem.findUnique({ where: { id: mediaItemId } });
    if (!mediaItem) throw new Error('Media item not found');

    // Create post tasks
    for (const platform of platforms) {
      const postTask = await prisma.postTask.create({
        data: {
          mediaItemId,
          platform: platform.platform,
          scheduledAt: platform.scheduledAt,
          status: PostStatus.SCHEDULED,
        },
      });

      // Schedule post job
      const delay = new Date(platform.scheduledAt).getTime() - Date.now();
      
      if (delay > 0) {
        await addJob('post', 'post-video', {
          postTaskId: postTask.id,
        });
      } else {
        // Post immediately
        await addJob('post', 'post-video', {
          postTaskId: postTask.id,
        });
      }
    }

    logger.info({ mediaItemId, platformCount: platforms.length }, 'Posts scheduled');
  } catch (error) {
    logger.error({ error, mediaItemId }, 'Post scheduling failed');
    throw error;
  }
}
