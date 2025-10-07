export interface GenerateScriptJobData {
  mediaItemId: string;
  niche: string;
  lang: string;
  hook?: string;
}

export interface SynthVoiceoverJobData {
  mediaItemId: string;
  script: {
    hook: string;
    body: string;
    cta: string;
  };
  voice: string;
  lang: string;
}

export interface BuildCaptionsJobData {
  mediaItemId: string;
  audioUrl: string;
  script: string;
}

export interface RenderVideoJobData {
  mediaItemId: string;
  provider: 'ffmpeg' | 'invideo' | 'sora';
}

export interface SchedulePostsJobData {
  mediaItemId: string;
  platforms: Array<{
    platform: 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'FACEBOOK';
    socialConnectionId: string;
    scheduledAt: Date;
  }>;
}

export interface PostVideoJobData {
  postTaskId: string;
}
