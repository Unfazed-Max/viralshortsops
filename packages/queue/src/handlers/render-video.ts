import { prisma, MediaStatus } from '@viralshortsops/db';
import { logger } from '@viralshortsops/utils';
import { FFMPEGVideoProvider, InVideoProvider, SoraProvider } from '@viralshortsops/providers';
import { VIDEO_SPECS } from '@viralshortsops/core';
import { RenderVideoJobData } from '../jobs';
import axios from 'axios';

const providers = {
  ffmpeg: new FFMPEGVideoProvider(),
  invideo: new InVideoProvider(),
  sora: new SoraProvider(process.env.SORA_API_KEY, process.env.ENABLE_SORA === 'true'),
};

export async function handleRenderVideo(job: { id: string; name: string; data: RenderVideoJobData }) {
  const { mediaItemId, provider } = job.data;

  try {
    const mediaItem = await prisma.mediaItem.findUnique({ where: { id: mediaItemId } });
    if (!mediaItem) throw new Error('Media item not found');

    const script = mediaItem.script as any;
    const assets = mediaItem.assets as any;

    if (!assets.ttsUrl || !assets.srtUrl) {
      throw new Error('Missing TTS or SRT assets');
    }

    // Download SRT content
    const srtResponse = await axios.get(assets.srtUrl);
    const srtContent = srtResponse.data;

    // Update status to rendering
    await prisma.mediaItem.update({
      where: { id: mediaItemId },
      data: { status: MediaStatus.RENDERING },
    });

    // Create render job
    const videoProvider = providers[provider];
    const { jobId } = await videoProvider.createRender({
      script,
      ttsUrl: assets.ttsUrl,
      captionsSrt: srtContent,
      target: {
        width: VIDEO_SPECS.SHORTS.width,
        height: VIDEO_SPECS.SHORTS.height,
        fps: VIDEO_SPECS.SHORTS.fps,
        bitrate: VIDEO_SPECS.SHORTS.bitrate,
      },
    });

    // Poll for completion (simplified - in production use webhooks)
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5s intervals

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s

      const status = await videoProvider.getStatus(jobId);

      if (status.state === 'succeeded') {
        await prisma.mediaItem.update({
          where: { id: mediaItemId },
          data: {
            status: MediaStatus.READY,
            render: {
              provider,
              jobId,
              outputUrl: status.outputUrl,
            } as any,
            durationSec: 10, // Estimate
          },
        });

        logger.info({ mediaItemId, outputUrl: status.outputUrl }, 'Video rendered');
        return;
      }

      if (status.state === 'failed') {
        throw new Error(`Render failed: ${status.error}`);
      }

      attempts++;
    }

    throw new Error('Render timeout');
  } catch (error) {
    logger.error({ error, mediaItemId }, 'Video rendering failed');
    
    await prisma.mediaItem.update({
      where: { id: mediaItemId },
      data: { status: MediaStatus.FAILED },
    });

    throw error;
  }
}
