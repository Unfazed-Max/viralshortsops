import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@viralshortsops/db';
import { addJob } from '@viralshortsops/queue';
import { generateMediaSchema } from '@viralshortsops/contracts';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id;
    const body = await req.json();
    const data = generateMediaSchema.parse(body);

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Create media items
    const mediaItems = [];
    for (let i = 0; i < data.count; i++) {
      const mediaItem = await prisma.mediaItem.create({
        data: {
          campaignId,
          locale: campaign.primaryLang,
          script: {},
          assets: {},
          render: {},
          status: 'PENDING',
        },
      });

      // Start the pipeline
      await addJob('script', 'generate-script', {
        mediaItemId: mediaItem.id,
        niche: campaign.niche,
        lang: campaign.primaryLang,
      });

      mediaItems.push(mediaItem);
    }

    return NextResponse.json({ success: true, items: mediaItems });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
