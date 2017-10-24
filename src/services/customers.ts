import { methods, sdkConfig, authenticatedFormRequest } from '../sdk';
import { stringify } from 'querystring';

export namespace Customers {
  export function login(username: string, password: string) {
    const scopes = [
      'manage_my_orders',
      'manage_my_profile',
      'manage_my_shopping_lists',
      'view_products',
      'manage_my_profile',
      'manage_my_payments'
    ]
      .map(scope => `${scope}:${sdkConfig.projectKey}`)
      .join(' ');
    return authenticatedFormRequest({
      uri: `${sdkConfig.authHost}/oauth/${sdkConfig.projectKey}/customers/token`,
      method: methods.POST,
      body: stringify({
        grant_type: 'password',
        username,
        password,
        scope: scopes
      })
    });
  }
}
