export type S3Url = string;

export interface ScriptParts {
  hook: string;
  body: string;
  cta: string;
}

export interface OverlaySpec {
  type: 'watermark' | 'caption' | 'logo';
  url?: string;
  text?: string;
  position: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface DecryptedTokenBundle {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  scope?: string;
}

// Video generation
export interface VideoProvider {
  createRender(input: {
    script: ScriptParts;
    ttsUrl: string;
    captionsSrt: string;
    overlays?: OverlaySpec[];
    target: { width: number; height: number; fps: number; bitrate: number };
    watermark?: S3Url;
  }): Promise<{ jobId: string }>;
  
  getStatus(jobId: string): Promise<{
    state: 'queued' | 'running' | 'succeeded' | 'failed';
    outputUrl?: S3Url;
    error?: string;
  }>;
}

// TTS
export interface TTSProvider {
  synthesize(input: {
    text: string;
    voice: string;
    lang: string;
    ssml?: boolean;
  }): Promise<{ audioUrl: S3Url }>;
}

// Translation
export interface MTProvider {
  translate(input: {
    text: string;
    from: string;
    to: string;
  }): Promise<{ text: string }>;
}

// Trends
export interface TrendSourceProvider {
  ideas(input: {
    niche: string;
    lang: string;
    limit: number;
  }): Promise<Array<{ title: string; hook: string; keywords: string[] }>>;
}

// Social posting
export interface SocialPoster {
  postShort(input: {
    platform: 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'FACEBOOK';
    tokens: DecryptedTokenBundle;
    videoUrl: S3Url;
    title: string;
    description: string;
    hashtags: string[];
    schedule?: Date;
  }): Promise<{ externalId: string; publishUrl?: string }>;
}
