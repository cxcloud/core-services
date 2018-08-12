import { stringify } from 'querystring';
import * as Cache from 'node-cache';
import * as uuid from 'uuid/v4';
import omit = require('lodash/omit');
import {
  methods,
  getConfig,
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
  TokenizedSignInResult,
  PaginatedCustomerResult
} from '@cxcloud/ct-types/customers';
import { UpdateAction, QueryOptions } from '@cxcloud/ct-types/common';
import { encryptTokenResponse, getAnonymousIdFromToken } from '../tools/crypto';
import { getDefaults } from '../tools/query';

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

export function findCustomerById(customerId: string): Promise<Customer> {
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

export namespace Customers {
  function obtainTokenForLoggedInCustomer(
    email: string,
    password: string,
    loginResult: CustomerSignInResult
  ): Promise<TokenizedSignInResult> {
    const config = getConfig();
    const scopes = userScopes
      .map(scope => `${scope}:${config.projectKey}`)
      .join(' ');
    return authenticatedFormRequest<OAuthToken>(
      {
        uri: `${config.authHost}/oauth/${config.projectKey}/customers/token`,
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
    const config = getConfig();
    return authenticatedFormRequest<OAuthToken>({
      uri: `${config.authHost}/oauth/${config.projectKey}/anonymous/token`,
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

  export function fetchAll(
    token: string,
    options: QueryOptions = {}
  ): Promise<PaginatedCustomerResult> {
    const { page, perPage, sortPath, ascending } = getDefaults(options);
    return clientExecute({
      uri: getServices()
        .customers.page(page)
        .perPage(perPage)
        .sort(sortPath, ascending)
        .build(),
      method: methods.GET,
      token
    });
  }

  export function findById(
    customerId: string,
    token: string
  ): Promise<Customer> {
    return clientExecute<Customer>({
      uri: getServices()
        .customers.byId(customerId)
        .build(),
      method: methods.GET,
      token
    });
  }

  export function update(
    customerId: string,
    customerVersion: number,
    actions: UpdateAction[],
    token: string
  ): Promise<Customer> {
    return clientExecute({
      uri: getServices()
        .customers.byId(customerId)
        .build(),
      method: methods.POST,
      token,
      body: {
        version: customerVersion,
        actions
      }
    });
  }

  export function remove(
    customerId: string,
    customerVersion: number,
    token: string
  ): Promise<Customer> {
    return clientExecute({
      uri: getServices()
        .customers.byId(customerId)
        .withVersion(customerVersion)
        .build(),
      method: methods.DELETE,
      token
    });
  }
}
