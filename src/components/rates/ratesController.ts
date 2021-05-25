import { DocumentType } from '@typegoose/typegoose';
import dayjs from 'dayjs';
import { FilterQuery } from 'mongoose';
import { Currency, CurrencyRate, Rate, RateModel } from './rateModel';

export async function createRate(
  rates: CurrencyRate[],
  date?: Date,
): Promise<DocumentType<Rate>> {
  const rate = new RateModel({
    rates,
    createdAt: date,
  });

  await rate.save();

  return rate;
}

export async function convertRate(
  from: Currency,
  to: Currency,
  amount: number,
): Promise<{
  amount: number;
  from: CurrencyRate;
  to: CurrencyRate;
  date: Date;
}> {
  const latestRate = await RateModel.findOne().sort({ createdAt: -1 });
  if (!latestRate) {
    throw new Error('No currencies rates exists');
  }

  const rateFrom = latestRate.rates.find((rate) => rate.currency === from);
  if (!rateFrom) {
    throw new Error('No "from" currency rate exists');
  }

  const rateTo = latestRate.rates.find((rate) => rate.currency === to);
  if (!rateTo) {
    throw new Error('No "to" currency rate exists');
  }

  if (isNaN(amount) || amount <= 0) {
    throw new Error('Amount must be a positive number');
  }

  const rateCoeff = rateFrom.rate / rateTo.rate;
  const convertedAmount = (1 / rateCoeff) * amount;

  return {
    amount: convertedAmount,
    from: rateFrom,
    to: rateTo,
    date: latestRate.createdAt!,
  };
}

export async function getLatestRates(
  date?: Date,
): Promise<DocumentType<Rate> | null> {
  const query: FilterQuery<DocumentType<Rate>> = {};
  if (date) {
    query.createdAt = {
      $gte: dayjs(date).startOf('day').toDate(),
      $lte: dayjs(date).endOf('day').toDate(),
    };
  }

  return RateModel.findOne(query)
    .select(['rates.currency', 'rates.rate', 'createdAt'])
    .sort({ createdAt: -1 });
}
