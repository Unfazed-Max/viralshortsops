import { prisma } from '@viralshortsops/db';
import { logger } from '@viralshortsops/utils';
import { MockTTSProvider } from '@viralshortsops/providers';
import { SynthVoiceoverJobData } from '../jobs';
import { addJob } from '../queue';

const ttsProvider = new MockTTSProvider();

export async function handleSynthVoiceover(job: { id: string; name: string; data: SynthVoiceoverJobData }) {
  const { mediaItemId, script, voice, lang } = job.data;

  try {
    const mediaItem = await prisma.mediaItem.findUnique({ where: { id: mediaItemId } });
    if (!mediaItem) throw new Error('Media item not found');

    // Combine script parts
    const fullText = `${script.hook}. ${script.body}. ${script.cta}`;

    // Generate TTS
    const { audioUrl } = await ttsProvider.synthesize({
      text: fullText,
      voice,
      lang,
      ssml: false,
    });

    // Update media item with assets
    const currentAssets = (mediaItem.assets as any) || {};
    await prisma.mediaItem.update({
      where: { id: mediaItemId },
      data: {
        assets: {
          ...currentAssets,
          ttsUrl: audioUrl,
        } as any,
      },
    });

    // Trigger next job: build captions
    await addJob('captions', 'build-captions', {
      mediaItemId,
      audioUrl,
      script: fullText,
    });

    logger.info({ mediaItemId, audioUrl }, 'Voiceover synthesized');
  } catch (error) {
    logger.error({ error, mediaItemId }, 'Voiceover synthesis failed');
    throw error;
  }
}
