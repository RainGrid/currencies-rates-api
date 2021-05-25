import { DocumentType } from '@typegoose/typegoose';
import { ApiKey, ApiKeyModel } from './apiKeyModel';

export async function getApiKey(
  key: string,
): Promise<DocumentType<ApiKey> | null> {
  return ApiKeyModel.findOne({ key });
}

export async function createApiKey(
  key: string,
  expireAt: Date,
): Promise<DocumentType<ApiKey>> {
  const apiKey = new ApiKeyModel({
    key,
    expireAt,
  });

  await apiKey.save();

  return apiKey;
}

export async function getApiKeys(): Promise<DocumentType<ApiKey>[]> {
  return ApiKeyModel.find({});
}
