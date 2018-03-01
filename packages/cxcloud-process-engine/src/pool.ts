import { QueueProcessor } from './queue';

export class QueuePool {
  private __processors: QueueProcessor[];
  private started = false;

  constructor(processors: QueueProcessor[]) {
    this.__processors = processors;
  }

  setProcessors(processors: QueueProcessor[]) {
    this.__processors = processors;
  }

  add(processor: QueueProcessor) {
    if (this.started) {
      processor.start();
    }
    this.__processors.push(processor);
  }

  start() {
    this.__processors.forEach(processor => processor.start());
    this.started = true;
  }

  findByName(name: string): QueueProcessor {
    const processor = this.__processors.find(
      poolItem => poolItem.options.name === name
    );
    if (!processor) {
      throw new Error(`Processor ${name} has not been found`);
    }
    return processor;
  }
}

export function createQueuePool(processors: QueueProcessor[]): QueuePool {
  return new QueuePool(processors);
}
