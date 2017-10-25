import { SdkConfig } from './types/sdk';
import 'isomorphic-fetch';

const mergeAuthHeader = (token: string, req: any) => ({
  ...req,
  headers: {
    ...req.headers,
    Authorization: `Bearer ${token}`
  }
});

export const createAuthMiddlewareForIntrospectionFlow = (
  options: SdkConfig
) => {
  let pendingTasks: any[] = [];
  let isFetching = false;

  return (next: any) => async (request: any, response: any) => {
    // If there's an Authorization header already, continue to next middleware
    if (
      (request.headers && request.headers.authorization) ||
      (request.headers && request.headers.Authorization)
    ) {
      return next(request, response);
    }

    const oauthTokenToValidate =
      request.headers && request.headers['X-Custom-OAuth-Token'];

    // If there's no custom oAuth token,
    // we can ignore and go to next middleware
    // so the next middleware can handle auth, like the client credentials flow
    if (!oauthTokenToValidate) {
      return next(request, response);
    }

    // Queue all requests
    pendingTasks.push({ request, response });

    // Wait until the fetch is over
    if (isFetching) {
      return;
    }

    isFetching = true;

    try {
      const basicAuth = new Buffer(
        `${options.god.clientId}:${options.god.clientSecret}`
      ).toString('base64');

      // This refers to the Token Introspection endpoint
      // http://dev.commercetools.com/http-api-authorization.html#oauth2-token-introspection
      const body = `token=${oauthTokenToValidate}`;
      const authResponse = await fetch(`${options.authHost}/oauth/introspect`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Length': Buffer.byteLength(body).toString(),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
      });

      if (!authResponse.ok) {
        return; // handle error
      }

      const {
        active: isTokenValid,
        scope: tokenScopes,
        exp: expiresIn
      } = await authResponse.json();

      if (!isTokenValid) {
        console.log(isTokenValid, tokenScopes, expiresIn);
        return; // handle error here
      }

      // Execute the queued up requests
      const executionQueue = [...pendingTasks];

      // Reset the queue
      isFetching = false;
      pendingTasks = [];

      // Run tasks
      executionQueue.forEach(task =>
        next(mergeAuthHeader(oauthTokenToValidate, task.request), task.response)
      );
    } catch (err) {
      response.reject(err);
    }
  };
};
