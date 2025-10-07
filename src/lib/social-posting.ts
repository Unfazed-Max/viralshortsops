import { prisma } from './prisma'

interface PostToSocialOptions {
  videoId: string
  socialAccountId: string
  scheduledAt?: Date
}

export async function postToSocial({ videoId, socialAccountId, scheduledAt }: PostToSocialOptions) {
  try {
    const [video, socialAccount] = await Promise.all([
      prisma.video.findUnique({ where: { id: videoId } }),
      prisma.socialAccount.findUnique({ where: { id: socialAccountId } }),
    ])

    if (!video || !socialAccount) {
      throw new Error('Video or social account not found')
    }

    if (!video.videoUrl) {
      throw new Error('Video URL not available')
    }

    const post = await prisma.post.create({
      data: {
        videoId,
        socialAccountId,
        status: scheduledAt ? 'scheduled' : 'posting',
        scheduledAt,
      },
    })

    if (!scheduledAt) {
      // Post immediately
      await executePost(post.id, video.videoUrl, socialAccount.platform, socialAccount.accessToken, video.title, video.description)
    }

    return { success: true, postId: post.id }
  } catch (error) {
    console.error('Post to social error:', error)
    return { success: false, error }
  }
}

async function executePost(
  postId: string,
  videoUrl: string,
  platform: string,
  accessToken: string,
  title: string,
  description?: string | null
) {
  try {
    await prisma.post.update({
      where: { id: postId },
      data: { status: 'posting' },
    })

    let platformPostId: string | undefined
    let postUrl: string | undefined

    switch (platform) {
      case 'youtube':
        ({ platformPostId, postUrl } = await postToYouTube(videoUrl, accessToken, title, description || ''))
        break
      case 'tiktok':
        ({ platformPostId, postUrl } = await postToTikTok(videoUrl, accessToken, title, description || ''))
        break
      case 'instagram':
        ({ platformPostId, postUrl } = await postToInstagram(videoUrl, accessToken, title, description || ''))
        break
      default:
        throw new Error(`Unsupported platform: ${platform}`)
    }

    await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'posted',
        platformPostId,
        postUrl,
        postedAt: new Date(),
      },
    })

    return { success: true }
  } catch (error) {
    await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })
    throw error
  }
}

async function postToYouTube(videoUrl: string, accessToken: string, title: string, description: string) {
  // TODO: Implement YouTube API integration
  // Using YouTube Data API v3
  console.log('Posting to YouTube:', { videoUrl, title })
  return { platformPostId: 'yt-' + Date.now(), postUrl: 'https://youtube.com/watch?v=placeholder' }
}

async function postToTikTok(videoUrl: string, accessToken: string, title: string, description: string) {
  // TODO: Implement TikTok API integration
  console.log('Posting to TikTok:', { videoUrl, title })
  return { platformPostId: 'tt-' + Date.now(), postUrl: 'https://tiktok.com/@user/video/placeholder' }
}

async function postToInstagram(videoUrl: string, accessToken: string, title: string, description: string) {
  // TODO: Implement Instagram API integration (Reels)
  console.log('Posting to Instagram:', { videoUrl, title })
  return { platformPostId: 'ig-' + Date.now(), postUrl: 'https://instagram.com/reel/placeholder' }
}

export async function refreshAccessToken(socialAccountId: string) {
  const account = await prisma.socialAccount.findUnique({
    where: { id: socialAccountId },
  })

  if (!account?.refreshToken) {
    throw new Error('No refresh token available')
  }

  // TODO: Implement token refresh for each platform
  // This depends on the OAuth flow for each platform
  
  return { success: true }
}
