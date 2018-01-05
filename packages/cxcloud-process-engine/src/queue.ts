import { pathOr } from 'ramda';
import { SqsParallel, Config, Message, OutgoingMessage } from 'sqs-parallel';
import { SQS } from 'aws-sdk';

export interface ActionMapCondition {
  path: string;
  value: string;
}

export interface SendMessageFunction {
  (params: OutgoingMessage): Promise<any>;
}

export interface ProcessFunction {
  (message: Message, sendMessage: SendMessageFunction): any;
}

export interface ActionMapItem {
  conditions: ActionMapCondition[];
  action: ProcessFunction;
}

export class QueueProcessor {
  private __queue: SqsParallel;
  private __map: ActionMapItem[];
  private __options: Config;
  private __catchAll: ProcessFunction;

  constructor(
    options: Config,
    map: ActionMapItem[],
    catchAll?: ProcessFunction
  ) {
    this.__options = options;
    this.__map = map;
    this.__catchAll = typeof catchAll === 'function' ? catchAll : e => e.next();
  }

  get options() {
    return this.__options;
  }

  start() {
    this.__queue = new SqsParallel({
      ...this.__options,
      debug:
        typeof this.__options.debug !== 'boolean'
          ? process.env.NODE_ENV === 'development'
          : this.__options.debug
    });
    this.__queue.on('message', message => this.processMessage(message));
    this.__queue.on('error', err => this.handleError(err));
  }

  processMessage(message: Message) {
    const processorFn = this.findActionProcessor(message.data);
    return processorFn(message, body => this.sendMessage(body));
  }

  handleError(err: any) {
    // @TODO: hook up a logger
    console.error(err);
  }

  findActionProcessor(message: any): ProcessFunction {
    const item = this.__map.find(mapItem => {
      return mapItem.conditions.every(
        condition =>
          pathOr(null, condition.path.split('.'), message) === condition.value
      );
    });
    if (item) {
      return item.action;
    }
    // Fallback to catchAll processor
    return this.__catchAll;
  }

  sendMessage(params: OutgoingMessage): Promise<SQS.SendMessageResult> {
    return this.__queue.sendMessage(params);
  }
}

export function createQueueProcessor(
  queueOptions: Config,
  map: ActionMapItem[],
  catchAll?: ProcessFunction
) {
  return new QueueProcessor(queueOptions, map, catchAll);
}
