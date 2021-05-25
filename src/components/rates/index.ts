import dayjs from 'dayjs';
import { Currency } from './rateModel';
import { createRate, getLatestRates } from './ratesController';

export async function initRates(): Promise<void> {
  const rate = await getLatestRates();
  if (!rate) {
    const rates = [
      {
        currency: Currency.USD,
        rate: 1,
      },
      {
        currency: Currency.RUB,
        rate: 30,
      },
      {
        currency: Currency.EUR,
        rate: 0.8,
      },
      {
        currency: Currency.JPY,
        rate: 100,
      },
    ];
    await createRate(rates, dayjs('2007-01-01', 'YYYY-MM-DD').toDate());
    await createRate(rates, dayjs('2007-01-02', 'YYYY-MM-DD').toDate());
  }
}
