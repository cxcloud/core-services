# CXCloud Process Engine Core

A simple helper for using multiple AWS SQS queues at the same time. This tool
provides an easy way to map incoming events to actions.

## Installation and Usage

```sh
npm install @cxcloud/process-engine-core
```

```ts
import {
  createQueueProcessor,
  createQueuePool
} from '@cxcloud/process-engine-core';

const pool = createQueuePool([
  createQueueProcessor(
    {
      name: 'my-sqs-queue',
      concurrency: 2
    },
    [
      {
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
        action: (message, sendMessage) => {
          console.log('Received Message:', message.data);
          message.deleteMessage().then(() => {
            // Next should be called after each message is processed
            message.next();
          });
        }
      }
    ],
    // CatchAll function (for events that don't match any of the processors)
    message => {
      console.error('No processor found');
      message.next();
    }
  ),
  createQueueProcessor(/* ... */),
  createQueueProcessor(/* ... */)
]);

pool.start();
```

## Documentation

### createQueuePool(processors: QueueProcessor[]) ⇒ QueuePool

This function creates a queue pool that can be started at the same time and
queried to access each item.

The resulting `QueuePool` instance has the following methods:

* `start()` — Start all the queue processor instances
* `findByName(name: String) ⇒ QueueProcessor` — Find a queue processor instance
  by it's name

### createQueueProcessor(options, actionMap, fallbackFn) ⇒ QueueProcessor

* `options` (Object)
  * **name** (String) — **_Required_**: name of the remote queue to be watched
  * **region** (String) — the region to send/read service requests. Default is
    `process.env.AWS_REGION`
  * **accessKeyId** (String) — your AWS access key ID. Default is
    `process.env.AWS_ACCESS_KEY`
  * **secretAccessKey** (String) — your AWS secret access key. Default is
    `process.env.AWS_SECRET_KEY`
  * **visibilityTimeout** (Integer) — duration (in seconds) that the received
    messages are hidden from subsequent retrieve requests after being retrieved
    by a ReceiveMessage request.
  * **waitTimeSeconds** (Integer) — duration (in seconds) for which the call
    will wait for a message to arrive in the queue before returning. If a
    message is available, the call will return sooner than WaitTimeSeconds.
    Default is 20
  * **maxNumberOfMessages** (Integer) — maximum number of messages to return.
    Amazon SQS never returns more messages than this value but may return fewer.
    Default is 1
  * **concurrency** (Integer) — number of concurrency fetcher to start. Default
    is 1
  * **debug** (Boolean) — enable debug mode. Default is false
* `actionMap` (Array of `ActionMap`). Each `ActionMap` (Object):

  * **conditions** (Array of Objects) — An array of conditions to meet. All of
    the conditions must be met for the function to be triggered.
    * **path** (String) — Object path (of the received event body)
    * **value** (String) — Value of the object path
  * **action** (Function) — The action function to be called when the conditions
    are met for a received event. Params:

    * **event** (Object) — The received evemt

      * type (String): default is "Message"
      * data (Unknown): JSON.parsed message.Body or a string (if could not be
        parsed)
      * message (Object): reference to the received message
      * name (String): name of the remote queue
      * url (String): url of the connected queue
      * **deleteMessage() ⇒ Promise** (Function):

        Helper to deleteMessage (or `SQS.deleteMessage()`) when the job is
        completed.

      * **changeMessageVisibility(timeout) ⇒ Promise** (Function):

        Helper to changeMessageVisibility (or `SQS.changeMessageVisibility()`)
        when the job is completed.

      * **delay(timeout) ⇒ Promise** (Function):

        Helper to changeMessageVisibility (or `SQS.changeMessageVisibility()`)
        without completing the job.

      * **sendMessage(params = {}) ⇒ Promise** (Function): send a new message in
        the queue
      * **next()** (Function): call this method when you've completed your jobs
        in the event callback.

    * **sendMessage(params = {}) ⇒ Promise** (Function) — A shortcut to send a
      message to the same queue processor that the event came from

* `fallbackFn` — A fallback action in case a message doesn't match any
  conditions. Signature is same as the `action` mentioned above.
