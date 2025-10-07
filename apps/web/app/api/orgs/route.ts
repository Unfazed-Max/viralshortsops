import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@viralshortsops/db';
import { createOrgSchema } from '@viralshortsops/contracts';
import { getQuotasForPlan } from '@viralshortsops/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createOrgSchema.parse(body);

    // TODO: Get user from session
    const userId = 'temp-user-id'; // Replace with actual auth

    // Create org
    const org = await prisma.org.create({
      data: {
        name: data.name,
        slug: data.slug,
        ownerId: userId,
        quotas: getQuotasForPlan('FREE') as any,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
    });

    return NextResponse.json(org);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
