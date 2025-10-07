import { z } from 'zod';

export const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().optional(),
  
  // Redis
  REDIS_URL: z.string().url().optional(),
  
  // S3 Storage
  S3_ENDPOINT: z.string().url().optional(),
  S3_REGION: z.string().default('us-east-1'),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  
  // Auth
  AUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRO_PRICE_ID: z.string().optional(),
  STRIPE_TEAM_PRICE_ID: z.string().optional(),
  
  // External APIs (Optional)
  INVIDEO_API_KEY: z.string().optional(),
  SORA_API_KEY: z.string().optional(),
  TTS_API_KEY: z.string().optional(),
  ELEVENLABS_API_KEY: z.string().optional(),
  
  // Feature Flags
  ENABLE_SORA: z.string().transform(val => val === 'true').default('false'),
  
  // Observability
  SENTRY_DSN: z.string().optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
  
  // Social Platform OAuth
  YOUTUBE_CLIENT_ID: z.string().optional(),
  YOUTUBE_CLIENT_SECRET: z.string().optional(),
  TIKTOK_CLIENT_ID: z.string().optional(),
  TIKTOK_CLIENT_SECRET: z.string().optional(),
  INSTAGRAM_CLIENT_ID: z.string().optional(),
  INSTAGRAM_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_CLIENT_ID: z.string().optional(),
  FACEBOOK_CLIENT_SECRET: z.string().optional(),
  
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment variables');
  }
  
  return result.data;
}

// Only validate in runtime, not during build
export const env = process.env.NODE_ENV !== 'production' || process.env.SKIP_ENV_VALIDATION 
  ? (process.env as any as Env)
  : validateEnv();
