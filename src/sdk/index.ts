import * as config from 'config';
import 'isomorphic-fetch';

import { ClientRequest, SdkConfig } from '@cxcloud/ct-types/sdk';

const { createClient } = require('@commercetools/sdk-client');
const { createAuthMiddlewareForClientCredentialsFlow } = require('@commercetools/sdk-middleware-auth');
const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http');
const { createQueueMiddleware } = require('@commercetools/sdk-middleware-queue');
const { createUserAgentMiddleware } = require('@commercetools/sdk-middleware-user-agent');
const { createRequestBuilder, features } = require('@commercetools/api-request-builder');
const { createLoggerMiddleware } = require('@commercetools/sdk-middleware-logger');

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
        clientId: sdkConfig.admin.clientId,
        clientSecret: sdkConfig.admin.clientSecret
      }
    }),
    createQueueMiddleware({ concurrency: 10 }),
    createHttpMiddleware({ host: sdkConfig.apiHost }),
    createUserAgentMiddleware({
      libraryName: packageInfo.name,
      libraryVersion: packageInfo.version,
      contactUrl: packageInfo.homepage,
      contactEmail: 'cxcloud@tieto.com'
    }),
    createLoggerMiddleware()
  ]
});

export const services = createRequestBuilder({
  projectKey: sdkConfig.projectKey,
  customServices: {
    login: {
      type: 'login',
      endpoint: '/login',
      features: [features.query]
    }
  }
});

function createClientRequest(request: ClientRequest): ClientRequest {
  const { token, ...rest } = request;
  if (token) {
    return {
      headers: {
        'X-Custom-OAuth-Token': token
      },
      ...rest
    };
  }
  return request;
}

export function clientExecute<T>(request: ClientRequest): Promise<T> {
  return client.execute(createClientRequest(request)).then((result: any) => result.body);
}

export function clientProcess<T>(request: ClientRequest): Promise<T> {
  return client.process(createClientRequest(request), async (payload: any) => payload.body.results);
}

export enum methods {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export function authenticatedFormRequest<T>(requestOptions: any, user = false): Promise<T> {
  const basicAuthCredentials = user
    ? `${sdkConfig.user.clientId}:${sdkConfig.user.clientSecret}`
    : `${sdkConfig.admin.clientId}:${sdkConfig.admin.clientSecret}`;
  const basicAuth = new Buffer(basicAuthCredentials).toString('base64');
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
