import * as config from 'config';

const { createClient } = require('@commercetools/sdk-client');
const { createAuthMiddlewareForClientCredentialsFlow } = require('@commercetools/sdk-middleware-auth');
const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http');
const { createQueueMiddleware } = require('@commercetools/sdk-middleware-queue');
const { createUserAgentMiddleware } = require('@commercetools/sdk-middleware-user-agent');
const { createRequestBuilder } = require('@commercetools/api-request-builder');

const packageInfo = require('../../package.json');
const commerceToolsConfig = config.get<{
  projectKey: string;
  clientId: string;
  clientSecret: string;
}>('commerceTools');

export const client = createClient({
  middlewares: [
    createAuthMiddlewareForClientCredentialsFlow({
      host: 'https://auth.sphere.io',
      projectKey: commerceToolsConfig.projectKey,
      credentials: {
        clientId: commerceToolsConfig.clientId,
        clientSecret: commerceToolsConfig.clientSecret
      }
    }),
    createQueueMiddleware({ concurrency: 10 }),
    createHttpMiddleware({ host: 'https://api.sphere.io' }),
    createUserAgentMiddleware({
      libraryName: packageInfo.name,
      libraryVersion: packageInfo.version,
      contactUrl: packageInfo.homepage,
      contactEmail: 'cxcloud@tieto.com'
    })
  ]
});

export const services = createRequestBuilder({
  projectKey: 'upm-shopit-dev-1'
});

export function execute(serviceUri: any, method: string) {
  return client
    .execute({
      uri: serviceUri.build(),
      method
    })
    .then((result: any) => result.body);
}

export function process(serviceUri: any, method: string) {
  return client.process(
    {
      uri: serviceUri.build(),
      method
    },
    async (payload: any) => payload.body.results
  );
}

export enum methods {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}
