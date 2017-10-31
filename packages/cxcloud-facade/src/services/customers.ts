import {
  methods,
  sdkConfig,
  authenticatedFormRequest,
  clientExecute,
  services
} from '../sdk';
import {
  CustomerSignInResult,
  OAuthToken,
  SignInResult,
  Customer
} from '../sdk/types/customers';
import { getCustomerIdFromToken, encryptTokenResponse } from '../tools/crypto';
import { stringify } from 'querystring';
import * as Cache from 'node-cache';
import omit = require('lodash/omit');

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
  export function login(
    username: string,
    password: string
  ): Promise<SignInResult> {
    return clientExecute<CustomerSignInResult>({
      uri: services.login.build(),
      method: methods.POST,
      body: {
        email: username,
        password
      }
    }).then(loginResult => {
      const scopes = userScopes
        .map(scope => `${scope}:${sdkConfig.projectKey}`)
        .join(' ');
      return authenticatedFormRequest<OAuthToken>({
        uri: `${sdkConfig.authHost}/oauth/${sdkConfig.projectKey}/customers/token`,
        method: methods.POST,
        body: stringify({
          grant_type: 'password',
          username,
          password,
          scope: scopes
        })
      }).then(token => ({
        token: encryptTokenResponse(token, loginResult.customer),
        customer: omit(loginResult.customer, ['password']) as Customer,
        cart: loginResult.cart || null
      }));
    });
  }

  export function findById(customerId: string): Promise<Customer> {
    return clientExecute<Customer>({
      uri: services.customers.byId(customerId).build(),
      method: methods.GET
    });
  }

  export async function findByAuthToken(token: string): Promise<Customer> {
    const cached = customerCache.get<Customer>(token);
    if (cached) {
      return cached;
    }
    const customerId = getCustomerIdFromToken(token);
    if (!customerId) {
      throw new Error('Invalid token provided');
    }
    return findById(customerId).then(customer => {
      customerCache.set(token, customer);
      return customer;
    });
  }
}
