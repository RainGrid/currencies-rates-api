import dayjs from 'dayjs';
import { createApiKey, getApiKeys } from './apiKeysController';

export async function initKeys(): Promise<void> {
  const apikeys = await getApiKeys();
  if (!apikeys.length) {
    await createApiKey('test', dayjs().add(1, 'month').toDate());
  }
}
