import { NextFunction, Request, Response } from 'express';
import expressWinston from 'express-winston';
import { format } from 'winston';
import { MongoDB } from 'winston-mongodb';

export function ratesLoggerMiddleware(
  routeTag: string,
): (req: Request, res: Response, next: NextFunction) => void {
  return expressWinston.logger({
    format: format.combine(format.colorize(), format.json(), format.metadata()),
    meta: true,
    dynamicMeta: () => {
      return {
        routeTag,
      };
    },
    metaField: null,
    transports: [
      new MongoDB({
        db: process.env.MONGO_URL!,
        collection: 'apilogs',
        level: 'info',
        storeHost: true,
        capped: true,
        tryReconnect: true,
        silent: true,
      }),
    ],
  });
}
