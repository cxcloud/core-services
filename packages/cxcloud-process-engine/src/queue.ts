import * as SqsQueueParallel from 'sqs-queue-parallel';

export interface QueueOptions {
  name: string;
  visibilityTimeout?: number;
  waitTimeSeconds?: number;
  maxNumberOfMessages?: number;
  concurrency?: number;
  debug?: boolean;
}

export class QueueProcessor {
  private __queue: SqsQueueParallel;
  constructor(options: QueueOptions) {
    this.__queue = new SqsQueueParallel({
      name: options.name,
      visibilityTimeout: options.visibilityTimeout || 0,
      waitTimeSeconds: options.waitTimeSeconds || 20,
      maxNumberOfMessages: options.maxNumberOfMessages || 1,
      concurrency: options.concurrency || 1,
      debug:
        typeof options.debug !== 'boolean'
          ? process.env.NODE_ENV === 'development'
          : options.debug
    });
  }
}

export function createQueueProcessor(queueOptions: QueueOptions) {
  return new QueueProcessor(queueOptions);
}
