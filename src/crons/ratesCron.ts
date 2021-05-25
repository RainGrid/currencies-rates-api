import { CronJob } from 'cron';
import { Currency, CurrencyRate } from '../components/rates/rateModel';
import {
  createRate,
  getLatestRates,
} from '../components/rates/ratesController';
import { CurrencyFreaksService } from '../services';
import Logger from '../utils/Logger';

async function ratesCronJob() {
  try {
    const rateResponse = await CurrencyFreaksService.getLatestRates();
    const rates: CurrencyRate[] = [];
    for (const currency in rateResponse.rates) {
      if (currency in Currency) {
        rates.push({
          currency: currency as Currency,
          rate: rateResponse.rates[currency],
        });
      }
    }
    await createRate(rates);
  } catch (error) {
    Logger.error(error);
  }
}

async function ratesCronOnStart() {
  try {
    const rate = await getLatestRates(new Date());
    if (!rate) {
      await ratesCronJob();
    }
  } catch (error) {
    Logger.error(error);
  }
}

ratesCronOnStart();

export default new CronJob('0 0 */12 * * *', async () => {
  await ratesCronJob();
});
