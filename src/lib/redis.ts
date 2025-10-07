import { Redis } from 'ioredis'

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL
  }
  throw new Error('REDIS_URL is not defined')
}

export const redis = new Redis(getRedisUrl())

export async function addToQueue(queue: string, data: any) {
  return await redis.lpush(queue, JSON.stringify(data))
}

export async function getFromQueue(queue: string) {
  const item = await redis.rpop(queue)
  return item ? JSON.parse(item) : null
}

export async function cacheGet(key: string) {
  return await redis.get(key)
}

export async function cacheSet(key: string, value: string, ttl?: number) {
  if (ttl) {
    return await redis.setex(key, ttl, value)
  }
  return await redis.set(key, value)
}
