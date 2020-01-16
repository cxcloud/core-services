import { NextFunction, Request, Response } from 'express';
import { createRequestHash } from '../utils/request-utils';

export const requestHashMiddleWare = () => {
  return (req: Request, resp: Response, next: NextFunction) => {
    resp.locals.requestHash = createRequestHash(req);
    next();
  };
};
