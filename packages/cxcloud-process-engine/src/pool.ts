import { QueueProcessor } from './queue';

export function createQueuePool(pool: QueueProcessor[]) {
  return {
    start() {
      pool.forEach(processor => processor.start());
    },
    findByName(name: string): QueueProcessor {
      const processor = pool.find(poolItem => poolItem.options.name === name);
      if (!processor) {
        throw new Error('Processor has not been found');
      }
      return processor;
    }
  };
}
