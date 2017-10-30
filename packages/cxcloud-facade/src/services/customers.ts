import {
  methods,
  sdkConfig,
  authenticatedFormRequest,
  clientExecute,
  services
} from '../sdk';
import {
  CustomerSignInResult,
  CustomerTokenResponse,
  SignInResult,
  Customer
} from '../sdk/types/customers';
import { stringify } from 'querystring';
import omit = require('lodash/omit');

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
      return authenticatedFormRequest<CustomerTokenResponse>({
        uri: `${sdkConfig.authHost}/oauth/${sdkConfig.projectKey}/customers/token`,
        method: methods.POST,
        body: stringify({
          grant_type: 'password',
          username,
          password,
          scope: scopes
        })
      }).then(token => ({
        token,
        customer: omit(loginResult.customer, ['password']) as Customer,
        cart: loginResult.cart || null
      }));
    });
  }
}
