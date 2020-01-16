import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response, Router } from 'express';
import createError from 'http-errors';
import { log } from './lib/logger';
import { requestHashMiddleWare } from './middlewares/request-hash';
import { requestLoggerMiddleware } from './middlewares/request-logger';
import { parseXML } from './utils/xml-parser';

export interface Options {
  templateDir: string;
}

export interface Output {
  app: express.Express;
  router: express.Router;
}

export function createApp({ templateDir }: Options): Output {
  const app: express.Express = express();

  // view engine setup
  // tslint:disable-next-line: no-console
  log(`Template dir: ${templateDir}`);
  app.set('views', templateDir);
  app.set('view engine', 'ejs');
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Middleware to log incoming request
  app.use(requestLoggerMiddleware());

  // Handle xml content type
  app.use(
    bodyParser.text({
      type: '*/xml'
    })
  );

  // Middleware to parse xml to jsondocument
  app.use((req: Request, resp: Response, next: NextFunction) => {
    const contentType: string = req.headers['content-type'] || '';

    if (contentType.match(/\/xml(;.+)?$/)) {
      resp.locals.xmlJson = parseXML(
        {
          attrNodeName: false,
          ignoreNameSpace: true
        },
        req.body
      );
    }
    next();
  });

  // Middleware to create hashes from request attributes
  app.use(requestHashMiddleWare());

  const router = Router();
  app.use('/', router);

  // Response default /health route
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      health: 'OK'
    });
  });

  // catch 404 and forward to error handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
  });

  // error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // render the error page
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: req.app.get('env') === 'development' ? err : {}
    });
  });

  return {
    app,
    router
  };
}
