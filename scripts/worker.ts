#!/usr/bin/env node

/**
 * Background Worker for Processing Video Generation Queue
 * 
 * This worker continuously polls the Redis queue for video generation jobs
 * and processes them in the background.
 * 
 * Usage: node scripts/worker.js
 */

import { getFromQueue } from '../src/lib/redis'
import { generateVideo } from '../src/lib/video-generation'
import { prisma } from '../src/lib/prisma'

const QUEUE_NAME = 'video-generation'
const POLL_INTERVAL = 5000 // 5 seconds

async function processQueue() {
  console.log('Worker started. Polling queue:', QUEUE_NAME)

  while (true) {
    try {
      const job = await getFromQueue(QUEUE_NAME)

      if (job) {
        console.log('Processing job:', job)
        
        const { videoId, campaignId, userId } = job

        // Get video details
        const video = await prisma.video.findUnique({
          where: { id: videoId },
        })

        if (!video) {
          console.error('Video not found:', videoId)
          continue
        }

        // Generate video
        const result = await generateVideo({
          videoId: video.id,
          script: video.script,
          title: video.title,
        })

        if (result.success) {
          console.log('Video generated successfully:', result.videoUrl)
          
          // Update usage
          await prisma.usage.update({
            where: { userId },
            data: {
              videosGenerated: {
                increment: 1,
              },
            },
          })
        } else {
          console.error('Video generation failed:', result.error)
        }
      } else {
        // No jobs in queue, wait before polling again
        await sleep(POLL_INTERVAL)
      }
    } catch (error) {
      console.error('Worker error:', error)
      await sleep(POLL_INTERVAL)
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Worker shutting down...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('Worker shutting down...')
  process.exit(0)
})

// Start the worker
processQueue().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
