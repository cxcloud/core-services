# CXCloud Process Engine Core

## Installation and Usage

```sh
npm install @cxcloud/process-engine
```

```ts
import { createQueueProcessor, createQueuePool } from '@cxcloud/process-engine';

const pool = createQueuePool([
  createQueueProcessor({
    name: 'my-sqs-queue',
    concurrency: 2
  }, [
    conditions: [
      {
        path: 'myEvent.name',
        value: 'someValue'
      },
      {
        path: 'customer.type',
        value: 'gold'
      }
    ],
    action: myProcessorFunction
  ]),
  createQueueProcessor(/* ... */),
  createQueueProcessor(/* ... */)
]);

pool.start();
```
