import { createWorker } from './queue';
import {
  handleGenerateScript,
  handleSynthVoiceover,
  handleBuildCaptions,
  handleRenderVideo,
  handleSchedulePosts,
  handlePostVideo,
} from './handlers';

export * from './queue';
export * from './jobs';
export * from './handlers';

export function startWorkers() {
  createWorker('script', handleGenerateScript);
  createWorker('voiceover', handleSynthVoiceover);
  createWorker('captions', handleBuildCaptions);
  createWorker('render', handleRenderVideo);
  createWorker('schedule', handleSchedulePosts);
  createWorker('post', handlePostVideo);
}
