import { QueueProcessor } from './queue';

export function createQueuePool(pool: QueueProcessor[]) {
  return {
    start() {
      pool.forEach(processor => processor.start());
    }
  };
}
