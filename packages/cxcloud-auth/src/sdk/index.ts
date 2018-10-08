import * as config from 'config';
import { promisify } from 'util';
const CognitoUserPoolWrapper = require('cognito-user-pool');

let __client: any;

export function getClient() {
  if (__client) {
    return __client;
  }
  __client = CognitoUserPoolWrapper({
    UserPoolId: config.get<string>('cognito.userPoolId'),
    ClientId: config.get<string>('cognito.clientId')
  });

  // Get method names
  const methods = Object.getOwnPropertyNames(
    Object.getPrototypeOf(__client)
  ).filter(name => name !== 'constructor');

  // Promisify all methods
  methods.forEach(method => {
    __client[method] = promisify(__client[method]);
  });

  return __client;
}
