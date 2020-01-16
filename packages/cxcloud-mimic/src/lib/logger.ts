import createDebug, { Debugger } from 'debug';
import { NAME } from '../config';

export const log = createDebug(NAME);
export const debug = log.extend('debug');
export const info = log.extend('info');
export const error = log.extend('error');

export const extend = (_logger: Debugger, name: string): Debugger => {
  return _logger.extend(name);
};
