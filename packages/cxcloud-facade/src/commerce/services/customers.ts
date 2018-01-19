import { stringify } from 'querystring';
import * as Cache from 'node-cache';
import * as uuid from 'uuid/v4';
import omit = require('lodash/omit');
import {
  methods,
  sdkConfig,
  authenticatedFormRequest,
  clientExecute,
  getServices
} from '../sdk';
import {
  AnonymousSignInResult,
  Customer,
  CustomerSignInResult,
  CustomerSignupDraft,
  OAuthToken,
  TokenizedSignInResult
} from '@cxcloud/ct-types/customers';
import {
  encryptTokenResponse,
  getAnonymousIdFromToken,
  getTokenData
} from '../../tools/crypto';

const customerCache = new Cache({
  stdTTL: 60 * 15 // 15 mins
});

const userScopes = [
  'manage_my_orders',
  'manage_my_profile',
  'manage_my_shopping_lists',
  'view_products',
  'manage_my_profile',
  'manage_my_payments'
];

export namespace Customers {
  function obtainTokenForLoggedInCustomer(
    email: string,
    password: string,
    loginResult: CustomerSignInResult
  ): Promise<TokenizedSignInResult> {
    const scopes = userScopes
      .map(scope => `${scope}:${sdkConfig.projectKey}`)
      .join(' ');
    return authenticatedFormRequest<OAuthToken>(
      {
        uri: `${sdkConfig.authHost}/oauth/${sdkConfig.projectKey}/customers/token`,
        method: methods.POST,
        body: stringify({
          grant_type: 'password',
          username: email,
          password,
          scope: scopes
        })
      },
      true
    ).then(tokenResult => ({
      token: encryptTokenResponse(tokenResult, loginResult.customer.id),
      customer: omit(loginResult.customer, ['password']) as Customer,
      cart: loginResult.cart || null
    }));
  }

  export function login(
    email: string,
    password: string,
    token?: string
  ): Promise<TokenizedSignInResult> {
    return clientExecute<CustomerSignInResult>({
      uri: getServices().login.build(),
      method: methods.POST,
      body: {
        email,
        password,
        anonymousId: getAnonymousIdFromToken(token)
      }
    }).then(loginResult =>
      obtainTokenForLoggedInCustomer(email, password, loginResult)
    );
  }

  export function register(
    customerData: CustomerSignupDraft,
    token?: string
  ): Promise<TokenizedSignInResult> {
    return clientExecute<CustomerSignInResult>({
      uri: getServices().customers.build(),
      method: methods.POST,
      body: {
        ...customerData,
        anonymousId: getAnonymousIdFromToken(token)
      }
    }).then(loginResult => {
      const { email, password } = customerData;
      return obtainTokenForLoggedInCustomer(email, password, loginResult);
    });
  }

  export function loginAnonymously(): Promise<AnonymousSignInResult> {
    const anonymousId = uuid();
    return authenticatedFormRequest<OAuthToken>({
      uri: `${sdkConfig.authHost}/oauth/${sdkConfig.projectKey}/anonymous/token`,
      method: methods.POST,
      body: stringify({
        grant_type: 'client_credentials',
        anonymous_id: anonymousId
      })
    }).then(tokenResult => ({
      token: encryptTokenResponse(tokenResult, anonymousId, true),
      anonymousId
    }));
  }

  export function loginAdmin(email: string, password: string): Promise<any> {
    const scopes = ['manage_orders', 'manage_products', 'manage_customers'];
    return authenticatedFormRequest<OAuthToken>({
      uri: `${sdkConfig.authHost}/oauth/token`,
      method: methods.POST,
      body: stringify({
        scope: scopes
          .map(scope => `${scope}:${sdkConfig.projectKey}`)
          .join(' '),
        grant_type: 'password',
        username: email,
        password: password
      })
    }) /* .then(tokenResult => ({})) */;
  }

  export function findById(customerId: string): Promise<Customer> {
    const cached = customerCache.get<Customer>(customerId);
    if (cached) {
      return Promise.resolve(cached);
    }
    return clientExecute<Customer>({
      uri: getServices()
        .customers.byId(customerId)
        .build(),
      method: methods.GET
    }).then(customer => {
      customerCache.set(customer.id, customer);
      return customer;
    });
  }

  export async function findByAuthToken(token: string): Promise<Customer> {
    const { customerId } = getTokenData(token);
    if (!customerId) {
      throw new Error('Invalid token provided, customer not found.');
    }
    return findById(customerId);
  }
}
