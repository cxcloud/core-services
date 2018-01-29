import { stringify } from 'querystring';
import { methods, sdkConfig, authenticatedFormRequest } from '../sdk';
import { OAuthToken } from '@cxcloud/ct-types/customers';

export namespace Users {
  export function adminLogin(
    email: string,
    password: string
  ): Promise<OAuthToken> {
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
    });
  }
}
