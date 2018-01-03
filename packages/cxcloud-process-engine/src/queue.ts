import { pathOr } from 'ramda';
import { SqsParallel, Config } from 'sqs-parallel';

export interface ActionMapCondition {
  path: string;
  value: string;
}

export interface SendMessageFunction {
  (data: any): Promise<any>;
}

export interface ProcessFunction {
  (eventObj: any, sendMessage: SendMessageFunction): any;
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

  processMessage(message: any) {
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

  sendMessage(body: any): Promise<any> {
    return this.__queue.sendMessage({
      body
    });
  }
}

export function createQueueProcessor(
  queueOptions: Config,
  map: ActionMapItem[],
  catchAll?: ProcessFunction
) {
  return new QueueProcessor(queueOptions, map, catchAll);
}
