import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { ApiError } from '../../errors';
import { BaseCurrency, Currency, roundNumber } from './rateModel';
import { convertRate, getLatestRates } from './ratesController';
import {
  getLatestRatesValidator,
  getRatesConvertationValidator,
} from './ratesValidator';

export async function getLatestRatesHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const { date } = req.query;

  try {
    const validationResult = getLatestRatesValidator({ date });
    if (validationResult.error) {
      return next(
        new ApiError(HttpStatus.BAD_REQUEST, validationResult.error.message),
      );
    }

    const rate = await getLatestRates(validationResult.value.date);

    if (!rate) {
      return next(new ApiError(HttpStatus.NOT_FOUND, 'Rates not found'));
    }

    return res.status(HttpStatus.OK).send({
      rates: rate.rates,
      date: rate.createdAt,
      base: BaseCurrency,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getRatesConvertationHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const { from, to, amount = 1 } = req.query;

  try {
    const validationResult = getRatesConvertationValidator({
      from,
      to,
      amount,
    });
    if (validationResult.error) {
      return next(
        new ApiError(HttpStatus.BAD_REQUEST, validationResult.error.message),
      );
    }

    const convertion = await convertRate(
      from as Currency,
      to as Currency,
      validationResult.value.amount,
    );

    return res.status(HttpStatus.OK).send({
      convertedAmount: roundNumber(convertion.amount, 2),
      query: { amount: roundNumber(amount.toString(), 1), from, to },
      currentRates: {
        [convertion.from.currency]: roundNumber(convertion.from.rate, 1),
        [convertion.to.currency]: roundNumber(convertion.to.rate, 1),
      },
      date: convertion.date,
    });
  } catch (error) {
    return next(error);
  }
}
