import { QueueProcessor } from './queue';

export class QueuePool {
  private __processors: QueueProcessor[];

  constructor(processors: QueueProcessor[]) {
    this.__processors = processors;
  }

  start() {
    this.__processors.forEach(processor => processor.start());
  }

  findByName(name: string): QueueProcessor {
    const processor = this.__processors.find(
      poolItem => poolItem.options.name === name
    );
    if (!processor) {
      throw new Error('Processor has not been found');
    }
    return processor;
  }
}

export function createQueuePool(processors: QueueProcessor[]): QueuePool {
  return new QueuePool(processors);
}
