import Joi from 'joi';
import { Currency } from './rateModel';

export function getLatestRatesValidator(params: any): Joi.ValidationResult {
  const schema: Joi.ObjectSchema = Joi.object().keys({
    date: Joi.date().optional().options({ convert: true }).messages({
      'date.base': 'Wrong date string, format is YYYY-MM-DD',
    }),
  });

  return schema.validate(params);
}

export function getRatesConvertationValidator(
  params: any,
): Joi.ValidationResult {
  const currencyValidator = (value: any, helper: Joi.CustomHelpers<any>) => {
    if (value in Currency) {
      return value;
    } else {
      return helper.error('any.invalid');
    }
  };

  const schema: Joi.ObjectSchema = Joi.object().keys({
    amount: Joi.number().positive().default(1),
    from: Joi.string().required().custom(currencyValidator),
    to: Joi.string().required().custom(currencyValidator),
  });

  return schema.validate(params);
}
