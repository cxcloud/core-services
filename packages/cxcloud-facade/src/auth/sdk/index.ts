import * as config from 'config';
import * as pify from 'pify';
const CognitoUserPoolWrapper = require('cognito-user-pool');

let __client: any;

export function getClient() {
  if (__client) {
    return __client;
  }
  __client = pify(
    CognitoUserPoolWrapper({
      UserPoolId: config.get<string>('cognito.userPoolId'),
      ClientId: config.get<string>('cognito.clientId')
    })
  );
  return __client;
}
