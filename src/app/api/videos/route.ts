import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const videos = await prisma.video.findMany({
      where: {
        campaign: {
          userId: session.user.id,
        },
      },
      include: {
        campaign: {
          select: {
            name: true,
            niche: true,
          },
        },
        posts: {
          select: {
            status: true,
            socialAccount: {
              select: {
                platform: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ videos })
  } catch (error) {
    console.error('Get videos error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { campaignId, title, description, script } = await req.json()

    if (!campaignId || !title || !script) {
      return NextResponse.json(
        { error: 'Campaign ID, title, and script are required' },
        { status: 400 }
      )
    }

    // Verify campaign ownership
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        userId: session.user.id,
      },
    })

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Check quota
    const usage = await prisma.usage.findUnique({
      where: { userId: session.user.id },
    })

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    const video = await prisma.video.create({
      data: {
        campaignId,
        title,
        description,
        script,
        status: 'pending',
      },
    })

    // Add to generation queue
    const { addToQueue } = await import('@/lib/redis')
    await addToQueue('video-generation', {
      videoId: video.id,
      campaignId,
      userId: session.user.id,
    })

    return NextResponse.json({ video })
  } catch (error) {
    console.error('Create video error:', error)
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    )
  }
}
