import { Router } from 'express';
import { apiKeyMiddleware } from '../apikeys/apiKeysAPI';
import { getLatestRatesHandler, getRatesConvertationHandler } from './ratesAPI';
import {
  convertLimiterMiddleware,
  latestLimiterMiddleware,
} from './ratesLimits';
import { ratesLoggerMiddleware } from './ratesLogger';

const ratesRouter = Router();

ratesRouter.get(
  '/latest',
  apiKeyMiddleware,
  ratesLoggerMiddleware('latest'),
  latestLimiterMiddleware,
  getLatestRatesHandler,
);
ratesRouter.get(
  '/latest/convert',
  apiKeyMiddleware,
  ratesLoggerMiddleware('convert'),
  convertLimiterMiddleware,
  getRatesConvertationHandler,
);

export default ratesRouter;
