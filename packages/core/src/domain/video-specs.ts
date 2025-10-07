export interface VideoSpec {
  width: number;
  height: number;
  fps: number;
  bitrate: number;
  duration: number;
}

export const VIDEO_SPECS = {
  SHORTS: {
    width: 1080,
    height: 1920,
    fps: 30,
    bitrate: 8000000, // 8 Mbps
    aspectRatio: '9:16',
  },
} as const;

export const PLATFORM_LIMITS = {
  YOUTUBE: { maxDuration: 60, maxSize: 256 * 1024 * 1024 }, // 60s, 256MB
  TIKTOK: { maxDuration: 60, maxSize: 287 * 1024 * 1024 }, // 60s, 287MB
  INSTAGRAM: { maxDuration: 90, maxSize: 100 * 1024 * 1024 }, // 90s, 100MB
  FACEBOOK: { maxDuration: 60, maxSize: 100 * 1024 * 1024 }, // 60s, 100MB
} as const;
