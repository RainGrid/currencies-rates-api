import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import HttpStatus from 'http-status-codes';
import { ApiError } from '../../errors';
import { ApiKey } from '../apikeys/apiKeyModel';

interface RequestWithApiKey extends Request {
  apiKey: ApiKey;
}

function rateLimitsKeyGenerator(req: RequestWithApiKey): string {
  return req.apiKey.key;
}

function rateLimitsHandler(
  _req: RequestWithApiKey,
  _res: Response,
  next: NextFunction,
): void {
  return next(
    new ApiError(
      HttpStatus.TOO_MANY_REQUESTS,
      HttpStatus.getStatusText(HttpStatus.TOO_MANY_REQUESTS),
    ),
  );
}

export const convertLimiterMiddleware = rateLimit({
  windowMs: 1000,
  max: 1,
  keyGenerator: rateLimitsKeyGenerator,
  handler: rateLimitsHandler,
});

export const latestLimiterMiddleware = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 2000,
  keyGenerator: rateLimitsKeyGenerator,
  handler: rateLimitsHandler,
});
