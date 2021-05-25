import { getModelForClass, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import dayjs from 'dayjs';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ApiKey extends Base {}

export class ApiKey extends TimeStamps {
  @prop({ required: true })
  key!: string;

  @prop({ required: true })
  expireAt!: Date;

  get isExpired(): boolean {
    return !dayjs(this.expireAt).isAfter(dayjs());
  }
}

export const ApiKeyModel = getModelForClass(ApiKey, {
  schemaOptions: { timestamps: true },
});
