import axios from 'axios';

export type CurrencyFreaksLatestResponse = {
  date: string;
  base: string;
  rates: { [key: string]: number };
};

export class CurrencyFreaksService {
  static baseUrl = 'https://api.currencyfreaks.com';

  static async getLatestRates(): Promise<CurrencyFreaksLatestResponse> {
    const { data } = await axios.get(`${this.baseUrl}/latest`, {
      params: {
        apikey: process.env.CURRENCY_FREAKS_API_KEY,
      },
    });

    if (data?.base) {
      return data;
    }

    throw new Error('Currency Freaks api request error');
  }
}

export default CurrencyFreaksService;
