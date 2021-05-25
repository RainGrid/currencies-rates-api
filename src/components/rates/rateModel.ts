import { getModelForClass, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export enum Currency {
  RUB = 'RUB',
  EUR = 'EUR',
  USD = 'USD',
  JPY = 'JPY',
}

export const BaseCurrency = Currency.USD;

export function roundNumber(val: string | number, digits: number): number {
  return Math.round(+val * 10 ** digits) / 10 ** digits;
}

export class CurrencyRate {
  @prop({ required: true, enum: Currency })
  currency!: Currency;

  @prop({
    required: true,
    get: (val: string) => roundNumber(val, 4),
    set: (val: string) => roundNumber(val, 4),
  })
  rate!: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Rate extends Base {}

export class Rate extends TimeStamps {
  @prop({ type: () => CurrencyRate })
  rates!: CurrencyRate[];
}

export const RateModel = getModelForClass(Rate, {
  schemaOptions: { timestamps: true },
});
