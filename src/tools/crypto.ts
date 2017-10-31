import {
  Customer,
  OAuthToken,
  EncryptedTokenData
} from '../sdk/types/customers';
import * as crypto from 'crypto';

const ENCRYPTION_KEY = 'wY[Ax)FC0AlQjruD$9J_tO3U+YiMZyL1'; // @TODO: REMOVE
const IV_LENGTH = 16;
const TEXT_SEPARATOR = ':';

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    new Buffer(ENCRYPTION_KEY),
    iv
  );

  let encrypted = cipher.update(new Buffer(text));
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('base64') + TEXT_SEPARATOR + encrypted.toString('base64');
}

export function decrypt(text: string): string {
  const [ivStr, encryptedStr] = text.split(TEXT_SEPARATOR);
  const iv = new Buffer(ivStr, 'base64');
  const encryptedText = new Buffer(encryptedStr, 'base64');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    new Buffer(ENCRYPTION_KEY),
    iv
  );

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

export function getTokenData(encryptedToken: string): EncryptedTokenData {
  let [customerId, authToken] = decrypt(encryptedToken).split(':');
  if (!authToken) {
    return {
      authToken: customerId,
      customerId: null
    };
  }
  return {
    customerId,
    authToken
  };
}

export function encryptTokenResponse(
  token: OAuthToken,
  customer: Customer
): OAuthToken {
  return {
    ...token,
    access_token: encrypt(`${customer.id}:${token.access_token}`)
  };
}
