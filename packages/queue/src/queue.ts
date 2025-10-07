import { Queue, Worker, QueueEvents } from 'bullmq';
import Redis from 'ioredis';
import { env, logger } from '@viralshortsops/utils';

const connection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const queues = {
  script: new Queue('generate-script', { connection }),
  voiceover: new Queue('synth-voiceover', { connection }),
  captions: new Queue('build-captions', { connection }),
  render: new Queue('render-video', { connection }),
  schedule: new Queue('schedule-posts', { connection }),
  post: new Queue('post-video', { connection }),
};

export type QueueName = keyof typeof queues;

export async function addJob<T>(queueName: QueueName, jobName: string, data: T) {
  const queue = queues[queueName];
  const job = await queue.add(jobName, data, {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 3600, // keep for 1 hour
      count: 100,
    },
    removeOnFail: {
      age: 86400, // keep failed for 24 hours
    },
  });

  logger.info({ queue: queueName, jobId: job.id }, 'Job added to queue');
  return job;
}

export function createWorker<T>(
  queueName: QueueName,
  processor: (job: { id: string; name: string; data: T }) => Promise<void>
) {
  const worker = new Worker(
    queueName,
    async (job) => {
      logger.info({ queue: queueName, jobId: job.id, name: job.name }, 'Processing job');
      await processor(job as { id: string; name: string; data: T });
    },
    {
      connection: connection.duplicate(),
      concurrency: 5,
      limiter: {
        max: 10,
        duration: 1000,
      },
    }
  );

  worker.on('completed', (job) => {
    logger.info({ queue: queueName, jobId: job.id }, 'Job completed');
  });

  worker.on('failed', (job, err) => {
    logger.error({ queue: queueName, jobId: job?.id, error: err }, 'Job failed');
  });

  return worker;
}

export { QueueEvents };
