import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '@viralshortsops/utils';

const s3Client = new S3Client({
  endpoint: env.S3_ENDPOINT || 'http://localhost:9000',
  region: env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID || 'minioadmin',
    secretAccessKey: env.S3_SECRET_ACCESS_KEY || 'minioadmin',
  },
  forcePathStyle: true, // needed for MinIO
});

export async function uploadFile(
  key: string,
  body: Buffer | ReadableStream,
  contentType: string
): Promise<string> {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET || 'viralshortsops',
      Key: key,
      Body: body as Buffer,
      ContentType: contentType,
    })
  );

  return `${env.S3_ENDPOINT || 'http://localhost:9000'}/${env.S3_BUCKET || 'viralshortsops'}/${key}`;
}

export async function getSignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET || 'viralshortsops',
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

export function getPublicUrl(key: string): string {
  return `${env.S3_ENDPOINT || 'http://localhost:9000'}/${env.S3_BUCKET || 'viralshortsops'}/${key}`;
}
