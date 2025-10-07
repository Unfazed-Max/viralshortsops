import { prisma } from '@viralshortsops/db';
import { logger } from '@viralshortsops/utils';
import { GenerateScriptJobData } from '../jobs';
import { addJob } from '../queue';

const scriptTemplates = {
  fitness: {
    hook: 'Want to get fit in just {minutes} minutes a day?',
    body: 'Here are {number} proven exercises that actually work. No equipment needed!',
    cta: 'Follow for more fitness tips!',
  },
  crypto: {
    hook: 'Did you know {fact}?',
    body: 'Let me explain why this matters for your crypto portfolio in simple terms.',
    cta: 'Hit follow to stay updated on crypto trends!',
  },
  default: {
    hook: 'Here\'s something you need to know about {topic}',
    body: 'This simple trick will change everything. Pay attention!',
    cta: 'Follow for more valuable tips!',
  },
};

export async function handleGenerateScript(job: { id: string; name: string; data: GenerateScriptJobData }) {
  const { mediaItemId, niche, lang, hook } = job.data;

  try {
    const mediaItem = await prisma.mediaItem.findUnique({ where: { id: mediaItemId } });
    if (!mediaItem) throw new Error('Media item not found');

    // Get template for niche
    const template = scriptTemplates[niche.toLowerCase() as keyof typeof scriptTemplates] || scriptTemplates.default;

    // Generate script with simple variable replacement
    const script = {
      hook: hook || template.hook.replace('{topic}', niche).replace('{minutes}', '5').replace('{fact}', 'Bitcoin uses less energy than banking'),
      body: template.body.replace('{number}', '3').replace('{topic}', niche),
      cta: template.cta,
    };

    // Update media item with script
    await prisma.mediaItem.update({
      where: { id: mediaItemId },
      data: { script: script as any },
    });

    // Trigger next job: voiceover synthesis
    await addJob('voiceover', 'synth-voiceover', {
      mediaItemId,
      script,
      voice: 'default',
      lang,
    });

    logger.info({ mediaItemId, script }, 'Script generated');
  } catch (error) {
    logger.error({ error, mediaItemId }, 'Script generation failed');
    throw error;
  }
}
