import { SdkConfig } from '@cxcloud/ct-types/sdk';
import * as Cache from 'node-cache';
import 'isomorphic-fetch';

type IntrospectionResponse = {
  tokenScopes: string;
  expiresIn: number;
};

type Task = {
  isFetching: boolean;
  tasks: any[];
};

type TaskQueue = {
  [id: string]: Task;
};

const mergeAuthHeader = (token: string, req: any) => ({
  ...req,
  headers: {
    ...req.headers,
    Authorization: `Bearer ${token}`
  }
});

const calculateExpirationTime = (expiresIn: number) =>
  Date.now() + expiresIn * 1000 - 1 * 60 * 60 * 1000; // Add a gap of 1 hour before expiration time.

export const createAuthMiddlewareForIntrospectionFlow = (
  options: SdkConfig
) => {
  let pendingTasks: TaskQueue = {};
  const tokenCache = new Cache();

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

    // Check if the the token is in cache
    // if token exists and is valid, continue,
    // otherwise invalidate the cache and fetch again.
    const cached = tokenCache.get<IntrospectionResponse>(oauthTokenToValidate);
    if (cached) {
      if (Date.now() < cached.expiresIn) {
        return next(mergeAuthHeader(oauthTokenToValidate, request), response);
      }
      // @TODO: handle refresh
      return response.reject(new Error('Token has expired'));
    }

    // Queue all requests with the same OAuthToken
    pendingTasks[oauthTokenToValidate] = pendingTasks[oauthTokenToValidate] || {
      isFetching: false,
      tasks: []
    };
    pendingTasks[oauthTokenToValidate].tasks.push({ request, response });

    // Wait until the fetch is over
    if (pendingTasks[oauthTokenToValidate].isFetching) {
      return;
    }

    pendingTasks[oauthTokenToValidate].isFetching = true;

    try {
      const basicAuth = new Buffer(
        `${options.admin.clientId}:${options.admin.clientSecret}`
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
        // @TODO: handle error here
        return response.reject(new Error('Token is not valid'));
      }

      // Cache the response
      tokenCache.set<IntrospectionResponse>(oauthTokenToValidate, {
        tokenScopes,
        expiresIn: calculateExpirationTime(expiresIn)
      });

      // Execute the queued up requests
      const executionQueue = [...pendingTasks[oauthTokenToValidate].tasks];

      // Reset the queue
      delete pendingTasks[oauthTokenToValidate];

      // Run tasks
      executionQueue.forEach(task =>
        next(mergeAuthHeader(oauthTokenToValidate, task.request), task.response)
      );
    } catch (err) {
      response.reject(err);
    }
  };
};
