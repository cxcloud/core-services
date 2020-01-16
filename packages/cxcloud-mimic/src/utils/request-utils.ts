import { createHash } from 'crypto';
import { Request } from 'express';
import { isEmpty, isObject } from './object-utils';

export interface RequestHash {
  combined: string;
  methodUrl: string;
  body: string;
}

export function createRequestHash(req: Request): RequestHash {
  const body = parseBody(req);
  const methodUrlHash = shortHash(`${req.method} ${req.url}`);
  const bodyHash = body ? shortHash(body) : '';
  return {
    methodUrl: methodUrlHash,
    body: bodyHash,
    combined: `${methodUrlHash}-${bodyHash}`
  };
}

export function shortHash(message: string) {
  return createHash('sha256')
    .update(message)
    .digest('hex')
    .substr(0, 8); // use hash of length 8 which should not collide
}

export function parseBody(req: Request): string {
  const body: any = req.body || '';

  if (typeof body === 'string') {
    return body;
  }

  if (Array.isArray(body)) {
    return JSON.stringify(body);
  }

  if (isObject(body) && !isEmpty(body)) {
    return JSON.stringify(body);
  }

  return '';
}
