import * as SqsQueueParallel from 'sqs-queue-parallel';
import { pathOr } from 'ramda';

export interface QueueOptions {
  name: string;
  visibilityTimeout?: number;
  waitTimeSeconds?: number;
  maxNumberOfMessages?: number;
  concurrency?: number;
  debug?: boolean;
}

export interface ActionMapCondition {
  path: string;
  value: string;
}

export interface SendMessageFunction {
  (data: any): Promise<any>;
}

export interface ActionMapFunction {
  (eventObj: any, sendMessage: SendMessageFunction): boolean;
}

export interface ActionMapItem {
  conditions: ActionMapCondition[];
  action: ActionMapFunction;
}

export class QueueProcessor {
  private __queue: SqsQueueParallel;
  private __map: ActionMapItem[];

  constructor(options: QueueOptions, map: ActionMapItem[]) {
    this.__map = map;
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
    this.__queue.on('message', message => this.processMessage(message));
    this.__queue.on('error', err => this.handleError(err));
  }

  processMessage(message: any) {
    const processorFn = this.findActionProcessor(message.data);
    if (processorFn) {
      return processorFn(message.data, body => this.sendMessage(body));
    }
    this.handleError(new Error('Processor not found for message'));
  }

  handleError(err) {
    // @TODO: hook up a logger
    console.error(err);
  }

  findActionProcessor(message: any): ActionMapFunction | undefined {
    const item = this.__map.find(mapItem => {
      return mapItem.conditions.every(
        condition =>
          pathOr(null, condition.path.split('.'), message) === condition.value
      );
    });
    if (item) {
      return item.action;
    }
    return;
  }

  sendMessage(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.__queue.sendMessage(
        {
          body
        },
        (err, info) => {
          if (err) {
            return reject(err);
          }
          return resolve(info);
        }
      );
    });
  }
}

export function createQueueProcessor(
  queueOptions: QueueOptions,
  map: ActionMapItem[]
) {
  return new QueueProcessor(queueOptions, map);
}
