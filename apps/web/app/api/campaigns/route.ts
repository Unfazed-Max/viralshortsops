import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@viralshortsops/db';
import { createCampaignSchema } from '@viralshortsops/contracts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createCampaignSchema.parse(body);

    // TODO: Get orgId from session/params
    const orgId = 'temp-org-id';

    const campaign = await prisma.campaign.create({
      data: {
        orgId,
        name: data.name,
        niche: data.niche,
        primaryLang: data.primaryLang,
        config: data.config as any,
        status: 'DRAFT',
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // TODO: Get orgId from session
    const orgId = 'temp-org-id';

    const campaigns = await prisma.campaign.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
