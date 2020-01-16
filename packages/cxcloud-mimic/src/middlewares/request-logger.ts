import chalk from 'chalk';
import { Request, Response } from 'express';
import morgan from 'morgan';
import { isEmpty, isObject } from '../utils/object-utils';
import { RequestHash } from '../utils/request-utils';

export function requestLoggerMiddleware() {
  // Define custom token for method
  morgan.token('method', req => {
    const method = req.method;
    switch (method) {
      case 'POST':
      case 'PUT':
      case 'PATCH':
        return chalk.cyan(req.method);
      case 'GET':
        return chalk.green(req.method);
      case 'DELETE':
        return chalk.red(req.method);
    }
    return chalk.blue(req.method);
  });

  // Define custom token for status
  morgan.token('status', (req, res) => {
    const status = res.statusCode;

    if (status >= 500) {
      return chalk.red(status);
    } else if (status >= 400) {
      return chalk.yellowBright(status);
    } else if (status >= 300) {
      return chalk.greenBright(status);
    } else if (status >= 200) {
      return chalk.greenBright(status);
    }

    return chalk.gray(status);
  });

  // Define custom token for request hash
  morgan.token('hash', (_, res) => {
    return res.locals.requestHash.combined;
  });

  return morgan(formatFunction);
}

function formatFunction(tokens: any, req: Request, res: Response): string {
  const date = '[' + tokens.date(req, res, 'clf') + ']';
  const hash = chalk.green('(' + tokens.hash(req, res) + ')');

  const logs = [];

  logs.push(
    [
      date,
      hash,
      tokens.method(req, res),
      chalk.magentaBright(tokens.url(req, res)),
      chalk.gray('-'),
      tokens.status(req, res),
      chalk.gray(tokens['response-time'](req, res, 2) + 'ms')
    ].join(' ')
  );

  logs.push(
    [
      date,
      hash,
      'Request headers:\n' +
        chalk.blueBright(JSON.stringify(req.headers, null, 2))
    ].join(' ')
  );

  const body = parseBody(req.body);
  if (body) {
    logs.push([date, hash, 'Request body:\n' + chalk.cyan(body)].join(' '));
  }
  return logs.join('\n');
}

function parseBody(body: any): string | undefined {
  if (typeof body === 'string') {
    return body;
  }

  if ((isObject(body) && !isEmpty(body)) || Array.isArray(body)) {
    return JSON.stringify(body, null, 2);
  }
}
