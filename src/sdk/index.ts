import * as config from 'config';
import 'isomorphic-fetch';

import { ClientRequest, SdkConfig } from './types/sdk';

const { createClient } = require('@commercetools/sdk-client');
const { createAuthMiddlewareForClientCredentialsFlow } = require('@commercetools/sdk-middleware-auth');
const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http');
const { createQueueMiddleware } = require('@commercetools/sdk-middleware-queue');
const { createUserAgentMiddleware } = require('@commercetools/sdk-middleware-user-agent');
const { createRequestBuilder } = require('@commercetools/api-request-builder');
// const {
//   createLoggerMiddleware
// } = require('@commercetools/sdk-middleware-logger');

import { createAuthMiddlewareForIntrospectionFlow } from './introspection-middleware';

if (!config.has('commerceTools')) {
  throw new Error('Project has not been configured yet. Check docs first.');
}

const packageInfo = require('../../package.json');
export const sdkConfig = config.get<SdkConfig>('commerceTools');

export const client = createClient({
  middlewares: [
    createAuthMiddlewareForIntrospectionFlow(sdkConfig),
    createAuthMiddlewareForClientCredentialsFlow({
      host: sdkConfig.authHost,
      projectKey: sdkConfig.projectKey,
      credentials: {
        clientId: sdkConfig.god.clientId,
        clientSecret: sdkConfig.god.clientSecret
      }
    }),
    createQueueMiddleware({ concurrency: 10 }),
    createHttpMiddleware({ host: sdkConfig.apiHost }),
    createUserAgentMiddleware({
      libraryName: packageInfo.name,
      libraryVersion: packageInfo.version,
      contactUrl: packageInfo.homepage,
      contactEmail: 'cxcloud@tieto.com'
    })
    // createLoggerMiddleware()
  ]
});

export const services = createRequestBuilder({
  projectKey: sdkConfig.projectKey
});

export function clientExecute(request: ClientRequest) {
  return client.execute(request).then((result: any) => result.body);
}

export function clientProcess(request: ClientRequest) {
  return client.process(request, async (payload: any) => payload.body.results);
}

export enum methods {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export function authenticatedFormRequest(requestOptions: any): Promise<any> {
  const basicAuth = new Buffer(`${sdkConfig.user.clientId}:${sdkConfig.user.clientSecret}`).toString('base64');
  const { uri, ...options } = requestOptions;
  const defaultOptions = {
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Length': Buffer.byteLength(options.body).toString(),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  return fetch(
    new Request(uri, {
      ...defaultOptions,
      ...options
    })
  ).then(res => res.json());
}
