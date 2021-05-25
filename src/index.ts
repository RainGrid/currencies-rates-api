import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../.env` });
import app from './app';
import { ratesCron } from './crons';
import { connectMongo } from './loaders/mongo';
import Logger from './utils/Logger';

connectMongo();

const port = process.env.APP_PORT || '3000';
app.listen(port, () => {
  Logger.info('Server started at port ' + port);

  ratesCron.start();
});
