import { OAuthToken, EncryptedTokenData } from '../sdk/types/customers';
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
  try {
    const tokenParts = decrypt(encryptedToken).split(':');

    if (tokenParts.length !== 3) {
      throw new Error('Invalid token data.');
    }
    const [customerId, authToken, isAnonymous] = tokenParts;
    return {
      customerId,
      authToken,
      isAnonymous: Boolean(Number(isAnonymous))
    };
  } catch (err) {
    throw new Error(
      'Invalid token provided. The encrypted content has been tampered with.'
    );
  }
}

export function encryptTokenResponse(
  token: OAuthToken,
  customerId: string,
  isAnonymous = false
): OAuthToken {
  return {
    ...token,
    access_token: encrypt(
      `${customerId}:${token.access_token}:${isAnonymous ? 1 : 0}`
    )
  };
}

export function getAnonymousIdFromToken(token?: string): string | null {
  let anonymousId: string | null = null;

  if (token) {
    try {
      const { customerId, isAnonymous } = getTokenData(token);
      if (isAnonymous) {
        anonymousId = customerId;
      }
    } catch (err) {
      // NOOP
    }
  }
  return anonymousId;
}
