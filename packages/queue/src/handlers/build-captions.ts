import { prisma } from '@viralshortsops/db';
import { logger } from '@viralshortsops/utils';
import { uploadFile } from '@viralshortsops/providers';
import { BuildCaptionsJobData } from '../jobs';
import { addJob } from '../queue';
import { v4 as uuidv4 } from 'uuid';

function generateSRT(text: string, durationSec: number): string {
  // Simple SRT generation - split text into chunks
  const words = text.split(' ');
  const wordsPerSubtitle = 5;
  const subtitles: string[] = [];

  for (let i = 0; i < words.length; i += wordsPerSubtitle) {
    const chunk = words.slice(i, i + wordsPerSubtitle).join(' ');
    const index = Math.floor(i / wordsPerSubtitle) + 1;
    const startTime = (i / words.length) * durationSec;
    const endTime = ((i + wordsPerSubtitle) / words.length) * durationSec;

    subtitles.push(
      `${index}\n${formatSRTTime(startTime)} --> ${formatSRTTime(endTime)}\n${chunk}\n`
    );
  }

  return subtitles.join('\n');
}

function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

export async function handleBuildCaptions(job: { id: string; name: string; data: BuildCaptionsJobData }) {
  const { mediaItemId, script } = job.data;

  try {
    const mediaItem = await prisma.mediaItem.findUnique({ where: { id: mediaItemId } });
    if (!mediaItem) throw new Error('Media item not found');

    // Generate SRT (estimate 10 seconds duration for now)
    const srtContent = generateSRT(script, 10);

    // Upload SRT to S3
    const srtKey = `captions/${uuidv4()}.srt`;
    const srtUrl = await uploadFile(srtKey, Buffer.from(srtContent), 'text/plain');

    // Update media item with SRT
    const currentAssets = (mediaItem.assets as any) || {};
    await prisma.mediaItem.update({
      where: { id: mediaItemId },
      data: {
        assets: {
          ...currentAssets,
          srtUrl,
        } as any,
      },
    });

    // Trigger next job: render video
    await addJob('render', 'render-video', {
      mediaItemId,
      provider: 'ffmpeg',
    });

    logger.info({ mediaItemId, srtUrl }, 'Captions built');
  } catch (error) {
    logger.error({ error, mediaItemId }, 'Caption building failed');
    throw error;
  }
}
