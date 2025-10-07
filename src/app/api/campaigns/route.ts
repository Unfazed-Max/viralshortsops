import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const campaigns = await prisma.campaign.findMany({
      where: { userId: session.user.id },
      include: {
        videos: {
          select: {
            id: true,
            status: true,
          },
        },
        _count: {
          select: {
            videos: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ campaigns })
  } catch (error) {
    console.error('Get campaigns error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
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

    const { name, niche, language, description } = await req.json()

    if (!name || !niche) {
      return NextResponse.json(
        { error: 'Name and niche are required' },
        { status: 400 }
      )
    }

    const campaign = await prisma.campaign.create({
      data: {
        userId: session.user.id,
        name,
        niche,
        language: language || 'en',
        description,
      },
    })

    return NextResponse.json({ campaign })
  } catch (error) {
    console.error('Create campaign error:', error)
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}
