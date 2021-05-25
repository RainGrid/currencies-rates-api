import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { ApiError } from '../../errors';
import { ApiKey } from './apiKeyModel';
import { getApiKey } from './apiKeysController';

interface RequestWithApiKey extends Request {
  apiKey: ApiKey;
}

export async function apiKeyMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const { apikey } = req.query;

  try {
    if (!apikey) {
      return next(
        new ApiError(
          HttpStatus.FORBIDDEN,
          'Forbidden, please provide an apikey',
        ),
      );
    }

    const apiKey = await getApiKey(apikey.toString());
    if (!apiKey || apiKey.isExpired) {
      return next(
        new ApiError(
          HttpStatus.FORBIDDEN,
          'Forbidden, the key is not found or expired',
        ),
      );
    }

    (req as RequestWithApiKey).apiKey = apiKey;

    return next();
  } catch (error) {
    return next(
      new ApiError(
        HttpStatus.UNAUTHORIZED,
        HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
      ),
    );
  }
}
