import mongoose from 'mongoose';
import { initKeys } from '../components/apikeys';
import { initRates } from '../components/rates';
import Logger from '../utils/Logger';

async function initDB(): Promise<void> {
  try {
    await initKeys();
    await initRates();
  } catch (error) {
    Logger.error(error);
  }
}

export function connectMongo(): void {
  mongoose.connect(process.env.MONGO_URL!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on('open', () => {
    Logger.info('MongoDB connected');

    initDB();
  });

  mongoose.connection.on('error', (error) => {
    Logger.error(error);
  });
}
